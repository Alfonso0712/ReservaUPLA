using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Application.Interfaces;

public interface IReservaRepository
{
    Task<Reserva?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);

    Task<IReadOnlyList<Reserva>> ListarAsync(
        ParametrosConsultaReservas parametros,
        CancellationToken ct = default);

    Task<int> ContarAsync(
        ParametrosConsultaReservas parametros,
        CancellationToken ct = default);

    Task<bool> HayConflictoAsync(
        IntervaloHorario intervalo,
        CancellationToken ct = default);

    // Sobrecargas para retrocompatibilidad
    Task<IReadOnlyList<Reserva>> ListarAsync(
        EstadoReserva? estado,
        Guid? ambienteId,
        DateOnly? fecha,
        Guid? solicitanteId,
        Guid? responsableId,
        int pagina,
        int tamanoPagina,
        CancellationToken ct = default);

    Task<int> ContarAsync(
        EstadoReserva? estado,
        Guid? ambienteId,
        DateOnly? fecha,
        Guid? solicitanteId,
        Guid? responsableId,
        CancellationToken ct = default);

    Task<bool> HayConflictoAsync(
        Guid ambienteId,
        DateOnly fecha,
        TimeSpan inicio,
        TimeSpan fin,
        Guid? excluirReservaId = null,
        CancellationToken ct = default);

    Task AgregarAsync(Reserva reserva, CancellationToken ct = default);
    Task ActualizarAsync(Reserva reserva, CancellationToken ct = default);
    Task<IReadOnlyList<Reserva>> ObtenerPorAmbienteYFechaAsync(Guid ambienteId, DateOnly fecha, CancellationToken ct = default);
    Task<DashboardEstadisticasDto> ObtenerEstadisticasDashboardAsync(Guid? solicitanteId, Guid? responsableId, CancellationToken ct = default);
}
