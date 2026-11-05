using System;

namespace ReservaUpla.Application.DTOs;

public record UsuarioResumenDto(Guid Id, string NombreCompleto, string Correo);
public record AmbienteResumenDto(Guid Id, string Nombre, string Tipo);

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
    DateTime FechaRegistro,
    UsuarioResumenDto? Solicitante = null,
    AmbienteResumenDto? Ambiente = null);
