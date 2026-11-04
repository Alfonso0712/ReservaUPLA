using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Constants;

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
}
