using System;

namespace ReservaUpla.Application.DTOs;

// RF-05 · RF-06
public record ReservaDto(
    Guid Id,
    DateOnly Fecha,
    TimeSpan HoraInicio,
    TimeSpan HoraFin,
    string Motivo,
    string Estado,
    Guid SolicitanteId,
    string NombreSolicitante,
    Guid AmbienteId,
    string NombreAmbiente,
    DateTime FechaRegistro);
