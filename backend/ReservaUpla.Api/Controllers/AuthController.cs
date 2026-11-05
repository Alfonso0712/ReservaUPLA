using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ReservaUpla.Api.Extensions;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Security;

namespace ReservaUpla.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private const int Status499ClientClosedRequest = 499;

    private readonly IAuthService _authService;
    private readonly IUsuarioService? _usuarioService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
        : this(authService, null, logger)
    {
    }

    [ActivatorUtilitiesConstructor]
    public AuthController(IAuthService authService, IUsuarioService? usuarioService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _usuarioService = usuarioService;
        _logger = logger;
    }

    // Nielsen 5 · Nielsen 9 · RV-08 · RV-10 · RV-11 · E-04 · E-05 · E-07 · E-08 · E-09 · E-13 · E-15
    [HttpPost("login")]
    [EnableRateLimiting(ApiExtensions.LoginRateLimiterPolicy)]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto, CancellationToken ct)
    {
        try
        {
            var usuario = await _authService.LoginAsync(loginDto, ct);
            var rol = Enum.Parse<RolUsuario>(usuario.Rol, true);
            var permisos = PoliticaDeAcceso.ObtenerPermisos(rol);

            var principal = CrearClaimsPrincipal(usuario);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            return Ok(new { usuario, permisos });
        }
        catch (UnauthorizedAccessException)
        {
            // RV-10 · E-04 · E-13: Mismo 401 y mismo mensaje ante correo inexistente, clave erronea o usuario inactivo
            return Problem(
                statusCode: StatusCodes.Status401Unauthorized,
                title: MensajesValidacion.CredencialesNoValidasTitulo,
                detail: MensajesValidacion.CredencialesNoValidasDetalle);
        }
        catch (OperationCanceledException)
        {
            // E-14: Cancelacion de solicitud
            return StatusCode(Status499ClientClosedRequest);
        }
        catch (Exception ex)
        {
            // E-15: 500 con detalle tecnico solo en log y mensaje generico al usuario
            _logger.LogError(ex, "Error no controlado durante la autenticacion para {Correo}: {Message}", loginDto.Correo, ex.Message);
            return Problem(
                statusCode: StatusCodes.Status500InternalServerError,
                title: MensajesValidacion.ErrorInternoTitulo,
                detail: MensajesValidacion.ErrorInternoDetalle);
        }
    }

    private static ClaimsPrincipal CrearClaimsPrincipal(UsuarioDto usuario)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Name, usuario.NombreCompleto),
            new Claim(ClaimTypes.Email, usuario.Correo),
            new Claim(ClaimTypes.Role, usuario.Rol)
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        return new ClaimsPrincipal(identity);
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
    public async Task<IActionResult> ObtenerUsuarioActual(CancellationToken ct)
    {
        var id = User.GetUserId();
        if (id == Guid.Empty)
            return Unauthorized();

        UsuarioDto? usuario = null;
        if (_usuarioService != null)
        {
            usuario = await _usuarioService.ObtenerPorIdAsync(id, ct);
        }

        if (usuario == null)
        {
            var nombre = User.FindFirstValue(ClaimTypes.Name) ?? string.Empty;
            var correo = User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
            var rolClaim = User.GetUserRole();
            usuario = new UsuarioDto(id, nombre, correo, rolClaim.ToString(), true);
        }

        var rol = Enum.Parse<RolUsuario>(usuario.Rol, true);
        var permisos = PoliticaDeAcceso.ObtenerPermisos(rol);

        return Ok(new { usuario, permisos });
    }
}
