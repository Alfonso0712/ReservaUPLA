using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ReservaUpla.Domain.Entities;

namespace ReservaUpla.Application.Interfaces;

public interface IAmbienteRepository
{
    Task<Ambiente?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Ambiente>> ListarAsync(Guid? responsableId = null, CancellationToken ct = default);
    Task AgregarAsync(Ambiente ambiente, CancellationToken ct = default);
    Task ActualizarAsync(Ambiente ambiente, CancellationToken ct = default);
}
