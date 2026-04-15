using MinhasFinancas.Domain.Entities;
using FluentAssertions;

namespace MinhasFinancas.UnitTests.Tests.Domain;

public class CategoriaTests
{
    [Fact]
    public void PermiteTipo_CategoriaDespesa_TransacaoDespesa_RetornaVerdadeiro()
    {
        var categoria = new Categoria { Descricao = "Test", Finalidade = Categoria.EFinalidade.Despesa };

        categoria.PermiteTipo(Transacao.ETipo.Despesa).Should().BeTrue();
    }

    [Fact]
    public void PermiteTipo_CategoriaDespesa_TransacaoReceita_RetornaFalso()
    {
        var categoria = new Categoria { Descricao = "Test", Finalidade = Categoria.EFinalidade.Despesa };

        categoria.PermiteTipo(Transacao.ETipo.Receita).Should().BeFalse();
    }

    [Fact]
    public void PermiteTipo_CategoriaReceita_TransacaoReceita_RetornaVerdadeiro()
    {
        var categoria = new Categoria { Descricao = "Test", Finalidade = Categoria.EFinalidade.Receita };

        categoria.PermiteTipo(Transacao.ETipo.Receita).Should().BeTrue();
    }

    [Fact]
    public void PermiteTipo_CategoriaReceita_TransacaoDespesa_RetornaFalso()
    {
        var categoria = new Categoria { Descricao = "Test", Finalidade = Categoria.EFinalidade.Receita };

        categoria.PermiteTipo(Transacao.ETipo.Despesa).Should().BeFalse();
    }

    [Fact]
    public void PermiteTipo_CategoriaAmbas_TransacaoDespesa_RetornaVerdadeiro()
    {
        var categoria = new Categoria { Descricao = "Test", Finalidade = Categoria.EFinalidade.Ambas };

        categoria.PermiteTipo(Transacao.ETipo.Despesa).Should().BeTrue();
    }

    [Fact]
    public void PermiteTipo_CategoriaAmbas_TransacaoReceita_RetornaVerdadeiro()
    {
        var categoria = new Categoria { Descricao = "Test", Finalidade = Categoria.EFinalidade.Ambas };

        categoria.PermiteTipo(Transacao.ETipo.Receita).Should().BeTrue();
    }

    [Fact]
    public void PermiteTipo_FinalidadePadrao_ComportaComoDespesa()
    {
        var categoria = new Categoria { Descricao = "Test" };

        categoria.Finalidade.Should().Be(Categoria.EFinalidade.Despesa);
        categoria.PermiteTipo(Transacao.ETipo.Despesa).Should().BeTrue();
        categoria.PermiteTipo(Transacao.ETipo.Receita).Should().BeFalse();
    }
}
