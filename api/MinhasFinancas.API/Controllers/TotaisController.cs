using Microsoft.AspNetCore.Mvc;
using MinhasFinancas.Domain.ValueObjects;
using MinhasFinancas.Application.Services;
using Asp.Versioning;

namespace MinhasFinancas.API.Controllers;

/// <summary>
/// Controlador para consultas de totais.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class TotaisController : ControllerBase
{
    private readonly ITotalService _totalService;

    /// <summary>
    /// Construtor.
    /// </summary>
    public TotaisController(ITotalService totalService)
    {
        _totalService = totalService;
    }

    /// <summary>
    /// Obtém totais por pessoa.
    /// </summary>
    /// <returns>Lista de totais por pessoa.</returns>
    [HttpGet("pessoas")]
    [ProducesResponseType(typeof(MinhasFinancas.Domain.ValueObjects.PagedResult<TotalPorPessoa>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTotaisPorPessoa([FromQuery] TotaisPorPessoaFilter? filter = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _totalService.GetTotaisPorPessoaAsync(filter, new MinhasFinancas.Domain.ValueObjects.PagedRequest { Page = page, PageSize = pageSize });
        return Ok(result);
    }

    /// <summary>
    /// Obtém totais por categoria.
    /// </summary>
    /// <returns>Lista de totais por categoria.</returns>
    [HttpGet("categorias")]
    [ProducesResponseType(typeof(MinhasFinancas.Domain.ValueObjects.PagedResult<TotalPorCategoria>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTotaisPorCategoria([FromQuery] TotaisPorCategoriaFilter? filter = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _totalService.GetTotaisPorCategoriaAsync(filter, new MinhasFinancas.Domain.ValueObjects.PagedRequest { Page = page, PageSize = pageSize });
        return Ok(result);
    }
}