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
        EstadoReserva? estado,
        Guid? ambienteId,
        DateOnly? fecha,
        Guid? solicitanteId,
        Guid? responsableId,
        int pagina,
        int tamanoPagina,
        CancellationToken ct = default)
    {
        var query = ConstruirFiltro(estado, ambienteId, fecha, solicitanteId, responsableId);
        return await query
            .OrderByDescending(r => r.Fec_Reserva)
            .ThenByDescending(r => r.Hin_Reserva)
            .Skip((pagina - 1) * tamanoPagina)
            .Take(tamanoPagina)
            .ToListAsync(ct);
    }

    public async Task<int> ContarAsync(
        EstadoReserva? estado,
        Guid? ambienteId,
        DateOnly? fecha,
        Guid? solicitanteId,
        Guid? responsableId,
        CancellationToken ct = default)
    {
        var query = ConstruirFiltro(estado, ambienteId, fecha, solicitanteId, responsableId);
        return await query.CountAsync(ct);
    }

    // RN-01 · RV-14 · E-17
    public async Task<bool> HayConflictoAsync(
        Guid ambienteId,
        DateOnly fecha,
        TimeSpan inicio,
        TimeSpan fin,
        Guid? excluirReservaId = null,
        CancellationToken ct = default)
    {
        var query = _context.Reservas.AsNoTracking().Where(r =>
            r.Ida_Reserva == ambienteId &&
            r.Fec_Reserva == fecha &&
            r.Est_Reserva == EstadoReserva.Aprobada &&
            r.Hin_Reserva < fin &&
            r.Hfi_Reserva > inicio);

        if (excluirReservaId.HasValue)
            query = query.Where(r => r.Id_Reserva != excluirReservaId.Value);

        return await query.AnyAsync(ct);
    }

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
        var query = ConstruirFiltro(null, null, null, solicitanteId, responsableId);

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

        if (top == null) return ("Sin registros", 0);

        var ambiente = await _context.Ambientes.AsNoTracking().FirstOrDefaultAsync(a => a.Id_Ambiente == top.AmbienteId, ct);
        return (ambiente?.Nom_Ambiente ?? "Desconocido", top.Cantidad);
    }

    private IQueryable<Reserva> ConstruirFiltro(
        EstadoReserva? estado,
        Guid? ambienteId,
        DateOnly? fecha,
        Guid? solicitanteId,
        Guid? responsableId)
    {
        var query = _context.Reservas.AsNoTracking();

        if (estado.HasValue)
            query = query.Where(r => r.Est_Reserva == estado.Value);

        if (ambienteId.HasValue)
            query = query.Where(r => r.Ida_Reserva == ambienteId.Value);

        if (fecha.HasValue)
            query = query.Where(r => r.Fec_Reserva == fecha.Value);

        if (solicitanteId.HasValue)
            query = query.Where(r => r.Idu_Reserva == solicitanteId.Value);

        if (responsableId.HasValue)
        {
            query = query.Where(r => _context.Ambientes
                .Any(a => a.Id_Ambiente == r.Ida_Reserva && a.Idr_Ambiente == responsableId.Value));
        }

        return query;
    }
}
