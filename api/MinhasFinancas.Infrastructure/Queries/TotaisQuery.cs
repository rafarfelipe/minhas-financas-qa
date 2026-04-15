using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using MinhasFinancas.Domain.ValueObjects;
using MinhasFinancas.Domain.Entities;
using MinhasFinancas.Domain.Interfaces;
using MinhasFinancas.Infrastructure.Data;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using MinhasFinancas.Infrastructure.Extensions;

namespace MinhasFinancas.Infrastructure.Queries;

/// <summary>
/// Classe para consultas de totais, sem tracking.
/// </summary>
public class TotaisQuery : ITotaisQuery
{
    private readonly MinhasFinancasDbContext _context;
    private readonly Microsoft.Extensions.Caching.Memory.IMemoryCache _cache;

    /// <summary>
    /// Construtor.
    /// </summary>
    public TotaisQuery(MinhasFinancasDbContext context, Microsoft.Extensions.Caching.Memory.IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    /// <summary>
    /// Obtém totais por pessoa.
    /// Usa consultas baseadas em conjuntos (sem navegar coleções) e soma nula segura.
    /// </summary>
    public async Task<MinhasFinancas.Domain.ValueObjects.PagedResult<TotalPorPessoa>> GetTotaisPorPessoaAsync(TotaisPorPessoaFilter? filter = null, MinhasFinancas.Domain.ValueObjects.PagedRequest? pageRequest = null)
    {
        var f = filter?.WithNormalizedDates();
        var periodo = f?.Periodo;
        var pessoaId = f?.Pessoa?.Id;

        var pessoasQuery = _context.Pessoas.AsNoTracking();
        if (pessoaId != null)
            pessoasQuery = pessoasQuery.Where(p => p.Id == pessoaId.Value);

        var transacoesFiltered = _context.Transacoes
            .AsNoTracking()
            .Where(TotaisFilters.ToDatePredicate(periodo));
        var query = pessoasQuery
            .Select(p => new TotalPorPessoa
            {
                PessoaId = p.Id,
                Nome = p.Nome,
                TotalReceitas = transacoesFiltered
                    .Where(t => t.PessoaId == p.Id && t.Tipo == Transacao.ETipo.Receita)
                    .Select(t => (decimal?)t.Valor)
                    .Sum() ?? 0m,
                TotalDespesas = transacoesFiltered
                    .Where(t => t.PessoaId == p.Id && t.Tipo == Transacao.ETipo.Despesa)
                    .Select(t => (decimal?)t.Valor)
                    .Sum() ?? 0m
            });

        var cacheKey = $"totais:porpessoa:{filter?.Periodo?.DataInicio?.ToString("s")}:{filter?.Periodo?.DataFim?.ToString("s")}:{filter?.Pessoa?.Id}:{pageRequest?.Page}:{pageRequest?.PageSize}:{pageRequest?.Search}";
        return await _cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.SlidingExpiration = TimeSpan.FromMinutes(1);
            return await query.PaginateAsync(pageRequest);
        });
    }

    /// <summary>
    /// Obtém totais por categoria.
    /// Usa consultas baseadas em conjuntos (sem navegar coleções) e soma nula segura.
    /// </summary>
    public async Task<MinhasFinancas.Domain.ValueObjects.PagedResult<TotalPorCategoria>> GetTotaisPorCategoriaAsync(TotaisPorCategoriaFilter? filter = null, MinhasFinancas.Domain.ValueObjects.PagedRequest? pageRequest = null)
    {
        var f = filter?.WithNormalizedDates();
        var periodo = f?.Periodo;

        var categoriasQuery = _context.Categorias.AsNoTracking();

        var transacoesFiltered = _context.Transacoes
            .AsNoTracking()
            .Where(TotaisFilters.ToDatePredicate(periodo));
        var query = categoriasQuery
            .Select(c => new TotalPorCategoria
            {
                CategoriaId = c.Id,
                Descricao = c.Descricao,
                TotalReceitas = transacoesFiltered
                    .Where(t => t.CategoriaId == c.Id && t.Tipo == Transacao.ETipo.Receita)
                    .Select(t => (decimal?)t.Valor)
                    .Sum() ?? 0m,
                TotalDespesas = transacoesFiltered
                    .Where(t => t.CategoriaId == c.Id && t.Tipo == Transacao.ETipo.Despesa)
                    .Select(t => (decimal?)t.Valor)
                    .Sum() ?? 0m
            });

        var cacheKey = $"totais:porcategoria:{filter?.Periodo?.DataInicio?.ToString("s")}:{filter?.Periodo?.DataFim?.ToString("s")}:{pageRequest?.Page}:{pageRequest?.PageSize}";
        return await _cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.SlidingExpiration = TimeSpan.FromMinutes(1);
            return await query.PaginateAsync(pageRequest);
        });
    }
}
