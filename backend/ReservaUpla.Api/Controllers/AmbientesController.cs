using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Api.Controllers;

[ApiController]
[Route("api/ambientes")]
[Authorize]
public class AmbientesController : ControllerBase
{
    private readonly IAmbienteService _ambienteService;

    public AmbientesController(IAmbienteService ambienteService)
    {
        _ambienteService = ambienteService;
    }

    // RF-02 · RV-04 a RV-07 · E-10 · E-11
    [HttpPost]
    [Authorize(Policy = Permisos.AmbientesCrear)]
    public async Task<ActionResult<AmbienteDto>> CrearAmbiente([FromBody] CrearAmbienteDto dto, CancellationToken ct)
    {
        var creado = await _ambienteService.RegistrarAmbienteAsync(dto, ct);
        return StatusCode(StatusCodes.Status201Created, creado);
    }

    // RF-02 · RV-04 a RV-07 · E-39 · E-40
    [HttpPut("{id:guid}")]
    [Authorize(Policy = Permisos.AmbientesEditar)]
    public async Task<ActionResult<AmbienteDto>> ActualizarAmbiente(Guid id, [FromBody] ActualizarAmbienteDto dto, CancellationToken ct)
    {
        var actualizado = await _ambienteService.ActualizarAmbienteAsync(id, dto, ct);
        return Ok(actualizado);
    }

    // RF-02 · E-41 a E-44
    [HttpPatch("{id:guid}/estado")]
    [Authorize(Policy = Permisos.AmbientesCambiarEstado)]
    public async Task<ActionResult<AmbienteDto>> CambiarEstado(Guid id, [FromBody] CambiarEstadoDto dto, CancellationToken ct)
    {
        if (!Enum.TryParse<EstadoAmbiente>(dto.Estado, true, out var nuevoEstado))
            throw new DomainException(Mensajes.AmbienteEstadoInvalido);

        var actualizado = await _ambienteService.CambiarEstadoAsync(id, nuevoEstado, ct);
        return Ok(actualizado);
    }

    // RF-02 · E-32
    [HttpGet]
    [Authorize(Policy = Permisos.AmbientesVer)]
    public async Task<ActionResult<IReadOnlyList<AmbienteDto>>> ListarAmbientes(CancellationToken ct)
    {
        var lista = await _ambienteService.ListarAmbientesAsync(ct);
        return Ok(lista);
    }

    // RF-04 · RN-01 · RV-14 · E-17
    [HttpGet("{id:guid}/disponibilidad")]
    [Authorize(Policy = Permisos.AmbientesVer)]
    public async Task<ActionResult<DisponibilidadAmbienteDto>> ConsultarDisponibilidad(
        Guid id,
        [FromQuery] DateOnly fecha,
        CancellationToken ct)
    {
        var disponibilidad = await _ambienteService.ConsultarDisponibilidadAsync(id, fecha, ct);
        return Ok(disponibilidad);
    }
}
