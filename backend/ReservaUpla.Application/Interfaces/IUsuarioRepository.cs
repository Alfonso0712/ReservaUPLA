using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Application.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default);
    Task<Usuario?> ObtenerPorIdSeguimientoAsync(Guid id, CancellationToken ct = default);
    Task<Usuario?> ObtenerPorCorreoAsync(string correo, CancellationToken ct = default);
    Task<bool> ExisteCorreoAsync(string correo, CancellationToken ct = default);
    Task AgregarAsync(Usuario usuario, CancellationToken ct = default);
    Task ActualizarAsync(Usuario usuario, CancellationToken ct = default);
    Task<IReadOnlyList<Usuario>> ListarResponsablesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<Usuario>> ListarAsync(string? busqueda = null, RolUsuario? rol = null, bool? activo = null, CancellationToken ct = default);
    Task<int> ContarAmbientesAsignadosAsync(Guid usuarioId, CancellationToken ct = default);
}
