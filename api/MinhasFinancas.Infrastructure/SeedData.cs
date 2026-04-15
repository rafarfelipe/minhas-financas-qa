using System;
using System.Linq;
using System.Threading.Tasks;
using MinhasFinancas.Domain.Entities;
using MinhasFinancas.Domain.Interfaces;

namespace MinhasFinancas.Infrastructure;

/// <summary>
/// Classe para popular dados iniciais no banco.
/// </summary>
public static class SeedData
{
    /// <summary>
    /// Popula dados iniciais.
    /// </summary>
    public static async Task InitializeAsync(IUnitOfWork unitOfWork)
    {
        // Verifica se já existem dados
        var pessoas = await unitOfWork.Pessoas.GetAllAsync();
        if (pessoas.Any())
        {
            return; // Já populado
        }

        // Categorias iniciais
        var categoria1 = new Categoria { Descricao = "Alimentação", Finalidade = Categoria.EFinalidade.Despesa };
        var categoria2 = new Categoria { Descricao = "Transporte", Finalidade = Categoria.EFinalidade.Despesa };
        var categoria3 = new Categoria { Descricao = "Salário", Finalidade = Categoria.EFinalidade.Receita };
        var categoria4 = new Categoria { Descricao = "Freelance", Finalidade = Categoria.EFinalidade.Receita };
        var categoria5 = new Categoria { Descricao = "Investimentos", Finalidade = Categoria.EFinalidade.Ambas };

        await unitOfWork.Categorias.AddAsync(categoria1);
        await unitOfWork.Categorias.AddAsync(categoria2);
        await unitOfWork.Categorias.AddAsync(categoria3);
        await unitOfWork.Categorias.AddAsync(categoria4);
        await unitOfWork.Categorias.AddAsync(categoria5);

        // Pessoas iniciais
        var pessoa1 = new Pessoa { Nome = "João Silva", DataNascimento = new DateTime(1990, 1, 1) };
        var pessoa2 = new Pessoa { Nome = "Maria Santos", DataNascimento = new DateTime(1985, 5, 15) };
        var pessoa3 = new Pessoa { Nome = "Pedro Oliveira", DataNascimento = new DateTime(2010, 10, 20) }; // Menor de idade

        await unitOfWork.Pessoas.AddAsync(pessoa1);
        await unitOfWork.Pessoas.AddAsync(pessoa2);
        await unitOfWork.Pessoas.AddAsync(pessoa3);

        // Transações iniciais
        var transacao1 = new Transacao
        {
            Descricao = "Compra no supermercado",
            Valor = 150.00m,
            Tipo = Transacao.ETipo.Despesa,
            Data = DateTime.Today.AddDays(-2),
            Categoria = categoria1,
            Pessoa = pessoa1
        };

        var transacao2 = new Transacao
        {
            Descricao = "Salário mensal",
            Valor = 3000.00m,
            Tipo = Transacao.ETipo.Receita,
            Data = DateTime.Today.AddDays(-10),
            Categoria = categoria3,
            Pessoa = pessoa1
        };

        var transacao3 = new Transacao
        {
            Descricao = "Freelance projeto",
            Valor = 500.00m,
            Tipo = Transacao.ETipo.Receita,
            Data = DateTime.Today.AddDays(-5),
            Categoria = categoria4,
            Pessoa = pessoa2
        };

        await unitOfWork.Transacoes.AddAsync(transacao1);
        await unitOfWork.Transacoes.AddAsync(transacao2);
        await unitOfWork.Transacoes.AddAsync(transacao3);

        await unitOfWork.SaveChangesAsync();
    }
}