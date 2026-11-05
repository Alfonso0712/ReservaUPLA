using System;
using System.Collections.Generic;
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

        // 1. Usuarios Principales de Demostración
        var admin = Usuario.Crear("Carlos Mendoza Quispe", "admin@upla.edu.pe", _hasher.HashPassword(adminPass), RolUsuario.Administrador);
        var respElena = Usuario.Crear("Elena Huamán Rojas", "responsable@upla.edu.pe", _hasher.HashPassword(respPass), RolUsuario.Responsable);
        var solicMarco = Usuario.Crear("Marco Paredes Castro", "solicitante@upla.edu.pe", _hasher.HashPassword(solicPass), RolUsuario.Solicitante);

        // 2. Responsables adicionales
        var respMiguel = Usuario.Crear("Miguel Ángel Cárdenas", "mcardenas@upla.edu.pe", _hasher.HashPassword(respPass), RolUsuario.Responsable);
        var respPatricia = Usuario.Crear("Patricia Valdivia Meza", "pvaldivia@upla.edu.pe", _hasher.HashPassword(respPass), RolUsuario.Responsable);
        var respRoberto = Usuario.Crear("Roberto Sánchez Flores", "rsanchez@upla.edu.pe", _hasher.HashPassword(respPass), RolUsuario.Responsable);
        var respBeatriz = Usuario.Crear("Beatriz Morales Soto", "bmorales@upla.edu.pe", _hasher.HashPassword(respPass), RolUsuario.Responsable);

        // 3. 10 Solicitantes adicionales
        var solicLucia = Usuario.Crear("Lucía Gómez Soto", "lgomez@upla.edu.pe", _hasher.HashPassword(solicPass), RolUsuario.Solicitante);
        var solicJorge = Usuario.Crear("Jorge Luis Fernández", "jfernandez@upla.edu.pe", _hasher.HashPassword(solicPass), RolUsuario.Solicitante);
        var solicAna = Usuario.Crear("Ana María Torres Ríos", "atorres@upla.edu.pe", _hasher.HashPassword(solicPass), RolUsuario.Solicitante);
        var solicDiego = Usuario.Crear("Diego Alonso Ramos", "dramos@upla.edu.pe", _hasher.HashPassword(solicPass), RolUsuario.Solicitante);
        var solicValeria = Usuario.Crear("Valeria Quispe Salazar", "vquispe@upla.edu.pe", _hasher.HashPassword(solicPass), RolUsuario.Solicitante);
        var solicChristian = Usuario.Crear("Christian Vargas Poma", "cvargas@upla.edu.pe", _hasher.HashPassword(solicPass), RolUsuario.Solicitante);
        var solicFiorella = Usuario.Crear("Fiorella Castro Meza", "fcastro@upla.edu.pe", _hasher.HashPassword(solicPass), RolUsuario.Solicitante);
        var solicRodrigo = Usuario.Crear("Rodrigo Peñaloza Cano", "rpenaloza@upla.edu.pe", _hasher.HashPassword(solicPass), RolUsuario.Solicitante);
        var solicGabriela = Usuario.Crear("Gabriela Mendoza Chávez", "gmendoza@upla.edu.pe", _hasher.HashPassword(solicPass), RolUsuario.Solicitante);
        var solicRaul = Usuario.Crear("Raúl Esteban Herrera", "rherrera@upla.edu.pe", _hasher.HashPassword(solicPass), RolUsuario.Solicitante);

        var todosUsuarios = new[]
        {
            admin, respElena, solicMarco,
            respMiguel, respPatricia, respRoberto, respBeatriz,
            solicLucia, solicJorge, solicAna, solicDiego, solicValeria,
            solicChristian, solicFiorella, solicRodrigo, solicGabriela, solicRaul
        };

        await _context.Usuarios.AddRangeAsync(todosUsuarios, ct);
        await _context.SaveChangesAsync(ct);

        // 4. 20 Ambientes del Campus UPLA
        var amb1 = Ambiente.Crear("Laboratorio de Cómputo 101", TipoAmbiente.LaboratorioComputo, 35, "Pabellón B, 1er piso", respElena.Id_Usuario);
        var amb2 = Ambiente.Crear("Laboratorio de Cómputo 102", TipoAmbiente.LaboratorioComputo, 40, "Pabellón B, 1er piso", respElena.Id_Usuario);
        var amb3 = Ambiente.Crear("Laboratorio de Cómputo 201", TipoAmbiente.LaboratorioComputo, 30, "Pabellón B, 2do piso", respMiguel.Id_Usuario);
        var amb4 = Ambiente.Crear("Laboratorio de Cómputo 202", TipoAmbiente.LaboratorioComputo, 35, "Pabellón B, 2do piso", respMiguel.Id_Usuario);
        amb4.ActualizarEstado(EstadoAmbiente.Mantenimiento);

        var amb5 = Ambiente.Crear("Laboratorio de Simulación y Redes", TipoAmbiente.LaboratorioEspecializado, 28, "Pabellón B, 3er piso", respMiguel.Id_Usuario);
        var amb6 = Ambiente.Crear("Laboratorio de Inteligencia Artificial", TipoAmbiente.LaboratorioEspecializado, 25, "Pabellón B, 4to piso", respPatricia.Id_Usuario);
        var amb7 = Ambiente.Crear("Laboratorio de Robótica y Automatización", TipoAmbiente.LaboratorioEspecializado, 24, "Pabellón B, 4to piso", respPatricia.Id_Usuario);
        var amb8 = Ambiente.Crear("Laboratorio de Física Aplicada", TipoAmbiente.LaboratorioEspecializado, 30, "Pabellón C, 1er piso", respRoberto.Id_Usuario);
        var amb9 = Ambiente.Crear("Laboratorio de Química e Industrial", TipoAmbiente.LaboratorioEspecializado, 26, "Pabellón C, 1er piso", respRoberto.Id_Usuario);
        amb9.ActualizarEstado(EstadoAmbiente.Mantenimiento);

        var amb10 = Ambiente.Crear("Auditorio Central UPLA", TipoAmbiente.Auditorio, 350, "Pabellón A, 1er piso", respElena.Id_Usuario);
        var amb11 = Ambiente.Crear("Auditorio de la Facultad de Ingeniería", TipoAmbiente.Auditorio, 200, "Pabellón B, 5to piso", respElena.Id_Usuario);
        var amb12 = Ambiente.Crear("Auditorio de Posgrado y Doctorado", TipoAmbiente.Auditorio, 120, "Edificio de Posgrado, 3er piso", respBeatriz.Id_Usuario);
        var amb13 = Ambiente.Crear("Sala de Reuniones Decanato", TipoAmbiente.SalaReuniones, 18, "Pabellón A, 2do piso");
        var amb14 = Ambiente.Crear("Sala de Grados y Tesis A", TipoAmbiente.SalaReuniones, 25, "Pabellón A, 3er piso", respBeatriz.Id_Usuario);
        var amb15 = Ambiente.Crear("Sala de Grados y Tesis B", TipoAmbiente.SalaReuniones, 20, "Pabellón A, 3er piso", respBeatriz.Id_Usuario);
        var amb16 = Ambiente.Crear("Sala de Videoconferencias UPLA", TipoAmbiente.SalaReuniones, 16, "Edificio Central, 2do piso", respElena.Id_Usuario);
        var amb17 = Ambiente.Crear("Sala de Profesores de Ingeniería", TipoAmbiente.SalaReuniones, 14, "Pabellón B, 2do piso", respMiguel.Id_Usuario);
        var amb18 = Ambiente.Crear("Laboratorio de Innovación y Proyectos TIC", TipoAmbiente.LaboratorioEspecializado, 32, "Pabellón D, 2do piso", respPatricia.Id_Usuario);
        var amb19 = Ambiente.Crear("Auditorio Magna Chupaca", TipoAmbiente.Auditorio, 280, "Sede Chupaca, Pabellón Principal", respRoberto.Id_Usuario);
        var amb20 = Ambiente.Crear("Sala de Coordinación Curricular", TipoAmbiente.SalaReuniones, 12, "Pabellón Central, 3er piso");

        var todosAmbientes = new[]
        {
            amb1, amb2, amb3, amb4, amb5, amb6, amb7, amb8, amb9, amb10,
            amb11, amb12, amb13, amb14, amb15, amb16, amb17, amb18, amb19, amb20
        };

        await _context.Ambientes.AddRangeAsync(todosAmbientes, ct);
        await _context.SaveChangesAsync(ct);

        // 5. 30 Reservas con diferentes estados y horarios
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);
        var adminActor = new ActorReserva(admin.Id_Usuario, RolUsuario.Administrador);

        var listaReservas = new List<Reserva>();

        // Función auxiliar para registrar y opcionalmente cambiar estado
        Reserva Registrar(DateOnly fecha, int horaIni, int horaFin, string motivo, Guid solicId, Guid ambId, EstadoReserva estadoFinal)
        {
            var res = Reserva.Crear(fecha, new TimeSpan(horaIni, 0, 0), new TimeSpan(horaFin, 0, 0), motivo, solicId, ambId);
            if (estadoFinal == EstadoReserva.Aprobada)
            {
                res.CambiarEstado(EstadoReserva.Aprobada, adminActor);
            }
            else if (estadoFinal == EstadoReserva.Rechazada)
            {
                res.CambiarEstado(EstadoReserva.Rechazada, adminActor);
            }
            else if (estadoFinal == EstadoReserva.Cancelada)
            {
                var solicActor = new ActorReserva(solicId, RolUsuario.Solicitante);
                res.CambiarEstado(EstadoReserva.Cancelada, solicActor);
            }
            return res;
        }

        // --- 10 RESERVAS APROBADAS ---
        listaReservas.Add(Registrar(hoy.AddDays(3), 8, 10, "Práctica calificada de Construcción de Software con estudiantes del IX ciclo.", solicMarco.Id_Usuario, amb1.Id_Ambiente, EstadoReserva.Aprobada));
        listaReservas.Add(Registrar(hoy.AddDays(4), 10, 12, "Sustentación de tesis: Sistema IoT para telemetría agrícola en el Valle del Mantaro.", solicLucia.Id_Usuario, amb14.Id_Ambiente, EstadoReserva.Aprobada));
        listaReservas.Add(Registrar(hoy.AddDays(5), 14, 17, "Conferencia magistral de Clean Architecture y microservicios para posgrado.", solicJorge.Id_Usuario, amb10.Id_Ambiente, EstadoReserva.Aprobada));
        listaReservas.Add(Registrar(hoy.AddDays(6), 9, 11, "Taller de pruebas de penetración y seguridad en redes empresariales.", solicAna.Id_Usuario, amb5.Id_Ambiente, EstadoReserva.Aprobada));
        listaReservas.Add(Registrar(hoy.AddDays(7), 11, 13, "Laboratorio de visión artificial y redes neuronales convolucionales con Python.", solicDiego.Id_Usuario, amb6.Id_Ambiente, EstadoReserva.Aprobada));
        listaReservas.Add(Registrar(hoy.AddDays(8), 15, 18, "Asamblea de planeamiento estratégico de la facultad de ingeniería de sistemas.", solicValeria.Id_Usuario, amb11.Id_Ambiente, EstadoReserva.Aprobada));
        listaReservas.Add(Registrar(hoy.AddDays(9), 8, 11, "Taller de robótica móvil con sensores ultrasónicos y control PID.", solicChristian.Id_Usuario, amb7.Id_Ambiente, EstadoReserva.Aprobada));
        listaReservas.Add(Registrar(hoy.AddDays(10), 10, 12, "Defensa de tesis de maestría en informática y gestión del conocimiento.", solicFiorella.Id_Usuario, amb15.Id_Ambiente, EstadoReserva.Aprobada));
        listaReservas.Add(Registrar(hoy.AddDays(11), 16, 18, "Capacitación docente en metodologías activas y evaluación por competencias.", solicRodrigo.Id_Usuario, amb16.Id_Ambiente, EstadoReserva.Aprobada));
        listaReservas.Add(Registrar(hoy.AddDays(12), 14, 16, "Exposición de proyectos de innovación tecnológica e incubadora de empresas.", solicGabriela.Id_Usuario, amb18.Id_Ambiente, EstadoReserva.Aprobada));

        // --- 10 RESERVAS PENDIENTES ---
        listaReservas.Add(Registrar(hoy.AddDays(13), 8, 10, "Taller de pruebas automatizadas y aseguramiento de calidad de software.", solicMarco.Id_Usuario, amb1.Id_Ambiente, EstadoReserva.Pendiente));
        listaReservas.Add(Registrar(hoy.AddDays(14), 10, 12, "Seminario de minería de datos y big data analytics para ingeniería.", solicLucia.Id_Usuario, amb2.Id_Ambiente, EstadoReserva.Pendiente));
        listaReservas.Add(Registrar(hoy.AddDays(15), 14, 16, "Clase de recuperación de estructuras de datos avanzadas y grafos.", solicJorge.Id_Usuario, amb3.Id_Ambiente, EstadoReserva.Pendiente));
        listaReservas.Add(Registrar(hoy.AddDays(16), 9, 12, "Hackathon universitaria de desarrollo de software para soluciones comunitarias.", solicAna.Id_Usuario, amb10.Id_Ambiente, EstadoReserva.Pendiente));
        listaReservas.Add(Registrar(hoy.AddDays(17), 11, 13, "Revisión curricular de asignaturas de ciencias básicas y cálculo aplicado.", solicDiego.Id_Usuario, amb13.Id_Ambiente, EstadoReserva.Pendiente));
        listaReservas.Add(Registrar(hoy.AddDays(18), 15, 17, "Práctica de física cuántica y simulación electromagnética asistida por computadora.", solicValeria.Id_Usuario, amb8.Id_Ambiente, EstadoReserva.Pendiente));
        listaReservas.Add(Registrar(hoy.AddDays(19), 8, 10, "Demostración de algoritmos genéticos y optimización bioinspirada.", solicChristian.Id_Usuario, amb6.Id_Ambiente, EstadoReserva.Pendiente));
        listaReservas.Add(Registrar(hoy.AddDays(20), 10, 13, "Evaluación semestral de proyectos de fin de carrera y pósteres científicos.", solicFiorella.Id_Usuario, amb12.Id_Ambiente, EstadoReserva.Pendiente));
        listaReservas.Add(Registrar(hoy.AddDays(21), 14, 16, "Mesa redonda sobre impacto de la inteligencia artificial en la ética profesional.", solicRodrigo.Id_Usuario, amb19.Id_Ambiente, EstadoReserva.Pendiente));
        listaReservas.Add(Registrar(hoy.AddDays(22), 16, 18, "Taller intensivo de diseño de bases de datos relacionales normalizadas.", solicRaul.Id_Usuario, amb2.Id_Ambiente, EstadoReserva.Pendiente));

        // --- 5 RESERVAS RECHAZADAS ---
        listaReservas.Add(Registrar(hoy.AddDays(5), 8, 10, "Coordinación de acreditación académica del comité curricular de ingeniería.", solicMarco.Id_Usuario, amb13.Id_Ambiente, EstadoReserva.Rechazada));
        listaReservas.Add(Registrar(hoy.AddDays(7), 14, 16, "Evento recreativo estudiantil con equipos de sonido de alto volumen.", solicRaul.Id_Usuario, amb10.Id_Ambiente, EstadoReserva.Rechazada));
        listaReservas.Add(Registrar(hoy.AddDays(8), 10, 12, "Uso de sala para ensayo musical sin autorización de la dirección académica.", solicGabriela.Id_Usuario, amb14.Id_Ambiente, EstadoReserva.Rechazada));
        listaReservas.Add(Registrar(hoy.AddDays(9), 16, 18, "Capacitación extracurricular externa sin convenio institucional vigente.", solicJorge.Id_Usuario, amb12.Id_Ambiente, EstadoReserva.Rechazada));
        listaReservas.Add(Registrar(hoy.AddDays(11), 9, 11, "Grabación audiovisual con dron en recinto cerrado sin protocolo de seguridad.", solicAna.Id_Usuario, amb19.Id_Ambiente, EstadoReserva.Rechazada));

        // --- 5 RESERVAS CANCELADAS ---
        listaReservas.Add(Registrar(hoy.AddDays(14), 11, 13, "Simulación de topologías de red empresarial para el curso de redes.", solicMarco.Id_Usuario, amb5.Id_Ambiente, EstadoReserva.Cancelada));
        listaReservas.Add(Registrar(hoy.AddDays(15), 15, 17, "Clase magistral cancelada por reprogramación de viaje del ponente internacional.", solicLucia.Id_Usuario, amb11.Id_Ambiente, EstadoReserva.Cancelada));
        listaReservas.Add(Registrar(hoy.AddDays(16), 14, 16, "Reunión de círculo de investigación pospuesta para la semana siguiente.", solicDiego.Id_Usuario, amb17.Id_Ambiente, EstadoReserva.Cancelada));
        listaReservas.Add(Registrar(hoy.AddDays(18), 8, 10, "Taller de robótica suspendido por retraso en entrega de componentes electrónicos.", solicChristian.Id_Usuario, amb7.Id_Ambiente, EstadoReserva.Cancelada));
        listaReservas.Add(Registrar(hoy.AddDays(20), 16, 18, "Sesión de tutoría grupal reprogramada a modalidad virtual por solicitud de alumnos.", solicFiorella.Id_Usuario, amb20.Id_Ambiente, EstadoReserva.Cancelada));

        await _context.Reservas.AddRangeAsync(listaReservas, ct);
        await _context.SaveChangesAsync(ct);
    }
}
