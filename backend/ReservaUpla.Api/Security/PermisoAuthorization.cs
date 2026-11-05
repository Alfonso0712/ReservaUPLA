using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Security;

namespace ReservaUpla.Api.Security;

public class PermisoRequirement : IAuthorizationRequirement
{
    public string Permiso { get; }

    public PermisoRequirement(string permiso)
    {
        Permiso = permiso;
    }
}

public class PermisoAuthorizationHandler : AuthorizationHandler<PermisoRequirement>
{
    private readonly ILogger<PermisoAuthorizationHandler> _logger;

    public PermisoAuthorizationHandler(ILogger<PermisoAuthorizationHandler> logger)
    {
        _logger = logger;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermisoRequirement requirement)
    {
        if (context.User?.Identity?.IsAuthenticated != true)
        {
            return Task.CompletedTask;
        }

        var rolStr = context.User.FindFirstValue(ClaimTypes.Role);
        if (!Enum.TryParse<RolUsuario>(rolStr, true, out var rol))
        {
            _logger.LogWarning("Rol de usuario inválido en reclamos de autorización: {RolStr}", rolStr);
            return Task.CompletedTask;
        }

        if (PoliticaDeAcceso.Tiene(rol, requirement.Permiso))
        {
            context.Succeed(requirement);
        }
        else
        {
            _logger.LogWarning("Acceso denegado: el rol {Rol} no cuenta con el permiso requerido {Permiso}", rol, requirement.Permiso);
        }

        return Task.CompletedTask;
    }
}
