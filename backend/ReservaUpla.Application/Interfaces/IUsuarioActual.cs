using System;
using ReservaUpla.Domain.Common;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Application.Interfaces;

public interface IUsuarioActual : IActor
{
    string NombreCompleto { get; }
    string Correo { get; }
    bool EstaAutenticado { get; }
}
