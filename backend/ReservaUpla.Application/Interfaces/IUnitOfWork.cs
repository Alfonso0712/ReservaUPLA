using System;
using System.Threading;
using System.Threading.Tasks;

namespace ReservaUpla.Application.Interfaces;

public interface IUnitOfWork
{
    Task<int> GuardarCambiosAsync(CancellationToken ct = default);
    Task<TResult> EjecutarEnTransaccionSerializableAsync<TResult>(Func<Task<TResult>> accion, CancellationToken ct = default);
}
