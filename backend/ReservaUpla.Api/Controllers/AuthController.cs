using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using ReservaUpla.Api.Extensions;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;

namespace ReservaUpla.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // E-07 · E-08 · E-09
    [HttpPost("login")]
    [EnableRateLimiting(ApiExtensions.LoginRateLimiterPolicy)]
    public async Task<ActionResult<UsuarioDto>> Login([FromBody] LoginDto loginDto, CancellationToken ct)
    {
        var usuario = await _authService.LoginAsync(loginDto, ct);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Name, usuario.NombreCompleto),
            new Claim(ClaimTypes.Email, usuario.Correo),
            new Claim(ClaimTypes.Role, usuario.Rol)
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

        return Ok(usuario);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(new { mensaje = "Sesion cerrada correctamente" });
    }

    [HttpGet("yo")]
    [Authorize]
    public ActionResult<UsuarioDto> ObtenerUsuarioActual()
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(idStr, out var id))
            return Unauthorized();

        var nombre = User.FindFirstValue(ClaimTypes.Name) ?? string.Empty;
        var correo = User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
        var rol = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        return Ok(new UsuarioDto(id, nombre, correo, rol, true));
    }
}
