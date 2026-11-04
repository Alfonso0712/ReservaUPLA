using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Application.Interfaces;

public interface IAuthService
{
    // E-07 · E-08
    Task<UsuarioDto> LoginAsync(LoginDto loginDto, CancellationToken ct = default);
}

public interface IUsuarioService
{
    // RF-01 · RV-01 · RV-02 · RV-03 · E-01 a E-06
    Task<UsuarioDto> RegistrarSolicitanteAsync(RegistroUsuarioDto dto, CancellationToken ct = default);
    Task<UsuarioDto?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<UsuarioDto>> ListarResponsablesAsync(CancellationToken ct = default);
}

public interface IAmbienteService
{
    // RF-02 · RV-04 a RV-07 · E-10 · E-11
    Task<AmbienteDto> RegistrarAmbienteAsync(CrearAmbienteDto dto, CancellationToken ct = default);
    Task<IReadOnlyList<AmbienteDto>> ListarAmbientesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<AmbienteDto>> ListarAmbientesAsync(Guid? responsableId, CancellationToken ct = default);
    // RF-04 · RN-01 · RV-14
    Task<DisponibilidadAmbienteDto> ConsultarDisponibilidadAsync(Guid ambienteId, DateOnly fecha, CancellationToken ct = default);
}

public interface IReservaService
{
    // RF-03 · RF-04 · RN-01 a RN-04 · RV-08 a RV-14 · E-12 a E-17
    Task<ReservaDto> CrearReservaAsync(CrearReservaDto dto, CancellationToken ct = default);
    Task<ReservaDto> CrearReservaAsync(CrearReservaDto dto, Guid solicitanteId, CancellationToken ct = default);
    // RF-05 · E-32
    Task<PaginadoDto<ReservaDto>> ListarReservasAsync(FiltroReservasDto filtro, CancellationToken ct = default);
    Task<PaginadoDto<ReservaDto>> ListarReservasAsync(FiltroReservasDto filtro, Guid usuarioId, RolUsuario rol, CancellationToken ct = default);
    // RF-06
    Task<ReservaDetalleDto> ObtenerDetalleAsync(Guid id, CancellationToken ct = default);
    Task<ReservaDetalleDto> ObtenerDetalleAsync(Guid id, Guid usuarioId, RolUsuario rol, CancellationToken ct = default);
    // RF-07 · RN-05 · RN-06 · RV-15 a RV-17 · E-18 a E-21 · E-31
    Task<ReservaDto> CambiarEstadoAsync(Guid id, EstadoReserva nuevoEstado, CancellationToken ct = default);
    Task<ReservaDto> CambiarEstadoAsync(Guid id, EstadoReserva nuevoEstado, Guid usuarioId, RolUsuario rol, CancellationToken ct = default);
    // RF-08 · E-30
    Task<DashboardEstadisticasDto> ObtenerDashboardAsync(CancellationToken ct = default);
    Task<DashboardEstadisticasDto> ObtenerDashboardAsync(Guid usuarioId, RolUsuario rol, CancellationToken ct = default);
}
