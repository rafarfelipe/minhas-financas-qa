using Microsoft.AspNetCore.Mvc;
using MinhasFinancas.Application.DTOs;
using MinhasFinancas.Application.Services;
using Asp.Versioning;

namespace MinhasFinancas.API.Controllers;

/// <summary>
/// Controlador para operações com Categorias.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly ICategoriaService _categoriaService;

    /// <summary>
    /// Construtor.
    /// </summary>
    public CategoriasController(ICategoriaService categoriaService)
    {
        _categoriaService = categoriaService;
    }

    /// <summary>
    /// Obtém todas as categorias.
    /// </summary>
    /// <returns>Lista de categorias.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(MinhasFinancas.Domain.ValueObjects.PagedResult<CategoriaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null)
    {
        var result = await _categoriaService.GetAllAsync(new MinhasFinancas.Domain.ValueObjects.PagedRequest { Page = page, PageSize = pageSize, Search = search });
        return Ok(result);
    }

    /// <summary>
    /// Obtém uma categoria pelo ID.
    /// </summary>
    /// <param name="id">ID da categoria.</param>
    /// <returns>Categoria encontrada.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CategoriaDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var categoria = await _categoriaService.GetByIdAsync(id);
        if (categoria == null)
            return NotFound();

        return Ok(categoria);
    }

    /// <summary>
    /// Cria uma nova categoria.
    /// </summary>
    /// <param name="dto">Dados da categoria a ser criada.</param>
    /// <returns>Categoria criada.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(CategoriaDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateCategoriaDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var categoria = await _categoriaService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = categoria.Id }, categoria);
    }
}