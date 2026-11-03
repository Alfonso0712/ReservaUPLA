using System;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Infrastructure.Data;

namespace ReservaUpla.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int> GuardarCambiosAsync(CancellationToken ct = default)
    {
        return await _context.SaveChangesAsync(ct);
    }

    // RN-01 · E-31
    public async Task<TResult> EjecutarEnTransaccionSerializableAsync<TResult>(Func<Task<TResult>> accion, CancellationToken ct = default)
    {
        if (!_context.Database.IsRelational())
        {
            return await accion();
        }

        var executionStrategy = _context.Database.CreateExecutionStrategy();
        return await executionStrategy.ExecuteAsync(async () =>
        {
            await using var transaccion = await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable, ct);
            try
            {
                var resultado = await accion();
                await transaccion.CommitAsync(ct);
                return resultado;
            }
            catch
            {
                await transaccion.RollbackAsync(ct);
                throw;
            }
        });
    }
}
