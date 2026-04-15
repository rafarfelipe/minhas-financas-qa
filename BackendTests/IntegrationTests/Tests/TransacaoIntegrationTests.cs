using MinhasFinancas.Application.DTOs;
using MinhasFinancas.Application.Services;
using MinhasFinancas.Domain.Entities;
using FluentAssertions;

namespace MinhasFinancas.IntegrationTests.Tests;

public class TransacaoIntegrationTests : IntegrationTestBase
{
    private readonly TransacaoService _transacaoService;
    private readonly PessoaService _pessoaService;
    private readonly CategoriaService _categoriaService;

    public TransacaoIntegrationTests()
    {
        var (unitOfWork, _) = CreateUnitOfWork();
        _transacaoService = new TransacaoService(unitOfWork);
        _pessoaService = new PessoaService(unitOfWork);
        _categoriaService = new CategoriaService(unitOfWork);
    }

    [Fact]
    public async Task CriarAsync_TransacaoValida_Sucesso()
    {
        var pessoa = await _pessoaService.CreateAsync(new CreatePessoaDto
        {
            Nome = "Adulto",
            DataNascimento = DateTime.Today.AddYears(-25)
        });
        var categoria = await _categoriaService.CreateAsync(new CreateCategoriaDto
        {
            Descricao = "Alimentacao",
            Finalidade = Categoria.EFinalidade.Despesa
        });
        var dto = new CreateTransacaoDto
        {
            Descricao = "Supermercado",
            Valor = 150m,
            Tipo = Transacao.ETipo.Despesa,
            CategoriaId = categoria.Id,
            PessoaId = pessoa.Id,
            Data = DateTime.Today
        };

        var result = await _transacaoService.CreateAsync(dto);

        result.Id.Should().NotBeEmpty();
        result.Descricao.Should().Be("Supermercado");
        result.Valor.Should().Be(150m);
        result.PessoaNome.Should().Be("Adulto");
        result.CategoriaDescricao.Should().Be("Alimentacao");
    }

    [Fact]
    public async Task CriarAsync_MenorComReceita_LancaInvalidOperationException()
    {
        var menor = await _pessoaService.CreateAsync(new CreatePessoaDto
        {
            Nome = "Pedro",
            DataNascimento = new DateTime(2010, 10, 20)
        });
        var categoria = await _categoriaService.CreateAsync(new CreateCategoriaDto
        {
            Descricao = "Salario",
            Finalidade = Categoria.EFinalidade.Receita
        });
        var dto = new CreateTransacaoDto
        {
            Descricao = "Salario menor",
            Valor = 500m,
            Tipo = Transacao.ETipo.Receita,
            CategoriaId = categoria.Id,
            PessoaId = menor.Id,
            Data = DateTime.Today
        };

        await _transacaoService.Invoking(s => s.CreateAsync(dto))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Menores de 18 anos não podem registrar receitas.");
    }

    [Fact]
    public async Task CriarAsync_CategoriaIncompativel_LancaInvalidOperationException()
    {
        var pessoa = await _pessoaService.CreateAsync(new CreatePessoaDto
        {
            Nome = "Adulto",
            DataNascimento = DateTime.Today.AddYears(-25)
        });
        var categoriaReceita = await _categoriaService.CreateAsync(new CreateCategoriaDto
        {
            Descricao = "Salario",
            Finalidade = Categoria.EFinalidade.Receita
        });
        var dto = new CreateTransacaoDto
        {
            Descricao = "Despesa em categoria errada",
            Valor = 50m,
            Tipo = Transacao.ETipo.Despesa,
            CategoriaId = categoriaReceita.Id,
            PessoaId = pessoa.Id,
            Data = DateTime.Today
        };

        await _transacaoService.Invoking(s => s.CreateAsync(dto))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Não é possível registrar despesa em categoria de receita.");
    }

    [Fact]
    public async Task CriarAsync_CategoriaInexistente_LancaArgumentException()
    {
        var pessoa = await _pessoaService.CreateAsync(new CreatePessoaDto
        {
            Nome = "Adulto",
            DataNascimento = DateTime.Today.AddYears(-25)
        });
        var dto = new CreateTransacaoDto
        {
            Descricao = "Test",
            Valor = 100m,
            Tipo = Transacao.ETipo.Despesa,
            CategoriaId = Guid.NewGuid(),
            PessoaId = pessoa.Id,
            Data = DateTime.Today
        };

        await _transacaoService.Invoking(s => s.CreateAsync(dto))
            .Should().ThrowAsync<ArgumentException>()
            .WithParameterName("CategoriaId");
    }

    [Fact]
    public async Task CriarAsync_PessoaInexistente_LancaArgumentException()
    {
        var categoria = await _categoriaService.CreateAsync(new CreateCategoriaDto
        {
            Descricao = "Alimentacao",
            Finalidade = Categoria.EFinalidade.Despesa
        });
        var dto = new CreateTransacaoDto
        {
            Descricao = "Test",
            Valor = 100m,
            Tipo = Transacao.ETipo.Despesa,
            CategoriaId = categoria.Id,
            PessoaId = Guid.NewGuid(),
            Data = DateTime.Today
        };

        await _transacaoService.Invoking(s => s.CreateAsync(dto))
            .Should().ThrowAsync<ArgumentException>()
            .WithParameterName("PessoaId");
    }

    [Fact]
    public async Task CriarAsync_MenorComDespesa_Sucesso()
    {
        var menor = await _pessoaService.CreateAsync(new CreatePessoaDto
        {
            Nome = "Menor",
            DataNascimento = new DateTime(2010, 10, 20)
        });
        var categoria = await _categoriaService.CreateAsync(new CreateCategoriaDto
        {
            Descricao = "Lanche",
            Finalidade = Categoria.EFinalidade.Despesa
        });
        var dto = new CreateTransacaoDto
        {
            Descricao = "Lanche escolar",
            Valor = 15m,
            Tipo = Transacao.ETipo.Despesa,
            CategoriaId = categoria.Id,
            PessoaId = menor.Id,
            Data = DateTime.Today
        };

        var result = await _transacaoService.CreateAsync(dto);

        result.Id.Should().NotBeEmpty();
        result.PessoaNome.Should().Be("Menor");
    }

    [Fact]
    public async Task ObterPorIdAsync_TransacaoExistente_RetornaDto()
    {
        var pessoa = await _pessoaService.CreateAsync(new CreatePessoaDto
        {
            Nome = "Maria",
            DataNascimento = DateTime.Today.AddYears(-30)
        });
        var categoria = await _categoriaService.CreateAsync(new CreateCategoriaDto
        {
            Descricao = "Salario",
            Finalidade = Categoria.EFinalidade.Receita
        });
        var dto = new CreateTransacaoDto
        {
            Descricao = "Salario Maria",
            Valor = 3000m,
            Tipo = Transacao.ETipo.Receita,
            CategoriaId = categoria.Id,
            PessoaId = pessoa.Id,
            Data = DateTime.Today
        };
        var created = await _transacaoService.CreateAsync(dto);

        var result = await _transacaoService.GetByIdAsync(created.Id);

        result.Should().NotBeNull();
        result!.Id.Should().Be(created.Id);
        result.PessoaNome.Should().Be("Maria");
        result.CategoriaDescricao.Should().Be("Salario");
    }

    [Fact]
    public async Task ObterPorIdAsync_Inexistente_RetornaNulo()
    {
        var result = await _transacaoService.GetByIdAsync(Guid.NewGuid());

        result.Should().BeNull();
    }

}
