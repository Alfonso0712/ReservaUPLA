using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReservaUpla.Api.Extensions;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Api.Controllers;

[ApiController]
[Route("api/usuarios")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuariosController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    // RF-01 · RV-01 a RV-03 · E-01 a E-06
    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<UsuarioDto>> RegistrarSolicitante([FromBody] RegistroUsuarioDto dto, CancellationToken ct)
    {
        var creado = await _usuarioService.RegistrarSolicitanteAsync(dto, ct);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creado.Id }, creado);
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<UsuarioDto>> ObtenerPorId(Guid id, CancellationToken ct)
    {
        var usuario = await _usuarioService.ObtenerPorIdAsync(id, ct);
        if (usuario == null)
            return NotFound();

        return Ok(usuario);
    }

    // RF-02 · Permiso usuarios.listarResponsables
    [HttpGet("responsables")]
    [Authorize(Policy = Permisos.UsuariosListarResponsables)]
    public async Task<ActionResult<IReadOnlyList<UsuarioDto>>> ListarResponsables(CancellationToken ct)
    {
        var lista = await _usuarioService.ListarResponsablesAsync(ct);
        return Ok(lista);
    }

    [HttpPatch("preferencias")]
    [Authorize]
    public async Task<ActionResult<UsuarioDto>> ActualizarPreferencias([FromBody] ActualizarPreferenciasDto dto, CancellationToken ct)
    {
        var usuarioId = User.GetUserId();
        if (usuarioId == Guid.Empty)
            return Unauthorized();

        var usuarioActualizado = await _usuarioService.ActualizarPreferenciasAsync(usuarioId, dto, ct);
        return Ok(usuarioActualizado);
    }

    // Módulo de Usuarios (Admin)
    [HttpGet("admin")]
    [Authorize(Policy = Permisos.UsuariosListar)]
    public async Task<ActionResult<IReadOnlyList<UsuarioDto>>> ListarUsuariosAdmin(
        [FromQuery] string? busqueda,
        [FromQuery] RolUsuario? rol,
        [FromQuery] bool? activo,
        CancellationToken ct)
    {
        var lista = await _usuarioService.ListarUsuariosAdminAsync(busqueda, rol, activo, ct);
        return Ok(lista);
    }

    [HttpPost("admin")]
    [Authorize(Policy = Permisos.UsuariosCrear)]
    public async Task<ActionResult<UsuarioDto>> CrearUsuarioPorAdmin(
        [FromBody] CrearUsuarioAdminDto dto,
        CancellationToken ct)
    {
        var creado = await _usuarioService.RegistrarPorAdminAsync(dto, ct);
        return StatusCode(StatusCodes.Status201Created, creado);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = Permisos.UsuariosEditar)]
    public async Task<ActionResult<UsuarioDto>> ActualizarUsuario(
        Guid id,
        [FromBody] ActualizarUsuarioDto dto,
        CancellationToken ct)
    {
        var actualizado = await _usuarioService.ActualizarUsuarioAsync(id, dto, ct);
        return Ok(actualizado);
    }

    [HttpPatch("{id:guid}/estado")]
    [Authorize(Policy = Permisos.UsuariosCambiarEstado)]
    public async Task<ActionResult<UsuarioDto>> CambiarEstado(
        Guid id,
        [FromBody] CambiarEstadoUsuarioDto dto,
        CancellationToken ct)
    {
        var operadorId = User.GetUserId();
        var actualizado = await _usuarioService.CambiarEstadoUsuarioAsync(id, dto.Activo, operadorId, ct);
        return Ok(actualizado);
    }
}
