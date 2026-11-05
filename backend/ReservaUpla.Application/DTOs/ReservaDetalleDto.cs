using System;

namespace ReservaUpla.Application.DTOs;

public record AmbienteDetalleResumenDto(
    Guid Id,
    string Nombre,
    string Tipo,
    string Ubicacion,
    int Capacidad);

public record ReservaDetalleDto(
    Guid Id,
    DateOnly Fecha,
    TimeSpan HoraInicio,
    TimeSpan HoraFin,
    string Motivo,
    string Estado,
    Guid SolicitanteId,
    string NombreSolicitante,
    string CorreoSolicitante,
    Guid AmbienteId,
    string NombreAmbiente,
    string UbicacionAmbiente,
    string TipoAmbiente,
    DateTime FechaRegistro,
    UsuarioResumenDto? Solicitante = null,
    AmbienteDetalleResumenDto? Ambiente = null,
    int CapacidadAmbiente = 0);
