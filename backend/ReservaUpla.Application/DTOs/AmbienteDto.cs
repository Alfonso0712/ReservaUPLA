using System;

namespace ReservaUpla.Application.DTOs;

public record AmbienteDto(
    Guid Id,
    string Nombre,
    string Tipo,
    int Capacidad,
    string Ubicacion,
    string Estado,
    Guid? ResponsableId,
    string? NombreResponsable);
