using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Infrastructure.Data;

public class DatabaseSeeder
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasherService _hasher;
    private readonly IConfiguration _config;

    public DatabaseSeeder(AppDbContext context, IPasswordHasherService hasher, IConfiguration config)
    {
        _context = context;
        _hasher = hasher;
        _config = config;
    }

    public async Task SeedAsync(CancellationToken ct = default)
    {
        if (await _context.Usuarios.AnyAsync(ct))
            return;

        var adminPass = _config["Seeder:AdminPassword"] ?? "Admin123*";
        var respPass = _config["Seeder:ResponsablePassword"] ?? "Responsable123*";

        var admin = Usuario.Crear("Administrador General", "admin@upla.edu.pe", _hasher.HashPassword(adminPass), RolUsuario.Administrador);
        var responsable = Usuario.Crear("Carlos Responsable", "responsable@upla.edu.pe", _hasher.HashPassword(respPass), RolUsuario.Responsable);

        await _context.Usuarios.AddRangeAsync(new[] { admin, responsable }, ct);
        await _context.SaveChangesAsync(ct);

        var amb1 = Ambiente.Crear("Laboratorio de Computo 101", TipoAmbiente.LaboratorioComputo, 30, "Pabellon B - Piso 1", responsable.Id_Usuario);
        var amb2 = Ambiente.Crear("Auditorio Central UPLA", TipoAmbiente.Auditorio, 200, "Pabellon A - Piso 2", responsable.Id_Usuario);
        var amb3 = Ambiente.Crear("Sala de Reuniones Decanato", TipoAmbiente.SalaReuniones, 15, "Pabellon A - Piso 1");
        var amb4 = Ambiente.Crear("Laboratorio Especializado de Redes", TipoAmbiente.LaboratorioEspecializado, 25, "Pabellon C - Piso 2", responsable.Id_Usuario);

        await _context.Ambientes.AddRangeAsync(new[] { amb1, amb2, amb3, amb4 }, ct);
        await _context.SaveChangesAsync(ct);
    }
}
