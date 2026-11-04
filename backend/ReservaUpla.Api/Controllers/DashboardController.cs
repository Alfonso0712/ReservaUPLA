using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Constants;

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
    [Authorize(Policy = Permisos.DashboardVer)]
    public async Task<ActionResult<DashboardEstadisticasDto>> ObtenerDashboard(CancellationToken ct)
    {
        var stats = await _reservaService.ObtenerDashboardAsync(ct);
        return Ok(stats);
    }
}
