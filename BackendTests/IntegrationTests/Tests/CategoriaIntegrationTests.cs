using MinhasFinancas.Application.DTOs;
using MinhasFinancas.Application.Services;
using MinhasFinancas.Domain.Entities;
using FluentAssertions;

namespace MinhasFinancas.IntegrationTests.Tests;

public class CategoriaIntegrationTests : IntegrationTestBase
{
    private readonly CategoriaService _service;

    public CategoriaIntegrationTests()
    {
        var (unitOfWork, _) = CreateUnitOfWork();
        _service = new CategoriaService(unitOfWork);
    }

    [Fact]
    public async Task CriarAsync_CategoriaValida_RetornaDto()
    {
        var dto = new CreateCategoriaDto
        {
            Descricao = "Alimentacao",
            Finalidade = Categoria.EFinalidade.Despesa
        };

        var result = await _service.CreateAsync(dto);

        result.Id.Should().NotBeEmpty();
        result.Descricao.Should().Be("Alimentacao");
        result.Finalidade.Should().Be(Categoria.EFinalidade.Despesa);
    }

    [Fact]
    public async Task ListarAsync_RetornaTodasCategorias()
    {
        await _service.CreateAsync(new CreateCategoriaDto { Descricao = "Cat 1", Finalidade = Categoria.EFinalidade.Despesa });
        await _service.CreateAsync(new CreateCategoriaDto { Descricao = "Cat 2", Finalidade = Categoria.EFinalidade.Receita });
        await _service.CreateAsync(new CreateCategoriaDto { Descricao = "Cat 3", Finalidade = Categoria.EFinalidade.Ambas });

        var result = await _service.GetAllAsync();

        result.Items.Should().HaveCount(3);
    }

    [Fact]
    public async Task PermiteTipo_PeloDbContext_ConsistenteComDominio()
    {
        var dto = new CreateCategoriaDto
        {
            Descricao = "Salario",
            Finalidade = Categoria.EFinalidade.Receita
        };
        var result = await _service.CreateAsync(dto);

        result.Finalidade.Should().Be(Categoria.EFinalidade.Receita);
    }

}
