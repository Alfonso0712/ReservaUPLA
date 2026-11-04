using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Infrastructure.Data;

namespace ReservaUpla.Infrastructure.Repositories;

public class ReservaRepository : IReservaRepository
{
    private const string EtiquetaSinRegistros = "Sin registros";
    private const string EtiquetaDesconocido = "Desconocido";

    private readonly AppDbContext _context;

    public ReservaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Reserva?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Reservas.FirstOrDefaultAsync(r => r.Id_Reserva == id, ct);
    }

    public async Task<IReadOnlyList<Reserva>> ListarAsync(
        ParametrosConsultaReservas parametros,
        CancellationToken ct = default)
    {
        var query = ConstruirFiltro(parametros);
        return await query
            .OrderByDescending(r => r.Fec_Reserva)
            .ThenByDescending(r => r.Hin_Reserva)
            .Skip((parametros.Pagina - 1) * parametros.TamanoPagina)
            .Take(parametros.TamanoPagina)
            .ToListAsync(ct);
    }

    public async Task<int> ContarAsync(
        ParametrosConsultaReservas parametros,
        CancellationToken ct = default)
    {
        var query = ConstruirFiltro(parametros);
        return await query.CountAsync(ct);
    }

    // RN-01 · RV-14 · E-17
    public async Task<bool> HayConflictoAsync(
        IntervaloHorario intervalo,
        CancellationToken ct = default)
    {
        var query = _context.Reservas.AsNoTracking().Where(r =>
            r.Ida_Reserva == intervalo.AmbienteId &&
            r.Fec_Reserva == intervalo.Fecha &&
            r.Est_Reserva == EstadoReserva.Aprobada &&
            r.Hin_Reserva < intervalo.Fin &&
            r.Hfi_Reserva > intervalo.Inicio);

        if (intervalo.ExcluirReservaId.HasValue)
            query = query.Where(r => r.Id_Reserva != intervalo.ExcluirReservaId.Value);

        return await query.AnyAsync(ct);
    }

    // Sobrecargas para retrocompatibilidad
    public Task<IReadOnlyList<Reserva>> ListarAsync(
        EstadoReserva? estado,
        Guid? ambienteId,
        DateOnly? fecha,
        Guid? solicitanteId,
        Guid? responsableId,
        int pagina,
        int tamanoPagina,
        CancellationToken ct = default)
        => ListarAsync(new ParametrosConsultaReservas(estado, ambienteId, fecha, solicitanteId, responsableId, pagina, tamanoPagina), ct);

    public Task<int> ContarAsync(
        EstadoReserva? estado,
        Guid? ambienteId,
        DateOnly? fecha,
        Guid? solicitanteId,
        Guid? responsableId,
        CancellationToken ct = default)
        => ContarAsync(new ParametrosConsultaReservas(estado, ambienteId, fecha, solicitanteId, responsableId), ct);

    public Task<bool> HayConflictoAsync(
        Guid ambienteId,
        DateOnly fecha,
        TimeSpan inicio,
        TimeSpan fin,
        Guid? excluirReservaId = null,
        CancellationToken ct = default)
        => HayConflictoAsync(new IntervaloHorario(ambienteId, fecha, inicio, fin, excluirReservaId), ct);

    public async Task AgregarAsync(Reserva reserva, CancellationToken ct = default)
    {
        await _context.Reservas.AddAsync(reserva, ct);
    }

    public Task ActualizarAsync(Reserva reserva, CancellationToken ct = default)
    {
        _context.Reservas.Update(reserva);
        return Task.CompletedTask;
    }

    public async Task<IReadOnlyList<Reserva>> ObtenerPorAmbienteYFechaAsync(Guid ambienteId, DateOnly fecha, CancellationToken ct = default)
    {
        return await _context.Reservas.AsNoTracking()
            .Where(r => r.Ida_Reserva == ambienteId && r.Fec_Reserva == fecha)
            .OrderBy(r => r.Hin_Reserva)
            .ToListAsync(ct);
    }

    // RF-08 · E-30
    public async Task<DashboardEstadisticasDto> ObtenerEstadisticasDashboardAsync(Guid? solicitanteId, Guid? responsableId, CancellationToken ct = default)
    {
        var query = ConstruirFiltro(new ParametrosConsultaReservas(SolicitanteId: solicitanteId, ResponsableId: responsableId));

        var total = await query.CountAsync(ct);
        var pendientes = await query.CountAsync(r => r.Est_Reserva == EstadoReserva.Pendiente, ct);
        var aprobadas = await query.CountAsync(r => r.Est_Reserva == EstadoReserva.Aprobada, ct);
        var rechazadas = await query.CountAsync(r => r.Est_Reserva == EstadoReserva.Rechazada, ct);
        var canceladas = await query.CountAsync(r => r.Est_Reserva == EstadoReserva.Cancelada, ct);

        var (nombreAmbienteMasUsado, usoMaximo) = await ObtenerAmbienteMasUtilizadoAsync(query, ct);

        return new DashboardEstadisticasDto(total, pendientes, aprobadas, rechazadas, canceladas, nombreAmbienteMasUsado, usoMaximo);
    }

    private async Task<(string Nombre, int Cantidad)> ObtenerAmbienteMasUtilizadoAsync(IQueryable<Reserva> query, CancellationToken ct)
    {
        var top = await query
            .GroupBy(r => r.Ida_Reserva)
            .Select(g => new { AmbienteId = g.Key, Cantidad = g.Count() })
            .OrderByDescending(x => x.Cantidad)
            .FirstOrDefaultAsync(ct);

        if (top == null) return (EtiquetaSinRegistros, 0);

        var ambiente = await _context.Ambientes.AsNoTracking().FirstOrDefaultAsync(a => a.Id_Ambiente == top.AmbienteId, ct);
        return (ambiente?.Nom_Ambiente ?? EtiquetaDesconocido, top.Cantidad);
    }

    private IQueryable<Reserva> ConstruirFiltro(ParametrosConsultaReservas parametros)
    {
        var query = _context.Reservas.AsNoTracking();

        if (parametros.Estado.HasValue)
            query = query.Where(r => r.Est_Reserva == parametros.Estado.Value);

        if (parametros.AmbienteId.HasValue)
            query = query.Where(r => r.Ida_Reserva == parametros.AmbienteId.Value);

        if (parametros.Fecha.HasValue)
            query = query.Where(r => r.Fec_Reserva == parametros.Fecha.Value);

        if (parametros.SolicitanteId.HasValue)
            query = query.Where(r => r.Idu_Reserva == parametros.SolicitanteId.Value);

        if (parametros.ResponsableId.HasValue)
        {
            query = query.Where(r => _context.Ambientes
                .Any(a => a.Id_Ambiente == r.Ida_Reserva && a.Idr_Ambiente == parametros.ResponsableId.Value));
        }

        return query;
    }
}
