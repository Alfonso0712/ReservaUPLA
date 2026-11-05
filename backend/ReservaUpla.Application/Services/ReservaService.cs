using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Mappers;
using ReservaUpla.Domain.Common;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Application.Services;

// RF-03 a RF-08 · RN-01 a RN-06 · RV-08 a RV-17 · E-12 a E-21 · E-30 a E-32 · E-45 a E-49
public class ReservaService : IReservaService
{
    private readonly IReservaRepository _reservaRepo;
    private readonly IAmbienteRepository _ambienteRepo;
    private readonly IUsuarioRepository _usuarioRepo;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUsuarioActual? _usuarioActual;

    public ReservaService(
        IReservaRepository reservaRepo,
        IAmbienteRepository ambienteRepo,
        IUsuarioRepository usuarioRepo,
        IUnitOfWork unitOfWork,
        IUsuarioActual? usuarioActual = null)
    {
        _reservaRepo = reservaRepo;
        _ambienteRepo = ambienteRepo;
        _usuarioRepo = usuarioRepo;
        _unitOfWork = unitOfWork;
        _usuarioActual = usuarioActual;
    }

    public async Task<ReservaDto> CrearReservaAsync(CrearReservaDto dto, CancellationToken ct = default)
    {
        var solicitanteId = _usuarioActual?.Id ?? Guid.Empty;
        if (solicitanteId == Guid.Empty)
            throw new DomainException(Mensajes.AccesoDenegado);

        return await CrearReservaAsync(dto, solicitanteId, ct);
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
                new IntervaloHorario(dto.AmbienteId, dto.Fecha, dto.HoraInicio, dto.HoraFin), ct);
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

    public async Task<ReservaDto> CambiarEstadoAsync(Guid id, EstadoReserva nuevoEstado, CancellationToken ct = default)
    {
        if (_usuarioActual == null || !_usuarioActual.EstaAutenticado)
            throw new DomainException(Mensajes.AccesoDenegado);

        return await CambiarEstadoAsync(id, nuevoEstado, _usuarioActual, ct);
    }

    public Task<ReservaDto> CambiarEstadoAsync(Guid id, EstadoReserva nuevoEstado, Guid usuarioId, RolUsuario rol, CancellationToken ct = default)
        => CambiarEstadoAsync(id, nuevoEstado, new ActorReserva(usuarioId, rol), ct);

    public async Task<ReservaDto> CambiarEstadoAsync(Guid id, EstadoReserva nuevoEstado, IActor actor, CancellationToken ct = default)
    {
        return await _unitOfWork.EjecutarEnTransaccionSerializableAsync(async () =>
        {
            var reserva = await _reservaRepo.ObtenerPorIdAsync(id, ct)
                ?? throw new DomainException(Mensajes.RecursoNoEncontrado);

            var ambiente = await _ambienteRepo.ObtenerPorIdAsync(reserva.Ida_Reserva, ct)
                ?? throw new DomainException(Mensajes.RecursoNoEncontrado);

            ValidarVisibilidadPorAlcance(reserva, ambiente, actor);

            reserva.CambiarEstado(nuevoEstado, actor);

            if (nuevoEstado == EstadoReserva.Aprobada)
            {
                await ValidarConflictoAprobacionAsync(reserva, ct);
            }

            await _reservaRepo.ActualizarAsync(reserva, ct);
            await _unitOfWork.GuardarCambiosAsync(ct);

            var solicitante = await _usuarioRepo.ObtenerPorIdAsync(reserva.Idu_Reserva, ct);

            return ReservaMapper.ToDto(reserva, solicitante?.Nom_Usuario ?? string.Empty, ambiente.Nom_Ambiente);
        }, ct);
    }

    private async Task ValidarConflictoAprobacionAsync(Reserva reserva, CancellationToken ct)
    {
        var conflicto = await _reservaRepo.HayConflictoAsync(
            new IntervaloHorario(reserva.Ida_Reserva, reserva.Fec_Reserva, reserva.Hin_Reserva, reserva.Hfi_Reserva, reserva.Id_Reserva), ct);
        if (conflicto)
            throw new DomainException(Mensajes.ConflictoDisponibilidad, esConflicto: true);
    }

    public async Task<PaginadoDto<ReservaDto>> ListarReservasAsync(FiltroReservasDto filtro, CancellationToken ct = default)
    {
        var actor = (IActor?)_usuarioActual ?? new ActorReserva(Guid.Empty, RolUsuario.Solicitante);
        return await ListarReservasAsync(filtro, actor, ct);
    }

