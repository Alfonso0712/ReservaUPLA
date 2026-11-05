using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Security;

namespace ReservaUpla.Api.Security;

public class UsuarioActual : IUsuarioActual
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UsuarioActual(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public Guid Id
    {
        get
        {
            var idStr = User?.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(idStr, out var id) ? id : Guid.Empty;
        }
    }

    public RolUsuario Rol
    {
        get
        {
            var rolStr = User?.FindFirstValue(ClaimTypes.Role);
            return Enum.TryParse<RolUsuario>(rolStr, true, out var rol) ? rol : RolUsuario.Solicitante;
        }
    }

    public string NombreCompleto => User?.FindFirstValue(ClaimTypes.Name) ?? string.Empty;

    public string Correo => User?.FindFirstValue(ClaimTypes.Email) ?? string.Empty;

    public bool EstaAutenticado => User?.Identity?.IsAuthenticated ?? false;

    public bool Tiene(string permiso) => PoliticaDeAcceso.Tiene(Rol, permiso);
}
