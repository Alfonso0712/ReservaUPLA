using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Common;
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

        var adminPass = _config["Seeder:AdminPassword"] ?? "AdminUpla2026!";
        var respPass = _config["Seeder:ResponsablePassword"] ?? "RespUpla2026!";
        var solicPass = "SolicUpla2026!";

        var admin = Usuario.Crear("Carlos Mendoza Quispe", "admin@upla.edu.pe", _hasher.HashPassword(adminPass), RolUsuario.Administrador);
        var responsable = Usuario.Crear("Elena Huamán Rojas", "responsable@upla.edu.pe", _hasher.HashPassword(respPass), RolUsuario.Responsable);
        var solicitante1 = Usuario.Crear("Marco Paredes Castro", "solicitante@upla.edu.pe", _hasher.HashPassword(solicPass), RolUsuario.Solicitante);
        var solicitante2 = Usuario.Crear("Lucía Gómez Soto", "lgomez@upla.edu.pe", _hasher.HashPassword(solicPass), RolUsuario.Solicitante);

        await _context.Usuarios.AddRangeAsync(new[] { admin, responsable, solicitante1, solicitante2 }, ct);
        await _context.SaveChangesAsync(ct);

        var amb1 = Ambiente.Crear("Laboratorio de Cómputo 101", TipoAmbiente.LaboratorioComputo, 30, "Pabellón B, 3er piso", responsable.Id_Usuario);
        var amb2 = Ambiente.Crear("Auditorio Central UPLA", TipoAmbiente.Auditorio, 200, "Pabellón A, 1er piso", responsable.Id_Usuario);
        var amb3 = Ambiente.Crear("Sala de Reuniones Decanato", TipoAmbiente.SalaReuniones, 20, "Pabellón C, 2do piso");
        var amb4 = Ambiente.Crear("Laboratorio Especializado de Redes", TipoAmbiente.LaboratorioEspecializado, 25, "Pabellón B, 4to piso", responsable.Id_Usuario);

        await _context.Ambientes.AddRangeAsync(new[] { amb1, amb2, amb3, amb4 }, ct);
        await _context.SaveChangesAsync(ct);

        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);
        var adminActor = new ActorReserva(admin.Id_Usuario, RolUsuario.Administrador);
        var solicActor = new ActorReserva(solicitante1.Id_Usuario, RolUsuario.Solicitante);

        var res1 = Reserva.Crear(hoy.AddDays(10), new TimeSpan(10, 0, 0), new TimeSpan(12, 0, 0), "Práctica calificada de Construcción de Software con estudiantes del IX ciclo.", solicitante1.Id_Usuario, amb1.Id_Ambiente);
        res1.CambiarEstado(EstadoReserva.Aprobada, adminActor);

        var res2 = Reserva.Crear(hoy.AddDays(11), new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Taller de pruebas automatizadas y aseguramiento de calidad de software.", solicitante1.Id_Usuario, amb1.Id_Ambiente);

        var res3 = Reserva.Crear(hoy.AddDays(12), new TimeSpan(15, 0, 0), new TimeSpan(18, 0, 0), "Conferencia magistral de arquitectura de software para la facultad de ingeniería.", solicitante2.Id_Usuario, amb2.Id_Ambiente);

        var res4 = Reserva.Crear(hoy.AddDays(7), new TimeSpan(9, 0, 0), new TimeSpan(11, 0, 0), "Coordinación de acreditación académica del comité curricular de ingeniería.", solicitante1.Id_Usuario, amb3.Id_Ambiente);
        res4.CambiarEstado(EstadoReserva.Rechazada, adminActor);

        var res5 = Reserva.Crear(hoy.AddDays(13), new TimeSpan(14, 0, 0), new TimeSpan(16, 0, 0), "Simulación de topologías de red empresarial para el curso de redes.", solicitante1.Id_Usuario, amb4.Id_Ambiente);
        res5.CambiarEstado(EstadoReserva.Cancelada, solicActor);

        await _context.Reservas.AddRangeAsync(new[] { res1, res2, res3, res4, res5 }, ct);
        await _context.SaveChangesAsync(ct);
    }
}
