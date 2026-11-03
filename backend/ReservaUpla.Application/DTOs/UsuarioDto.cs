using System;

namespace ReservaUpla.Application.DTOs;

public record UsuarioDto(
    Guid Id,
    string NombreCompleto,
    string Correo,
    string Rol,
    bool Activo);
