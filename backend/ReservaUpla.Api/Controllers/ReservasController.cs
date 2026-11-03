using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservaUpla.Api.Extensions;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Api.Controllers;

[ApiController]
[Route("api/reservas")]
[Authorize]
public class ReservasController : ControllerBase
{
    private readonly IReservaService _reservaService;

    public ReservasController(IReservaService reservaService)
    {
        _reservaService = reservaService;
    }

    // RF-03 · RN-02 a RN-04 · RV-08 a RV-14 · E-12 a E-17
    [HttpPost]
    [Authorize(Roles = "Solicitante")]
    public async Task<ActionResult<ReservaDto>> CrearReserva([FromBody] CrearReservaDto dto, CancellationToken ct)
    {
        var creada = await _reservaService.CrearReservaAsync(dto, User.GetUserId(), ct);
        return CreatedAtAction(nameof(ObtenerDetalle), new { id = creada.Id }, creada);
    }

    // RF-05 · E-32
    [HttpGet]
    public async Task<ActionResult<PaginadoDto<ReservaDto>>> ListarReservas(
        [FromQuery] string? estado,
        [FromQuery] Guid? ambienteId,
        [FromQuery] DateOnly? fecha,
        [FromQuery] int pagina = 1,
        [FromQuery] int tamanoPagina = 10,
        CancellationToken ct = default)
    {
        var filtro = new FiltroReservasDto(estado, ambienteId, fecha, pagina, tamanoPagina);
        var resultado = await _reservaService.ListarReservasAsync(filtro, User.GetUserId(), User.GetUserRole(), ct);
        return Ok(resultado);
    }

    // RF-06
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ReservaDetalleDto>> ObtenerDetalle(Guid id, CancellationToken ct)
    {
        var detalle = await _reservaService.ObtenerDetalleAsync(id, User.GetUserId(), User.GetUserRole(), ct);
        return Ok(detalle);
    }

    // RF-07 · RN-05 · RN-06 · RV-15 a RV-17 · E-18 a E-21 · E-31
    [HttpPatch("{id:guid}/estado")]
    public async Task<ActionResult<ReservaDto>> CambiarEstado(
        Guid id,
        [FromBody] CambiarEstadoDto dto,
        CancellationToken ct)
    {
        if (!Enum.TryParse<EstadoReserva>(dto.Estado, true, out var nuevoEstado))
            throw new DomainException(Mensajes.TransicionEstadoInvalida);

        var actualizada = await _reservaService.CambiarEstadoAsync(id, nuevoEstado, User.GetUserId(), User.GetUserRole(), ct);
        return Ok(actualizada);
    }
}
