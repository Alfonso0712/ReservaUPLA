using System;
using System.Threading;
using System.Threading.Tasks;
using ReservaUpla.Domain.Entities;

namespace ReservaUpla.Application.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<Usuario?> ObtenerPorCorreoAsync(string correo, CancellationToken ct = default);
    Task<bool> ExisteCorreoAsync(string correo, CancellationToken ct = default);
    Task AgregarAsync(Usuario usuario, CancellationToken ct = default);
}
