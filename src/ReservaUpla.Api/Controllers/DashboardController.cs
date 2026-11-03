using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IReservaService _reservaService;

    public DashboardController(IReservaService reservaService)
    {
        _reservaService = reservaService;
    }

    // RF-08 · E-30
    [HttpGet]
    public async Task<ActionResult<DashboardEstadisticasDto>> ObtenerDashboard(CancellationToken ct)
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var rolStr = User.FindFirstValue(ClaimTypes.Role);

        var usuarioId = Guid.TryParse(idStr, out var id) ? id : Guid.Empty;
        var rol = Enum.TryParse<RolUsuario>(rolStr, true, out var r) ? r : RolUsuario.Solicitante;

        var stats = await _reservaService.ObtenerDashboardAsync(usuarioId, rol, ct);
        return Ok(stats);
    }
}
