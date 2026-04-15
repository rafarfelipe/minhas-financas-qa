using MinhasFinancas.Application.DTOs;
using MinhasFinancas.Application.Services;
using MinhasFinancas.Domain.ValueObjects;
using FluentAssertions;

namespace MinhasFinancas.IntegrationTests.Tests;

public class PessoaIntegrationTests : IntegrationTestBase
{
    private readonly PessoaService _service;

    public PessoaIntegrationTests()
    {
        var (unitOfWork, _) = CreateUnitOfWork();
        _service = new PessoaService(unitOfWork);
    }

    [Fact]
    public async Task CriarAsync_PessoaValida_RetornaDtoComId()
    {
        var dto = new CreatePessoaDto
        {
            Nome = "Joao Teste",
            DataNascimento = new DateTime(1990, 5, 15)
        };

        var result = await _service.CreateAsync(dto);

        result.Id.Should().NotBeEmpty();
        result.Nome.Should().Be("Joao Teste");
        result.DataNascimento.Should().Be(dto.DataNascimento);
        result.Idade.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task CriarAsync_DataNascimentoFutura_ServiceAceita()
    {
        var dto = new CreatePessoaDto
        {
            Nome = "Futuro",
            DataNascimento = DateTime.Today.AddDays(30)
        };

        var act = () => _service.CreateAsync(dto);

        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task ObterPorIdAsync_Inexistente_RetornaNulo()
    {
        var result = await _service.GetByIdAsync(Guid.NewGuid());

        result.Should().BeNull();
    }

    [Fact]
    public async Task AtualizarAsync_PessoaExistente_AtualizaCampos()
    {
        var createDto = new CreatePessoaDto
        {
            Nome = "Original",
            DataNascimento = new DateTime(1985, 1, 1)
        };
        var created = await _service.CreateAsync(createDto);

        var updateDto = new UpdatePessoaDto
        {
            Nome = "Atualizado",
            DataNascimento = new DateTime(1986, 6, 15)
        };

        await _service.UpdateAsync(created.Id, updateDto);
        var updated = await _service.GetByIdAsync(created.Id);

        updated.Should().NotBeNull();
        updated!.Nome.Should().Be("Atualizado");
        updated.DataNascimento.Should().Be(new DateTime(1986, 6, 15));
    }

    [Fact]
    public async Task AtualizarAsync_Inexistente_LancaKeyNotFoundException()
    {
        var dto = new UpdatePessoaDto { Nome = "Test", DataNascimento = DateTime.Today.AddYears(-20) };

        await _service.Invoking(s => s.UpdateAsync(Guid.NewGuid(), dto))
            .Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task ExcluirAsync_PessoaExistente_Removida()
    {
        var dto = new CreatePessoaDto { Nome = "Para Remover", DataNascimento = DateTime.Today.AddYears(-25) };
        var created = await _service.CreateAsync(dto);

        await _service.DeleteAsync(created.Id);
        var result = await _service.GetByIdAsync(created.Id);

        result.Should().BeNull();
    }

    [Fact]
    public async Task ListarAsync_ComBusca_FiltraPorNome()
    {
        await _service.CreateAsync(new CreatePessoaDto { Nome = "Joao Silva", DataNascimento = new DateTime(1990, 1, 1) });
        await _service.CreateAsync(new CreatePessoaDto { Nome = "Maria Santos", DataNascimento = new DateTime(1985, 5, 15) });

        var result = await _service.GetAllAsync(new PagedRequest { Search = "Joao" });

        result.Items.Should().HaveCount(1);
        result.Items.First().Nome.Should().Be("Joao Silva");
    }

}
