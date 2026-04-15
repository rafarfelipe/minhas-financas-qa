using System.ComponentModel.DataAnnotations;
using MinhasFinancas.Application.DTOs;
using FluentAssertions;

namespace MinhasFinancas.UnitTests.Tests.Application;

public class PessoaValidationTests
{
    [Fact]
    public void ValidarDataNascimento_DataFutura_RetornaErroValidacao()
    {
        var dto = new CreatePessoaDto
        {
            Nome = "Test",
            DataNascimento = DateTime.Today.AddDays(1)
        };

        var context = new ValidationContext(dto);
        var result = Validator.TryValidateObject(dto, context, new List<ValidationResult>(), true);

        result.Should().BeFalse();
    }

    [Fact]
    public void ValidarDataNascimento_Hoje_RetornaSucesso()
    {
        var dto = new CreatePessoaDto
        {
            Nome = "Test",
            DataNascimento = DateTime.Today
        };

        var context = new ValidationContext(dto);
        var result = Validator.TryValidateObject(dto, context, new List<ValidationResult>(), true);

        result.Should().BeTrue();
    }

    [Fact]
    public void ValidarDataNascimento_DataPassada_RetornaSucesso()
    {
        var dto = new CreatePessoaDto
        {
            Nome = "Test",
            DataNascimento = DateTime.Today.AddDays(-365)
        };

        var context = new ValidationContext(dto);
        var result = Validator.TryValidateObject(dto, context, new List<ValidationResult>(), true);

        result.Should().BeTrue();
    }

    [Fact]
    public void ValidarDataNascimento_PassadoDistante_RetornaSucesso()
    {
        var dto = new CreatePessoaDto
        {
            Nome = "Test",
            DataNascimento = new DateTime(1900, 1, 1)
        };

        var context = new ValidationContext(dto);
        var result = Validator.TryValidateObject(dto, context, new List<ValidationResult>(), true);

        result.Should().BeTrue();
    }

    [Fact]
    public void ValidarDataNascimento_FuturoDistante_RetornaErroValidacao()
    {
        var dto = new CreatePessoaDto
        {
            Nome = "Test",
            DataNascimento = new DateTime(2100, 1, 1)
        };

        var context = new ValidationContext(dto);
        var result = Validator.TryValidateObject(dto, context, new List<ValidationResult>(), true);

        result.Should().BeFalse();
    }
}
