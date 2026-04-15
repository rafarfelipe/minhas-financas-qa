using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using MinhasFinancas.Domain.Entities;
using MinhasFinancas.Domain.ValueObjects;
using MinhasFinancas.Infrastructure.Data;
using MinhasFinancas.Infrastructure.Extensions;
using MinhasFinancas.Domain.Interfaces;

namespace MinhasFinancas.Infrastructure.Repositories;

/// <summary>
/// Implementação base para repositórios.
/// </summary>
public class RepositoryBase<TEntity> : IRepositoryBase<TEntity> where TEntity : EntityBase
{
    protected readonly MinhasFinancasDbContext _context;
    protected readonly DbSet<TEntity> _dbSet;

    /// <summary>
    /// Construtor do repositório base.
    /// </summary>
    /// <param name="context">Contexto do banco de dados.</param>
    public RepositoryBase(MinhasFinancasDbContext context)
    {
        _context = context;
        _dbSet = context.Set<TEntity>();
    }

    /// <summary>
    /// Obtém entidades com paginação.
    /// </summary>
    /// <param name="pageRequest">Parâmetros de paginação e busca.</param>
    /// <returns>Resultado paginado contendo as entidades.</returns>
    public async Task<PagedResult<TEntity>> GetPagedAsync(PagedRequest? pageRequest = null)
    {
        return await _dbSet.AsNoTracking().OrderBy(p => p.Id).PaginateAsync(pageRequest);
    }

    /// <summary>
    /// Obtém entidades projetadas para um DTO usando uma specification e paginação.
    /// </summary>
    /// <typeparam name="TDto">O tipo do DTO de destino.</typeparam>
    /// <param name="pageRequest">Parâmetros de paginação e busca.</param>
    /// <param name="specification">A especificação contendo projeção, ordenação e filtros.</param>
    /// <returns>Resultado paginado contendo os DTOs projetados.</returns>
    public async Task<PagedResult<TDto>> GetPagedAsync<TDto>(PagedRequest? pageRequest = null, ISpecification<TEntity, TDto>? specification = null)
    {
        if (specification == null)
        {
            if (typeof(TDto) != typeof(TEntity))
                throw new ArgumentNullException(nameof(specification), "Specification required when TDto != TEntity");

            var query = _dbSet.AsNoTracking().OrderBy(p => p.Id).Cast<TDto>();
            return await query.PaginateAsync(pageRequest);
        }

        var projected = _dbSet.AsNoTracking().ApplySpecification(specification);
        return await projected.PaginateAsync(pageRequest);
    }

    /// <summary>
    /// Obtém uma entidade pelo ID.
    /// </summary>
    public async Task<TEntity?> GetByIdAsync(Guid id)
    {
        return await _dbSet.FindAsync(id);
    }

    /// <summary>
    /// Obtém todas as entidades.
    /// </summary>
    public async Task<IEnumerable<TEntity>> GetAllAsync()
    {
        return await _dbSet.AsNoTracking().ToListAsync();
    }

    /// <summary>
    /// Obtém entidades que satisfazem uma condição.
    /// </summary>
    public async Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate)
    {
        return await _dbSet.Where(predicate).ToListAsync();
    }



    /// <summary>
    /// Adiciona uma nova entidade.
    /// </summary>
    public async Task AddAsync(TEntity entity)
    {
        await _dbSet.AddAsync(entity);
    }

    /// <summary>
    /// Atualiza uma entidade existente.
    /// </summary>
    public Task UpdateAsync(TEntity entity)
    {
        _dbSet.Update(entity);
        return Task.CompletedTask;
    }

    /// <summary>
    /// Remove uma entidade.
    /// </summary>
    public Task DeleteAsync(TEntity entity)
    {
        _dbSet.Remove(entity);
        return Task.CompletedTask;
    }

    /// <summary>
    /// Remove uma entidade pelo ID.
    /// </summary>
    public async Task DeleteAsync(Guid id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
        }
    }
}
