using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Infrastructure.Data;

namespace ReservaUpla.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Usuario?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Id_Usuario == id, ct);
    }

    public async Task<Usuario?> ObtenerPorIdSeguimientoAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Usuarios.FirstOrDefaultAsync(u => u.Id_Usuario == id, ct);
    }

    public async Task<Usuario?> ObtenerPorCorreoAsync(string correo, CancellationToken ct = default)
    {
        return await _context.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Cor_Usuario == correo, ct);
    }

    public async Task<bool> ExisteCorreoAsync(string correo, CancellationToken ct = default)
    {
        return await _context.Usuarios.AsNoTracking().AnyAsync(u => u.Cor_Usuario == correo, ct);
    }

    public async Task AgregarAsync(Usuario usuario, CancellationToken ct = default)
    {
        await _context.Usuarios.AddAsync(usuario, ct);
    }

    public Task ActualizarAsync(Usuario usuario, CancellationToken ct = default)
    {
        _context.Usuarios.Update(usuario);
        return Task.CompletedTask;
    }

    public async Task<IReadOnlyList<Usuario>> ListarResponsablesAsync(CancellationToken ct = default)
    {
        return await _context.Usuarios
            .AsNoTracking()
            .Where(u => u.Act_Usuario && u.Rol_Usuario == RolUsuario.Responsable)
            .OrderBy(u => u.Nom_Usuario)
            .ToListAsync(ct);
    }
}
