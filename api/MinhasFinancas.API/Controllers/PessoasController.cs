using Microsoft.AspNetCore.Mvc;
using MinhasFinancas.Application.DTOs;
using MinhasFinancas.Application.Services;
using Asp.Versioning;

namespace MinhasFinancas.API.Controllers;

/// <summary>
/// Controlador para operações com Pessoas.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly IPessoaService _pessoaService;

    /// <summary>
    /// Construtor.
    /// </summary>
    public PessoasController(IPessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    /// <summary>
    /// Obtém todas as pessoas.
    /// </summary>
    /// <returns>Lista de pessoas.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(MinhasFinancas.Domain.ValueObjects.PagedResult<PessoaDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null)
    {
        var result = await _pessoaService.GetAllAsync(new MinhasFinancas.Domain.ValueObjects.PagedRequest { Page = page, PageSize = pageSize, Search = search });
        return Ok(result);
    }

    /// <summary>
    /// Obtém uma pessoa pelo ID.
    /// </summary>
    /// <param name="id">ID da pessoa.</param>
    /// <returns>Pessoa encontrada.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PessoaDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var pessoa = await _pessoaService.GetByIdAsync(id);
        if (pessoa == null)
            return NotFound();

        return Ok(pessoa);
    }

    /// <summary>
    /// Cria uma nova pessoa.
    /// </summary>
    /// <param name="dto">Dados da pessoa a ser criada.</param>
    /// <returns>Pessoa criada.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(PessoaDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreatePessoaDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var pessoa = await _pessoaService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = pessoa.Id }, pessoa);
    }

    /// <summary>
    /// Atualiza uma pessoa existente.
    /// </summary>
    /// <param name="id">ID da pessoa.</param>
    /// <param name="dto">Dados atualizados da pessoa.</param>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePessoaDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            await _pessoaService.UpdateAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Remove uma pessoa pelo ID.
    /// </summary>
    /// <param name="id">ID da pessoa.</param>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _pessoaService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}