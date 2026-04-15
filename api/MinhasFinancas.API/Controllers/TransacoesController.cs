using Microsoft.AspNetCore.Mvc;
using MinhasFinancas.Application.DTOs;
using MinhasFinancas.Application.Services;
using Asp.Versioning;

namespace MinhasFinancas.API.Controllers;

/// <summary>
/// Controlador para operações com Transações.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly ITransacaoService _transacaoService;

    /// <summary>
    /// Construtor.
    /// </summary>
    public TransacoesController(ITransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    /// <summary>
    /// Obtém todas as transações.
    /// </summary>
    /// <returns>Lista de transações.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(MinhasFinancas.Domain.ValueObjects.PagedResult<TransacaoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _transacaoService.GetAllAsync(new MinhasFinancas.Domain.ValueObjects.PagedRequest { Page = page, PageSize = pageSize });
        return Ok(result);
    }

    /// <summary>
    /// Obtém uma transação pelo ID.
    /// </summary>
    /// <param name="id">ID da transação.</param>
    /// <returns>Transação encontrada.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TransacaoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var transacao = await _transacaoService.GetByIdAsync(id);
        if (transacao == null)
            return NotFound();

        return Ok(transacao);
    }

    /// <summary>
    /// Cria uma nova transação.
    /// </summary>
    /// <param name="dto">Dados da transação a ser criada.</param>
    /// <returns>Transação criada.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(TransacaoDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateTransacaoDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var transacao = await _transacaoService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = transacao.Id }, transacao);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}