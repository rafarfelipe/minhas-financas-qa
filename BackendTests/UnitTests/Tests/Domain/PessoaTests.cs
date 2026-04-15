using MinhasFinancas.Domain.Entities;
using FluentAssertions;

namespace MinhasFinancas.UnitTests.Tests.Domain;

public class PessoaTests
{
    [Fact]
    public void EhMaiorDeIdade_18Anos_RetornaVerdadeiro()
    {
        var dezoitoAnosAtras = DateTime.Today.AddYears(-18);
        var pessoa = new Pessoa { Nome = "Test", DataNascimento = dezoitoAnosAtras };

        pessoa.EhMaiorDeIdade().Should().BeTrue();
    }

    [Fact]
    public void EhMaiorDeIdade_17AnosE364Dias_RetornaFalso()
    {
        var data = DateTime.Today.AddYears(-18).AddDays(1);
        var pessoa = new Pessoa { Nome = "Test", DataNascimento = data };

        pessoa.EhMaiorDeIdade().Should().BeFalse();
    }

    [Fact]
    public void EhMaiorDeIdade_Crianca_RetornaFalso()
    {
        var pessoa = new Pessoa { Nome = "Pedro", DataNascimento = new DateTime(2010, 10, 20) };

        pessoa.EhMaiorDeIdade().Should().BeFalse();
        pessoa.Idade.Should().BeLessThan(18);
    }

    [Fact]
    public void EhMaiorDeIdade_Adulto_RetornaVerdadeiro()
    {
        var pessoa = new Pessoa { Nome = "Joao", DataNascimento = new DateTime(1990, 1, 1) };

        pessoa.EhMaiorDeIdade().Should().BeTrue();
        pessoa.Idade.Should().BeGreaterThanOrEqualTo(18);
    }

    [Fact]
    public void CalcularIdade_RecemNascido_RetornaZero()
    {
        var pessoa = new Pessoa { Nome = "Bebe", DataNascimento = DateTime.Today };

        pessoa.Idade.Should().Be(0);
    }

    [Fact]
    public void CalcularIdade_NascidoEm29Fev_LimiteAnoBissexto()
    {
        var pessoa = new Pessoa { Nome = "Test", DataNascimento = new DateTime(2000, 2, 29) };
        var idadeEsperada = DateTime.Today.Year - 2000;
        var aniversarioNoAnoAtual = DateTime.IsLeapYear(DateTime.Today.Year)
            ? new DateTime(DateTime.Today.Year, 2, 29)
            : new DateTime(DateTime.Today.Year, 3, 1);
        if (DateTime.Today < aniversarioNoAnoAtual)
            idadeEsperada--;

        pessoa.Idade.Should().Be(idadeEsperada);
    }

    [Fact]
    public void CalcularIdade_DataFutura_IdadeNegativa()
    {
        var pessoa = new Pessoa { Nome = "Test", DataNascimento = DateTime.Today.AddDays(1) };

        pessoa.Idade.Should().BeLessThan(0);
        pessoa.EhMaiorDeIdade().Should().BeFalse();
    }
}
