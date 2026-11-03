using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservaUpla.Api.Extensions;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;

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
        var stats = await _reservaService.ObtenerDashboardAsync(User.GetUserId(), User.GetUserRole(), ct);
        return Ok(stats);
    }
}
