using Microsoft.EntityFrameworkCore;
using MinhasFinancas.Application.DTOs;
using MinhasFinancas.Application.Services;
using MinhasFinancas.Domain.Entities;
using MinhasFinancas.Infrastructure.Data;
using FluentAssertions;

namespace MinhasFinancas.IntegrationTests.Tests;

public class TotaisIntegrationTests : IntegrationTestBase
{
    private readonly PessoaService _pessoaService;
    private readonly CategoriaService _categoriaService;
    private readonly TransacaoService _transacaoService;

    public TotaisIntegrationTests()
    {
        var (unitOfWork, context) = CreateUnitOfWork();
        _pessoaService = new PessoaService(unitOfWork);
        _categoriaService = new CategoriaService(unitOfWork);
        _transacaoService = new TransacaoService(unitOfWork);
        DbContext = context;
    }

    private MinhasFinancasDbContext DbContext { get; }

    [Fact]
    public async Task ExcluirPessoa_ExcluiTransacoesEmCascata()
    {
        var pessoa = await _pessoaService.CreateAsync(new CreatePessoaDto
        {
            Nome = "Joao",
            DataNascimento = DateTime.Today.AddYears(-30)
        });
        var categoria = await _categoriaService.CreateAsync(new CreateCategoriaDto
        {
            Descricao = "Alimentacao",
            Finalidade = Categoria.EFinalidade.Despesa
        });

        await _transacaoService.CreateAsync(new CreateTransacaoDto
        {
            Descricao = "Tx 1",
            Valor = 100m,
            Tipo = Transacao.ETipo.Despesa,
            CategoriaId = categoria.Id,
            PessoaId = pessoa.Id,
            Data = DateTime.Today
        });
        await _transacaoService.CreateAsync(new CreateTransacaoDto
        {
            Descricao = "Tx 2",
            Valor = 200m,
            Tipo = Transacao.ETipo.Despesa,
            CategoriaId = categoria.Id,
            PessoaId = pessoa.Id,
            Data = DateTime.Today
        });

        await _pessoaService.DeleteAsync(pessoa.Id);

        var transacoes = await DbContext.Transacoes
            .Where(t => t.PessoaId == pessoa.Id)
            .ToListAsync();
        transacoes.Should().BeEmpty();
    }

    [Fact]
    public async Task ExcluirPessoa_SemTransacoes_Sucesso()
    {
        var pessoa = await _pessoaService.CreateAsync(new CreatePessoaDto
        {
            Nome = "Sem Transacoes",
            DataNascimento = DateTime.Today.AddYears(-40)
        });

        var act = () => _pessoaService.DeleteAsync(pessoa.Id);

        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task CriarTransacaoDepoisExcluirPessoa_ExclusaoEmCascataFunciona()
    {
        var pessoa = await _pessoaService.CreateAsync(new CreatePessoaDto
        {
            Nome = "Test Cascade",
            DataNascimento = DateTime.Today.AddYears(-25)
        });
        var categoria = await _categoriaService.CreateAsync(new CreateCategoriaDto
        {
            Descricao = "Investimentos",
            Finalidade = Categoria.EFinalidade.Ambas
        });
        await _transacaoService.CreateAsync(new CreateTransacaoDto
        {
            Descricao = "Acao",
            Valor = 500m,
            Tipo = Transacao.ETipo.Receita,
            CategoriaId = categoria.Id,
            PessoaId = pessoa.Id,
            Data = DateTime.Today
        });

        await _pessoaService.DeleteAsync(pessoa.Id);

        var restantes = await DbContext.Transacoes
            .Where(t => t.PessoaId == pessoa.Id)
            .ToListAsync();
        restantes.Should().BeEmpty();
    }

    [Fact]
    public async Task MultiplasTransacoesMesmaPessoa_TodasPersistidas()
    {
        var pessoa = await _pessoaService.CreateAsync(new CreatePessoaDto
        {
            Nome = "Multi Tx",
            DataNascimento = DateTime.Today.AddYears(-35)
        });
        var categoriaDespesa = await _categoriaService.CreateAsync(new CreateCategoriaDto
        {
            Descricao = "Supermercado",
            Finalidade = Categoria.EFinalidade.Despesa
        });
        var categoriaReceita = await _categoriaService.CreateAsync(new CreateCategoriaDto
        {
            Descricao = "Salario",
            Finalidade = Categoria.EFinalidade.Receita
        });

        await _transacaoService.CreateAsync(new CreateTransacaoDto
        {
            Descricao = "Tx 1",
            Valor = 50m,
            Tipo = Transacao.ETipo.Despesa,
            CategoriaId = categoriaDespesa.Id,
            PessoaId = pessoa.Id,
            Data = DateTime.Today
        });
        await _transacaoService.CreateAsync(new CreateTransacaoDto
        {
            Descricao = "Tx 2",
            Valor = 1000m,
            Tipo = Transacao.ETipo.Receita,
            CategoriaId = categoriaReceita.Id,
            PessoaId = pessoa.Id,
            Data = DateTime.Today.AddDays(-1)
        });
        await _transacaoService.CreateAsync(new CreateTransacaoDto
        {
            Descricao = "Tx 3",
            Valor = 75m,
            Tipo = Transacao.ETipo.Despesa,
            CategoriaId = categoriaDespesa.Id,
            PessoaId = pessoa.Id,
            Data = DateTime.Today.AddDays(-2)
        });

        var todas = await _transacaoService.GetAllAsync();
        var transacoesPessoa = todas.Items.Where(t => t.PessoaId == pessoa.Id).ToList();

        transacoesPessoa.Should().HaveCount(3);
    }

    [Fact]
    public async Task ListarTodasTransacoes_OrdenadasPorDataDecrescente()
    {
        var pessoa = await _pessoaService.CreateAsync(new CreatePessoaDto
        {
            Nome = "Ordenacao",
            DataNascimento = DateTime.Today.AddYears(-28)
        });
        var categoria = await _categoriaService.CreateAsync(new CreateCategoriaDto
        {
            Descricao = "Cat",
            Finalidade = Categoria.EFinalidade.Despesa
        });

        await _transacaoService.CreateAsync(new CreateTransacaoDto
        {
            Descricao = "Mais antiga",
            Valor = 10m,
            Tipo = Transacao.ETipo.Despesa,
            CategoriaId = categoria.Id,
            PessoaId = pessoa.Id,
            Data = DateTime.Today.AddDays(-5)
        });
        await _transacaoService.CreateAsync(new CreateTransacaoDto
        {
            Descricao = "Mais recente",
            Valor = 20m,
            Tipo = Transacao.ETipo.Despesa,
            CategoriaId = categoria.Id,
            PessoaId = pessoa.Id,
            Data = DateTime.Today
        });

        var result = await _transacaoService.GetAllAsync();

        result.Items.Should().HaveCount(2);
        result.Items.First().Descricao.Should().Be("Mais recente");
        result.Items.Last().Descricao.Should().Be("Mais antiga");
    }

}
