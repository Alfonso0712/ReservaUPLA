using System.Collections.Generic;

namespace ReservaUpla.Domain.Constants;

public static class Permisos
{
    public const string DashboardVer = "dashboard.ver";
    public const string ReservasVer = "reservas.ver";
    public const string ReservasCrear = "reservas.crear";
    public const string ReservasAprobar = "reservas.aprobar";
    public const string ReservasRechazar = "reservas.rechazar";
    public const string ReservasCancelarPropias = "reservas.cancelarPropias";
    public const string ReservasCancelarCualquiera = "reservas.cancelarCualquiera";
    public const string AmbientesVer = "ambientes.ver";
    public const string AmbientesCrear = "ambientes.crear";
    public const string AmbientesEditar = "ambientes.editar";
    public const string AmbientesCambiarEstado = "ambientes.cambiarEstado";
    public const string UsuariosListarResponsables = "usuarios.listarResponsables";

    public static readonly IReadOnlyList<string> Todos = new[]
    {
        DashboardVer,
        ReservasVer,
        ReservasCrear,
        ReservasAprobar,
        ReservasRechazar,
        ReservasCancelarPropias,
        ReservasCancelarCualquiera,
        AmbientesVer,
        AmbientesCrear,
        AmbientesEditar,
        AmbientesCambiarEstado,
        UsuariosListarResponsables
    };
}
