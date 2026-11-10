using System;
using System.Collections.Generic;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Domain.Security;

public static class PoliticaDeAcceso
{
    private static readonly Dictionary<RolUsuario, HashSet<string>> MapaPermisos = new()
    {
        [RolUsuario.Administrador] = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            Permisos.DashboardVer,
            Permisos.ReservasVer,
            Permisos.ReservasAprobar,
            Permisos.ReservasRechazar,
            Permisos.ReservasCancelarCualquiera,
            Permisos.AmbientesVer,
            Permisos.AmbientesCrear,
            Permisos.AmbientesEditar,
            Permisos.AmbientesCambiarEstado,
            Permisos.UsuariosListarResponsables,
            Permisos.UsuariosListar,
            Permisos.UsuariosCrear,
            Permisos.UsuariosEditar,
            Permisos.UsuariosCambiarEstado
        },
        [RolUsuario.Responsable] = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            Permisos.DashboardVer,
            Permisos.ReservasVer,
            Permisos.AmbientesVer
        },
        [RolUsuario.Solicitante] = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            Permisos.DashboardVer,
            Permisos.ReservasVer,
            Permisos.ReservasCrear,
            Permisos.ReservasCancelarPropias,
            Permisos.AmbientesVer
        }
    };

    public static bool Tiene(RolUsuario rol, string permiso)
    {
        if (string.IsNullOrWhiteSpace(permiso)) return false;
        return MapaPermisos.TryGetValue(rol, out var permisos) && permisos.Contains(permiso);
    }

    public static IReadOnlyCollection<string> ObtenerPermisos(RolUsuario rol)
    {
        return MapaPermisos.TryGetValue(rol, out var permisos)
            ? permisos
            : Array.Empty<string>();
    }
}
