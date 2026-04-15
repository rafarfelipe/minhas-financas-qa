using System.Reflection;
using MinhasFinancas.Domain.Entities;
using FluentAssertions;

namespace MinhasFinancas.UnitTests.Tests.Domain;

public class TransacaoTests
{
    private static void SetPessoa(Transacao transacao, Pessoa? pessoa)
    {
        var prop = typeof(Transacao).GetProperty(nameof(Transacao.Pessoa), BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
        prop!.GetSetMethod(true)!.Invoke(transacao, [pessoa]);
    }

    private static void SetCategoria(Transacao transacao, Categoria? categoria)
    {
        var prop = typeof(Transacao).GetProperty(nameof(Transacao.Categoria), BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
        prop!.GetSetMethod(true)!.Invoke(transacao, [categoria]);
    }

    [Fact]
    public void SetPessoa_AdultoComReceita_SemExcecao()
    {
        var pessoa = new Pessoa { Nome = "Adulto", DataNascimento = DateTime.Today.AddYears(-25) };
        var transacao = new Transacao
        {
            Descricao = "Salario",
            Valor = 1000,
            Tipo = Transacao.ETipo.Receita
        };

        var act = () => SetPessoa(transacao, pessoa);

        act.Should().NotThrow();
        transacao.PessoaId.Should().Be(pessoa.Id);
    }

    [Fact]
    public void SetPessoa_MenorComReceita_LancaInvalidOperationException()
    {
        var pessoa = new Pessoa { Nome = "Menor", DataNascimento = new DateTime(2010, 10, 20) };
        var transacao = new Transacao
        {
            Descricao = "Salario",
            Valor = 500,
            Tipo = Transacao.ETipo.Receita
        };

        var act = () => SetPessoa(transacao, pessoa);

        act.Should().Throw<TargetInvocationException>()
            .WithInnerException<InvalidOperationException>()
            .WithMessage("Menores de 18 anos não podem registrar receitas.");
    }

    [Fact]
    public void SetPessoa_MenorComDespesa_SemExcecao()
    {
        var pessoa = new Pessoa { Nome = "Menor", DataNascimento = new DateTime(2010, 10, 20) };
        var transacao = new Transacao
        {
            Descricao = "Lanche",
            Valor = 15,
            Tipo = Transacao.ETipo.Despesa
        };

        var act = () => SetPessoa(transacao, pessoa);

        act.Should().NotThrow();
        transacao.PessoaId.Should().Be(pessoa.Id);
    }

    [Fact]
    public void SetPessoa_AdultoComDespesa_SemExcecao()
    {
        var pessoa = new Pessoa { Nome = "Adulto", DataNascimento = DateTime.Today.AddYears(-30) };
        var transacao = new Transacao
        {
            Descricao = "Supermercado",
            Valor = 200,
            Tipo = Transacao.ETipo.Despesa
        };

        var act = () => SetPessoa(transacao, pessoa);

        act.Should().NotThrow();
    }

    [Fact]
    public void SetCategoria_DespesaComCategoriaDespesa_SemExcecao()
    {
        var categoria = new Categoria { Descricao = "Alimentacao", Finalidade = Categoria.EFinalidade.Despesa };
        var transacao = new Transacao
        {
            Descricao = "Compra",
            Valor = 50,
            Tipo = Transacao.ETipo.Despesa
        };

        var act = () => SetCategoria(transacao, categoria);

        act.Should().NotThrow();
        transacao.CategoriaId.Should().Be(categoria.Id);
    }

    [Fact]
    public void SetCategoria_ReceitaComCategoriaReceita_SemExcecao()
    {
        var categoria = new Categoria { Descricao = "Salario", Finalidade = Categoria.EFinalidade.Receita };
        var transacao = new Transacao
        {
            Descricao = "Recebimento",
            Valor = 1000,
            Tipo = Transacao.ETipo.Receita
        };

        var act = () => SetCategoria(transacao, categoria);

        act.Should().NotThrow();
    }

    [Theory]
    [InlineData(Transacao.ETipo.Despesa)]
    [InlineData(Transacao.ETipo.Receita)]
    public void SetCategoria_CategoriaAmbas_QualquerTipo_SemExcecao(Transacao.ETipo tipo)
    {
        var categoria = new Categoria { Descricao = "Investimentos", Finalidade = Categoria.EFinalidade.Ambas };
        var transacao = new Transacao
        {
            Descricao = "Test",
            Valor = 100,
            Tipo = tipo
        };

        var act = () => SetCategoria(transacao, categoria);

        act.Should().NotThrow();
    }

    [Fact]
    public void SetCategoria_DespesaComCategoriaReceita_LancaInvalidOperationException()
    {
        var categoria = new Categoria { Descricao = "Salario", Finalidade = Categoria.EFinalidade.Receita };
        var transacao = new Transacao
        {
            Descricao = "Compra",
            Valor = 50,
            Tipo = Transacao.ETipo.Despesa
        };

        var act = () => SetCategoria(transacao, categoria);

        act.Should().Throw<TargetInvocationException>()
            .WithInnerException<InvalidOperationException>()
            .WithMessage("Não é possível registrar despesa em categoria de receita.");
    }

    [Fact]
    public void SetCategoria_ReceitaComCategoriaDespesa_LancaInvalidOperationException()
    {
        var categoria = new Categoria { Descricao = "Alimentacao", Finalidade = Categoria.EFinalidade.Despesa };
        var transacao = new Transacao
        {
            Descricao = "Salario",
            Valor = 1000,
            Tipo = Transacao.ETipo.Receita
        };

        var act = () => SetCategoria(transacao, categoria);

        act.Should().Throw<TargetInvocationException>()
            .WithInnerException<InvalidOperationException>()
            .WithMessage("Não é possível registrar receita em categoria de despesa.");
    }

    [Fact]
    public void SetPessoa_Nulo_NaoLancaExcecao()
    {
        var transacao = new Transacao { Descricao = "Test", Valor = 100, Tipo = Transacao.ETipo.Despesa };

        var act = () => SetPessoa(transacao, null);

        act.Should().NotThrow();
    }

    [Fact]
    public void SetCategoria_Nulo_NaoLancaExcecao()
    {
        var transacao = new Transacao { Descricao = "Test", Valor = 100, Tipo = Transacao.ETipo.Despesa };

        var act = () => SetCategoria(transacao, null);

        act.Should().NotThrow();
    }

    [Fact]
    public void SetPessoa_AtribuiPessoaIdCorretamente()
    {
        var pessoa = new Pessoa { Nome = "Test", DataNascimento = DateTime.Today.AddYears(-20) };
        var transacao = new Transacao { Descricao = "Test", Valor = 100, Tipo = Transacao.ETipo.Despesa };

        SetPessoa(transacao, pessoa);

        transacao.PessoaId.Should().Be(pessoa.Id);
    }

    [Fact]
    public void SetCategoria_AtribuiCategoriaIdCorretamente()
    {
        var categoria = new Categoria { Descricao = "Test", Finalidade = Categoria.EFinalidade.Despesa };
        var transacao = new Transacao { Descricao = "Test", Valor = 100, Tipo = Transacao.ETipo.Despesa };

        SetCategoria(transacao, categoria);

        transacao.CategoriaId.Should().Be(categoria.Id);
    }
}
