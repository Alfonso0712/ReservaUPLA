using System;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Security;

namespace ReservaUpla.Domain.Common;

public interface IActor
{
    Guid Id { get; }
    RolUsuario Rol { get; }
    bool Tiene(string permiso);
}

public record ActorReserva(Guid Id, RolUsuario Rol) : IActor
{
    public bool Tiene(string permiso) => PoliticaDeAcceso.Tiene(Rol, permiso);
}
