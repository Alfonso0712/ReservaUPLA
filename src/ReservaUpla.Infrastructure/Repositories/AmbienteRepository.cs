using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Infrastructure.Data;

namespace ReservaUpla.Infrastructure.Repositories;

public class AmbienteRepository : IAmbienteRepository
{
    private readonly AppDbContext _context;

    public AmbienteRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Ambiente?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Ambientes.AsNoTracking().FirstOrDefaultAsync(a => a.Id_Ambiente == id, ct);
    }

    public async Task<IReadOnlyList<Ambiente>> ListarAsync(Guid? responsableId = null, CancellationToken ct = default)
    {
        var query = _context.Ambientes.AsNoTracking();
        if (responsableId.HasValue)
            query = query.Where(a => a.Idr_Ambiente == responsableId.Value);

        return await query.OrderBy(a => a.Nom_Ambiente).ToListAsync(ct);
    }

    public async Task AgregarAsync(Ambiente ambiente, CancellationToken ct = default)
    {
        await _context.Ambientes.AddAsync(ambiente, ct);
    }

    public Task ActualizarAsync(Ambiente ambiente, CancellationToken ct = default)
    {
        _context.Ambientes.Update(ambiente);
        return Task.CompletedTask;
    }
}
