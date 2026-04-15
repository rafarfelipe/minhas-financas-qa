using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MinhasFinancas.Domain.Entities;
using MinhasFinancas.Domain.Interfaces;
using MinhasFinancas.Infrastructure.Data;
using MinhasFinancas.Infrastructure.Extensions;

namespace MinhasFinancas.Infrastructure.Repositories;

/// <summary>
/// Implementação do repositório de Transações.
/// </summary>
public class TransacaoRepository : RepositoryBase<Transacao>, ITransacaoRepository
{
    /// <summary>
    /// Construtor.
    /// </summary>
    public TransacaoRepository(MinhasFinancasDbContext context) : base(context) { }

    /// <summary>
    /// Obtém uma transação pelo ID.
    /// </summary>
    public new async Task<Transacao?> GetByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(t => t.Categoria)
            .Include(t => t.Pessoa)
            .FirstOrDefaultAsync(t => t.Id == id);
    }
}