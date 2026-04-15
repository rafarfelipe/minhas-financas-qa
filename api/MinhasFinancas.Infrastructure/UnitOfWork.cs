using MinhasFinancas.Domain.Interfaces;
using MinhasFinancas.Infrastructure.Data;

namespace MinhasFinancas.Infrastructure;

/// <summary>
/// Implementação do Unit of Work.
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly MinhasFinancasDbContext _context;
    private IPessoaRepository? _pessoas;
    private ICategoriaRepository? _categorias;
    private ITransacaoRepository? _transacoes;

    /// <summary>
    /// Construtor.
    /// </summary>
    public UnitOfWork(MinhasFinancasDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Repositório de Pessoas.
    /// </summary>
    public IPessoaRepository Pessoas => _pessoas ??= new Repositories.PessoaRepository(_context);

    /// <summary>
    /// Repositório de Categorias.
    /// </summary>
    public ICategoriaRepository Categorias => _categorias ??= new Repositories.CategoriaRepository(_context);

    /// <summary>
    /// Repositório de Transações.
    /// </summary>
    public ITransacaoRepository Transacoes => _transacoes ??= new Repositories.TransacaoRepository(_context);

    /// <summary>
    /// Salva todas as mudanças.
    /// </summary>
    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Inicia uma transação.
    /// </summary>
    public async Task BeginTransactionAsync()
    {
        await _context.Database.BeginTransactionAsync();
    }

    /// <summary>
    /// Confirma a transação.
    /// </summary>
    public async Task CommitAsync()
    {
        await _context.Database.CommitTransactionAsync();
    }

    /// <summary>
    /// Reverte a transação.
    /// </summary>
    public async Task RollbackAsync()
    {
        await _context.Database.RollbackTransactionAsync();
    }

    /// <summary>
    /// Libera recursos.
    /// </summary>
    public void Dispose()
    {
        _context.Dispose();
    }
}