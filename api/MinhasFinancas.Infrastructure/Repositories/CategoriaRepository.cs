using System.Threading.Tasks;
using MinhasFinancas.Domain.Entities;
using MinhasFinancas.Domain.Interfaces;
using MinhasFinancas.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using MinhasFinancas.Infrastructure.Extensions;

namespace MinhasFinancas.Infrastructure.Repositories;

/// <summary>
/// Implementação do repositório de Categorias.
/// </summary>
public class CategoriaRepository : RepositoryBase<Categoria>, ICategoriaRepository
{
    /// <summary>
    /// Construtor.
    /// </summary>
    public CategoriaRepository(MinhasFinancasDbContext context) : base(context) { }
}