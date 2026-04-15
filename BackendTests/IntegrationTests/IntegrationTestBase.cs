using Microsoft.EntityFrameworkCore;
using MinhasFinancas.Infrastructure.Data;
using MinhasFinancas.Infrastructure;
using MinhasFinancas.Domain.Interfaces;
using Microsoft.Data.Sqlite;

namespace MinhasFinancas.IntegrationTests;

public abstract class IntegrationTestBase
{
    protected (IUnitOfWork UnitOfWork, MinhasFinancasDbContext Context) CreateUnitOfWork()
    {
        var connection = new SqliteConnection("Filename=:memory:");
        connection.Open();
        var options = new DbContextOptionsBuilder<MinhasFinancasDbContext>()
            .UseSqlite(connection)
            .Options;

        var context = new MinhasFinancasDbContext(options);
        context.Database.EnsureCreated();
        return (new UnitOfWork(context), context);
    }
}
