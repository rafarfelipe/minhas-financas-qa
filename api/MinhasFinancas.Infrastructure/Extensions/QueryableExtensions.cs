using Microsoft.EntityFrameworkCore;
using MinhasFinancas.Domain.ValueObjects;
using System.Linq.Expressions;
using System.Linq;
using MinhasFinancas.Domain.Interfaces;

namespace MinhasFinancas.Infrastructure.Extensions;

public static class QueryableExtensions
{
    public static async Task<PagedResult<T>> PaginateAsync<T>(this IQueryable<T> query, PagedRequest? pageRequest = null)
    {
        var page = pageRequest ?? new PagedRequest();
        var total = await query.CountAsync();
        var items = await query.Skip(page.Skip).Take(page.PageSize).ToListAsync();

        return new PagedResult<T>
        {
            Items = items,
            TotalCount = total,
            Page = page.Page,
            PageSize = page.PageSize
        };
    }

    /// <summary>
    /// Aplica uma specification que define projeção (select) e ordenação.
    /// </summary>
    public static IQueryable<TDto> ApplySpecification<TEntity, TDto>(this IQueryable<TEntity> query, ISpecification<TEntity, TDto> specification)
    {
        var q = query;

        if (specification.Where != null)
        {
            q = q.Where(specification.Where);
        }

        if (specification.OrderBy != null)
        {
            q = specification.OrderByDescending ? q.OrderByDescending(specification.OrderBy) : q.OrderBy(specification.OrderBy);
        }

        return q.Select(specification.Select);
    }
}
