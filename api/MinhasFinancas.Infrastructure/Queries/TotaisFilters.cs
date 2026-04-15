using System;
using System;
using System.Linq.Expressions;
using MinhasFinancas.Domain.Entities;
using MinhasFinancas.Domain.ValueObjects;

namespace MinhasFinancas.Infrastructure.Queries;

/// <summary>
/// Predicates separados para filtros de totais: um exclusivo para período (DataFilter)
/// e outros específicos para comparação por id (Pessoa/Categoria). Mantém a
/// responsabilidade de filtragem isolada e composável.
/// </summary>
public static class TotaisFilters
{
    /// <summary>
    /// Gera um predicate que aplica o filtro de datas (data início/data fim).
    /// </summary>
    public static Expression<Func<Transacao, bool>> ToDatePredicate(this DataFilter? filter)
    {
        var f = filter?.Normalize();
        DateTime? inicio = f?.DataInicio;
        DateTime? fim = f?.DataFim;

        return t => (inicio == null || t.Data >= inicio.Value)
                    && (fim == null || t.Data <= fim.Value);
    }
}
