using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservaUpla.Api.Extensions;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Enums;

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
    [Authorize(Roles = "Administrador")]
    public async Task<ActionResult<AmbienteDto>> CrearAmbiente([FromBody] CrearAmbienteDto dto, CancellationToken ct)
    {
        var creado = await _ambienteService.RegistrarAmbienteAsync(dto, ct);
        return CreatedAtAction(nameof(ListarAmbientes), new { id = creado.Id }, creado);
    }

    // RF-02 · E-32
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AmbienteDto>>> ListarAmbientes(CancellationToken ct)
    {
        var rol = User.GetUserRole();
        Guid? responsableId = rol == RolUsuario.Responsable ? User.GetUserId() : null;

        var lista = await _ambienteService.ListarAmbientesAsync(responsableId, ct);
        return Ok(lista);
    }

    // RF-04 · RN-01 · RV-14 · E-17
    [HttpGet("{id:guid}/disponibilidad")]
    public async Task<ActionResult<DisponibilidadAmbienteDto>> ConsultarDisponibilidad(
        Guid id,
        [FromQuery] DateOnly fecha,
        CancellationToken ct)
    {
        var disponibilidad = await _ambienteService.ConsultarDisponibilidadAsync(id, fecha, ct);
        return Ok(disponibilidad);
    }
}
