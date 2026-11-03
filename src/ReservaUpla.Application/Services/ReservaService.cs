using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Mappers;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Application.Services;

// RF-03 a RF-08 · RN-01 a RN-06 · RV-08 a RV-17 · E-12 a E-21 · E-30 a E-32
public class ReservaService : IReservaService
{
    private readonly IReservaRepository _reservaRepo;
    private readonly IAmbienteRepository _ambienteRepo;
    private readonly IUsuarioRepository _usuarioRepo;
    private readonly IUnitOfWork _unitOfWork;

    public ReservaService(
        IReservaRepository reservaRepo,
        IAmbienteRepository ambienteRepo,
        IUsuarioRepository usuarioRepo,
        IUnitOfWork unitOfWork)
    {
        _reservaRepo = reservaRepo;
        _ambienteRepo = ambienteRepo;
        _usuarioRepo = usuarioRepo;
        _unitOfWork = unitOfWork;
    }

    public async Task<ReservaDto> CrearReservaAsync(CrearReservaDto dto, Guid solicitanteId, CancellationToken ct = default)
    {
        return await _unitOfWork.EjecutarEnTransaccionSerializableAsync(async () =>
        {
            var ambiente = await _ambienteRepo.ObtenerPorIdAsync(dto.AmbienteId, ct)
                ?? throw new DomainException(Mensajes.AmbienteNoExiste);

            if (ambiente.Est_Ambiente != EstadoAmbiente.Disponible)
                throw new DomainException(Mensajes.AmbienteNoDisponible);

            var conflicto = await _reservaRepo.HayConflictoAsync(
                dto.AmbienteId, dto.Fecha, dto.HoraInicio, dto.HoraFin, null, ct);
            if (conflicto)
                throw new DomainException(Mensajes.ConflictoDisponibilidad, esConflicto: true);

            var solicitante = await _usuarioRepo.ObtenerPorIdAsync(solicitanteId, ct)
                ?? throw new DomainException(Mensajes.RecursoNoEncontrado);

            var reserva = Reserva.Crear(dto.Fecha, dto.HoraInicio, dto.HoraFin, dto.Motivo, solicitanteId, dto.AmbienteId);
            await _reservaRepo.AgregarAsync(reserva, ct);
            await _unitOfWork.GuardarCambiosAsync(ct);

            return ReservaMapper.ToDto(reserva, solicitante.Nom_Usuario, ambiente.Nom_Ambiente);
        }, ct);
    }

    public async Task<ReservaDto> CambiarEstadoAsync(Guid id, EstadoReserva nuevoEstado, Guid usuarioId, RolUsuario rol, CancellationToken ct = default)
    {
        return await _unitOfWork.EjecutarEnTransaccionSerializableAsync(async () =>
        {
            var reserva = await _reservaRepo.ObtenerPorIdAsync(id, ct)
                ?? throw new DomainException(Mensajes.RecursoNoEncontrado);

            if (nuevoEstado == EstadoReserva.Aprobada)
            {
                var conflicto = await _reservaRepo.HayConflictoAsync(
                    reserva.Ida_Reserva, reserva.Fec_Reserva, reserva.Hin_Reserva, reserva.Hfi_Reserva, reserva.Id_Reserva, ct);
                if (conflicto)
                    throw new DomainException(Mensajes.ConflictoDisponibilidad, esConflicto: true);
            }

            reserva.CambiarEstado(nuevoEstado, rol, usuarioId);
            await _reservaRepo.ActualizarAsync(reserva, ct);
            await _unitOfWork.GuardarCambiosAsync(ct);

            var solicitante = await _usuarioRepo.ObtenerPorIdAsync(reserva.Idu_Reserva, ct);
            var ambiente = await _ambienteRepo.ObtenerPorIdAsync(reserva.Ida_Reserva, ct);

            return ReservaMapper.ToDto(reserva, solicitante?.Nom_Usuario ?? string.Empty, ambiente?.Nom_Ambiente ?? string.Empty);
        }, ct);
    }

    public async Task<PaginadoDto<ReservaDto>> ListarReservasAsync(FiltroReservasDto filtro, Guid usuarioId, RolUsuario rol, CancellationToken ct = default)
    {
        var (solId, respId) = ResolverAlcanceVisibilidad(rol, usuarioId);
        EstadoReserva? estEnum = !string.IsNullOrWhiteSpace(filtro.Estado) && Enum.TryParse<EstadoReserva>(filtro.Estado, true, out var e) ? e : null;

        var total = await _reservaRepo.ContarAsync(estEnum, filtro.AmbienteId, filtro.Fecha, solId, respId, ct);
        var lista = await _reservaRepo.ListarAsync(estEnum, filtro.AmbienteId, filtro.Fecha, solId, respId, filtro.Pagina, filtro.TamanoPagina, ct);

        var dtos = new List<ReservaDto>(lista.Count);
        foreach (var r in lista)
        {
            var sol = await _usuarioRepo.ObtenerPorIdAsync(r.Idu_Reserva, ct);
            var amb = await _ambienteRepo.ObtenerPorIdAsync(r.Ida_Reserva, ct);
            dtos.Add(ReservaMapper.ToDto(r, sol?.Nom_Usuario ?? string.Empty, amb?.Nom_Ambiente ?? string.Empty));
        }

        return new PaginadoDto<ReservaDto>(dtos, total, filtro.Pagina, filtro.TamanoPagina);
    }

    public async Task<ReservaDetalleDto> ObtenerDetalleAsync(Guid id, Guid usuarioId, RolUsuario rol, CancellationToken ct = default)
    {
        var reserva = await _reservaRepo.ObtenerPorIdAsync(id, ct)
            ?? throw new DomainException(Mensajes.RecursoNoEncontrado);

        var ambiente = await _ambienteRepo.ObtenerPorIdAsync(reserva.Ida_Reserva, ct)
            ?? throw new DomainException(Mensajes.RecursoNoEncontrado);

        ValidarPermisoDetalle(reserva, ambiente, rol, usuarioId);

        var solicitante = await _usuarioRepo.ObtenerPorIdAsync(reserva.Idu_Reserva, ct)
            ?? throw new DomainException(Mensajes.RecursoNoEncontrado);

        return ReservaMapper.ToDetalleDto(
            reserva,
            solicitante.Nom_Usuario,
            solicitante.Cor_Usuario,
            ambiente.Nom_Ambiente,
            ambiente.Ubi_Ambiente,
            ambiente.Tip_Ambiente.ToString());
    }

    public async Task<DashboardEstadisticasDto> ObtenerDashboardAsync(Guid usuarioId, RolUsuario rol, CancellationToken ct = default)
    {
        var (solId, respId) = ResolverAlcanceVisibilidad(rol, usuarioId);
        return await _reservaRepo.ObtenerEstadisticasDashboardAsync(solId, respId, ct);
    }

    private static (Guid? SolicitanteId, Guid? ResponsableId) ResolverAlcanceVisibilidad(RolUsuario rol, Guid usuarioId)
    {
        return rol switch
        {
            RolUsuario.Solicitante => (usuarioId, null),
            RolUsuario.Responsable => (null, usuarioId),
            _ => (null, null)
        };
    }

    private static void ValidarPermisoDetalle(Reserva reserva, Ambiente ambiente, RolUsuario rol, Guid usuarioId)
    {
        if (rol == RolUsuario.Solicitante && reserva.Idu_Reserva != usuarioId)
            throw new DomainException(Mensajes.AccesoDenegado);

        if (rol == RolUsuario.Responsable && ambiente.Idr_Ambiente != usuarioId)
            throw new DomainException(Mensajes.AccesoDenegado);
    }
}