    public async Task<PaginadoDto<ReservaDto>> ListarReservasAsync(FiltroReservasDto filtro, IActor actor, CancellationToken ct = default)
    {
        var (solId, respId) = ResolverAlcanceVisibilidad(actor);
        EstadoReserva? estEnum = !string.IsNullOrWhiteSpace(filtro.Estado) && Enum.TryParse<EstadoReserva>(filtro.Estado, true, out var e) ? e : null;

        var parametros = new ParametrosConsultaReservas(estEnum, filtro.AmbienteId, filtro.Fecha, solId, respId, filtro.Pagina, filtro.TamanoPagina);
        var total = await _reservaRepo.ContarAsync(parametros, ct);
        var lista = await _reservaRepo.ListarAsync(parametros, ct);

        var dtos = new List<ReservaDto>(lista.Count);
        foreach (var r in lista)
        {
            var sol = await _usuarioRepo.ObtenerPorIdAsync(r.Idu_Reserva, ct);
            var amb = await _ambienteRepo.ObtenerPorIdAsync(r.Ida_Reserva, ct);
            dtos.Add(ReservaMapper.ToDto(r, sol?.Nom_Usuario ?? string.Empty, amb?.Nom_Ambiente ?? string.Empty));
        }

        return new PaginadoDto<ReservaDto>(dtos, total, filtro.Pagina, filtro.TamanoPagina);
    }

    public Task<PaginadoDto<ReservaDto>> ListarReservasAsync(FiltroReservasDto filtro, Guid usuarioId, RolUsuario rol, CancellationToken ct = default)
        => ListarReservasAsync(filtro, new ActorReserva(usuarioId, rol), ct);

    public async Task<ReservaDetalleDto> ObtenerDetalleAsync(Guid id, CancellationToken ct = default)
    {
        var actor = (IActor?)_usuarioActual ?? new ActorReserva(Guid.Empty, RolUsuario.Solicitante);
        return await ObtenerDetalleAsync(id, actor, ct);
    }

    public async Task<ReservaDetalleDto> ObtenerDetalleAsync(Guid id, IActor actor, CancellationToken ct = default)
    {
        var reserva = await _reservaRepo.ObtenerPorIdAsync(id, ct)
            ?? throw new DomainException(Mensajes.RecursoNoEncontrado);

        var ambiente = await _ambienteRepo.ObtenerPorIdAsync(reserva.Ida_Reserva, ct)
            ?? throw new DomainException(Mensajes.RecursoNoEncontrado);

        ValidarVisibilidadPorAlcance(reserva, ambiente, actor);

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

    public Task<ReservaDetalleDto> ObtenerDetalleAsync(Guid id, Guid usuarioId, RolUsuario rol, CancellationToken ct = default)
        => ObtenerDetalleAsync(id, new ActorReserva(usuarioId, rol), ct);

    public async Task<DashboardEstadisticasDto> ObtenerDashboardAsync(CancellationToken ct = default)
    {
        var actor = (IActor?)_usuarioActual ?? new ActorReserva(Guid.Empty, RolUsuario.Solicitante);
        return await ObtenerDashboardAsync(actor, ct);
    }

    public async Task<DashboardEstadisticasDto> ObtenerDashboardAsync(IActor actor, CancellationToken ct = default)
    {
        var (solId, respId) = ResolverAlcanceVisibilidad(actor);
        var stats = await _reservaRepo.ObtenerEstadisticasDashboardAsync(solId, respId, ct);
        var alcance = actor.Rol switch
        {
            RolUsuario.Solicitante => "propio",
            RolUsuario.Responsable => "asignado",
            _ => "global"
        };
        return stats with { Alcance = alcance };
    }

    public Task<DashboardEstadisticasDto> ObtenerDashboardAsync(Guid usuarioId, RolUsuario rol, CancellationToken ct = default)
        => ObtenerDashboardAsync(new ActorReserva(usuarioId, rol), ct);

    private static (Guid? SolicitanteId, Guid? ResponsableId) ResolverAlcanceVisibilidad(IActor actor)
        => ResolverAlcanceVisibilidad(actor.Rol, actor.Id);

    private static (Guid? SolicitanteId, Guid? ResponsableId) ResolverAlcanceVisibilidad(RolUsuario rol, Guid usuarioId)
    {
        return rol switch
        {
            RolUsuario.Solicitante => (usuarioId, null),
            RolUsuario.Responsable => (null, usuarioId),
            _ => (null, null)
        };
    }

    private static void ValidarVisibilidadPorAlcance(Reserva reserva, Ambiente ambiente, IActor actor)
        => ValidarVisibilidadPorAlcance(reserva, ambiente, actor.Rol, actor.Id);

    private static void ValidarVisibilidadPorAlcance(Reserva reserva, Ambiente ambiente, RolUsuario rol, Guid usuarioId)
    {
        if (rol == RolUsuario.Solicitante && reserva.Idu_Reserva != usuarioId)
            throw new DomainException(Mensajes.RecursoNoEncontrado);

        if (rol == RolUsuario.Responsable && ambiente.Idr_Ambiente != usuarioId)
            throw new DomainException(Mensajes.RecursoNoEncontrado);
    }
}
