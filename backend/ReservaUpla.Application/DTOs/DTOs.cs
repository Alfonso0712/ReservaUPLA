using System;
using System.Collections.Generic;

namespace ReservaUpla.Application.DTOs;

// RF-01 · RV-01 · RV-02 · RV-03
public record RegistroUsuarioDto(
    string NombreCompleto,
    string Correo,
    string Contrasena);

// Login
public record LoginDto(
    string Correo,
    string Contrasena);

public record UsuarioDto(
    Guid Id,
    string NombreCompleto,
    string Correo,
    string Rol,
    bool Activo);

// RF-02 · RV-04 · RV-05 · RV-06 · RV-07
public record CrearAmbienteDto(
    string Nombre,
    string Tipo,
    int Capacidad,
    string Ubicacion,
    Guid? ResponsableId);

public record AmbienteDto(
    Guid Id,
    string Nombre,
    string Tipo,
    int Capacidad,
    string Ubicacion,
    string Estado,
    Guid? ResponsableId,
    string? NombreResponsable);

// RF-04 · RN-01 · RV-14
public record BloqueDisponibilidadDto(
    TimeSpan HoraInicio,
    TimeSpan HoraFin,
    string Estado,
    string? Motivo);

public record DisponibilidadAmbienteDto(
    Guid AmbienteId,
    string NombreAmbiente,
    DateOnly Fecha,
    IReadOnlyList<BloqueDisponibilidadDto> Reservas);

// RF-03 · RN-02 · RN-03 · RN-04 · RV-08 · RV-09 · RV-10 · RV-11 · RV-12
public record CrearReservaDto(
    Guid AmbienteId,
    DateOnly Fecha,
    TimeSpan HoraInicio,
    TimeSpan HoraFin,
    string Motivo);

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
    DateTime FechaRegistro);

// RF-07 · RV-15 · RV-16 · RV-17
public record CambiarEstadoDto(
    string Estado);

// RF-05
public record FiltroReservasDto(
    string? Estado = null,
    Guid? AmbienteId = null,
    DateOnly? Fecha = null,
    int Pagina = 1,
    int TamanoPagina = 10);

public record PaginadoDto<T>(
    IReadOnlyList<T> Items,
    int TotalItems,
    int Pagina,
    int TamanoPagina);

// RF-08 · E-30
public record DashboardEstadisticasDto(
    int TotalReservas,
    int ReservasPendientes,
    int ReservasAprobadas,
    int ReservasRechazadas,
    int ReservasCanceladas,
    string AmbienteMasUtilizado,
    int CantidadUsoAmbienteMasUtilizado);
