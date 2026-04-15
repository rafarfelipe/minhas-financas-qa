using Microsoft.EntityFrameworkCore;
using MinhasFinancas.Application.Services;
using MinhasFinancas.Domain.Interfaces;
using MinhasFinancas.Infrastructure;
using MinhasFinancas.Infrastructure.Data;
using MinhasFinancas.Infrastructure.Queries;

namespace MinhasFinancas.API.Extensions;

/// <summary>
/// Extensões para configuração da injeção de dependência.
/// </summary>
public static class DependencyInjectionExtensions
{
    /// <summary>
    /// Adiciona os serviços da aplicação ao container DI.
    /// </summary>
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Unit of Work
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Services
        services.AddScoped<IPessoaService, PessoaService>();
        services.AddScoped<ICategoriaService, CategoriaService>();
        services.AddScoped<ITransacaoService, TransacaoService>();
        services.AddScoped<ITotalService, TotalService>();

        return services;
    }

    /// <summary>
    /// Adiciona os serviços de infraestrutura ao container DI.
    /// </summary>
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // DbContext
        services.AddDbContext<MinhasFinancasDbContext>(options =>
            options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

        // Queries
        services.AddScoped<ITotaisQuery, TotaisQuery>();

        // In-memory caching for frequently requested queries
        services.AddMemoryCache();

        return services;
    }
}
