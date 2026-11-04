using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Services;
using ReservaUpla.Domain.Common;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;
using ReservaUpla.Infrastructure.Data;
using ReservaUpla.Infrastructure.Repositories;
using ReservaUpla.Infrastructure.Security;
using Xunit;

namespace ReservaUpla.Tests;

public class ServicesAndConcurrencyTests
{
    private static AppDbContext CrearContextoEnMemoria(string dbNombre)
    {
        var opciones = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(dbNombre)
            .Options;
        return new AppDbContext(opciones);
    }

    [Fact]
    public async Task E04_CorreoDuplicado_LanzaDomainExceptionConflicto()
    {
        var context = CrearContextoEnMemoria(nameof(E04_CorreoDuplicado_LanzaDomainExceptionConflicto));
        var userRepo = new UsuarioRepository(context);
        var uow = new UnitOfWork(context);
        var hasher = new PasswordHasherService();
        var service = new UsuarioService(userRepo, hasher, uow);

        var dto = new RegistroUsuarioDto("Primer Usuario", "duplicado@upla.edu.pe", "ClaveSegura123*");
        await service.RegistrarSolicitanteAsync(dto);

        var dtoDuplicado = new RegistroUsuarioDto("Segundo Usuario", "DUPLICADO@upla.edu.pe", "OtraClaveSegura123*");
        var ex = await Assert.ThrowsAsync<DomainException>(() => service.RegistrarSolicitanteAsync(dtoDuplicado));

        Assert.True(ex.EsConflicto);
        Assert.Equal(Mensajes.CorreoDuplicado, ex.Message);
    }

    [Fact]
    public async Task E08_LoginIncorrecto_InvocaVerifyDummyPassword()
    {
        var mockRepo = new Mock<IUsuarioRepository>();
        var mockHasher = new Mock<IPasswordHasherService>();

        mockRepo.Setup(r => r.ObtenerPorCorreoAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((Usuario?)null);

        var authService = new AuthService(mockRepo.Object, mockHasher.Object);

        var ex = await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            authService.LoginAsync(new LoginDto("inexistente@upla.edu.pe", "ClavePrueba123*")));

        Assert.Equal(Mensajes.CredencialesInvalidas, ex.Message);
        mockHasher.Verify(h => h.VerifyDummyPassword(), Times.Once);
    }

    [Fact]
    public void E17_HorariosConsecutivos_NoTienenConflicto()
    {
        var bloque1Inicio = new TimeSpan(8, 0, 0);
        var bloque1Fin = new TimeSpan(10, 0, 0);

        var bloque2Inicio = new TimeSpan(10, 0, 0); // Empieza exactamente cuando termina el 1
        var bloque2Fin = new TimeSpan(12, 0, 0);

        var conflicto = ReglasReserva.HayConflictoHorario(bloque1Inicio, bloque1Fin, bloque2Inicio, bloque2Fin);
        Assert.False(conflicto);
    }

    [Fact]
    public async Task E19_AprobarSiendoAdministrador_ActualizaEstadoAAprobada()
    {
        var context = CrearContextoEnMemoria(nameof(E19_AprobarSiendoAdministrador_ActualizaEstadoAAprobada));
        var userRepo = new UsuarioRepository(context);
        var ambRepo = new AmbienteRepository(context);
        var resRepo = new ReservaRepository(context);
        var uow = new UnitOfWork(context);
        var service = new ReservaService(resRepo, ambRepo, userRepo, uow);

        var admin = Usuario.Crear("Admin Test", "admin.test@upla.edu.pe", "Hash123", RolUsuario.Administrador);
        var solic = Usuario.Crear("Solic Test", "solic.test@upla.edu.pe", "Hash123", RolUsuario.Solicitante);
        var amb = Ambiente.Crear("Auditorio 1", TipoAmbiente.Auditorio, 100, "Pabellon A");
        await context.Usuarios.AddRangeAsync(admin, solic);
        await context.Ambientes.AddAsync(amb);
        await context.SaveChangesAsync();

        var manana = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var creada = await service.CrearReservaAsync(
            new CrearReservaDto(amb.Id_Ambiente, manana, new TimeSpan(9, 0, 0), new TimeSpan(11, 0, 0), "Conferencia Magistral"),
            solic.Id_Usuario);

        var resultado = await service.CambiarEstadoAsync(creada.Id, EstadoReserva.Aprobada, admin.Id_Usuario, RolUsuario.Administrador);

        Assert.Equal(EstadoReserva.Aprobada.ToString(), resultado.Estado);
    }

    [Fact]
    public async Task E30_Dashboard_ConCeroReservas_RetornaEstadisticasVaciasSinError()
    {
        var context = CrearContextoEnMemoria(nameof(E30_Dashboard_ConCeroReservas_RetornaEstadisticasVaciasSinError));
        var resRepo = new ReservaRepository(context);

        var stats = await resRepo.ObtenerEstadisticasDashboardAsync(null, null);

        Assert.Equal(0, stats.TotalReservas);
        Assert.Equal(0, stats.ReservasPendientes);
        Assert.Equal(0, stats.ReservasAprobadas);
        Assert.Equal("Sin registros", stats.AmbienteMasUtilizado);
    }

    [Fact]
    public async Task E31_AprobacionSimultaneaDosReservasSolapadas_SoloUnaGana()
    {
        var context = CrearContextoEnMemoria(nameof(E31_AprobacionSimultaneaDosReservasSolapadas_SoloUnaGana));
        var userRepo = new UsuarioRepository(context);
        var ambRepo = new AmbienteRepository(context);
        var resRepo = new ReservaRepository(context);
        var uow = new UnitOfWork(context);
        var service = new ReservaService(resRepo, ambRepo, userRepo, uow);

        var admin = Usuario.Crear("Admin G", "adming@upla.edu.pe", "Hash", RolUsuario.Administrador);
        var solic = Usuario.Crear("Solic G", "solicg@upla.edu.pe", "Hash", RolUsuario.Solicitante);
        var amb = Ambiente.Crear("Laboratorio Fis", TipoAmbiente.LaboratorioComputo, 30, "Pabellon F");
        await context.Usuarios.AddRangeAsync(admin, solic);
        await context.Ambientes.AddAsync(amb);
        await context.SaveChangesAsync();

        var fecha = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(2));
        var r1 = await service.CrearReservaAsync(new CrearReservaDto(amb.Id_Ambiente, fecha, new TimeSpan(10, 0, 0), new TimeSpan(12, 0, 0), "Reserva Primera"), solic.Id_Usuario);
        var r2 = await service.CrearReservaAsync(new CrearReservaDto(amb.Id_Ambiente, fecha, new TimeSpan(11, 0, 0), new TimeSpan(13, 0, 0), "Reserva Segunda"), solic.Id_Usuario);

        // Aprobar primera reserva
        var res1 = await service.CambiarEstadoAsync(r1.Id, EstadoReserva.Aprobada, admin.Id_Usuario, RolUsuario.Administrador);
        Assert.Equal(EstadoReserva.Aprobada.ToString(), res1.Estado);

        // Intentar aprobar segunda reserva solapada -> lanza DomainException con conflicto
        var ex = await Assert.ThrowsAsync<DomainException>(() =>
            service.CambiarEstadoAsync(r2.Id, EstadoReserva.Aprobada, admin.Id_Usuario, RolUsuario.Administrador));

        Assert.True(ex.EsConflicto);
        Assert.Equal(Mensajes.ConflictoDisponibilidad, ex.Message);
    }

    [Fact]
    public async Task E32_ResponsableSoloVeSuAmbiente()
    {
        var context = CrearContextoEnMemoria(nameof(E32_ResponsableSoloVeSuAmbiente));
        var ambRepo = new AmbienteRepository(context);

        var idResponsable1 = Guid.NewGuid();
        var idResponsable2 = Guid.NewGuid();

        var amb1 = Ambiente.Crear("Lab R1", TipoAmbiente.LaboratorioComputo, 20, "Pabellon 1", idResponsable1);
        var amb2 = Ambiente.Crear("Lab R2", TipoAmbiente.LaboratorioComputo, 25, "Pabellon 2", idResponsable2);
        await context.Ambientes.AddRangeAsync(amb1, amb2);
        await context.SaveChangesAsync();

        var lista = await ambRepo.ListarAsync(idResponsable1);

        Assert.Single(lista);
        Assert.Equal(amb1.Id_Ambiente, lista[0].Id_Ambiente);
    }

    [Fact]
    public async Task ParametrosConsultaReservas_Y_IntervaloHorario_FuncionanCorrectamente()
    {
        var context = CrearContextoEnMemoria(nameof(ParametrosConsultaReservas_Y_IntervaloHorario_FuncionanCorrectamente));
        var repo = new ReservaRepository(context);

        var ambId = Guid.NewGuid();
        var solId = Guid.NewGuid();
        var fecha = new DateOnly(2026, 11, 20);

        var reserva1 = Reserva.Crear(fecha, new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Clase Magistral A", solId, ambId);
        reserva1.CambiarEstado(EstadoReserva.Aprobada, new ActorReserva(Guid.NewGuid(), RolUsuario.Administrador));
        await repo.AgregarAsync(reserva1);
        await context.SaveChangesAsync();

        // Verificar conflicto usando IntervaloHorario
        var hayConflicto = await repo.HayConflictoAsync(new IntervaloHorario(ambId, fecha, new TimeSpan(9, 0, 0), new TimeSpan(11, 0, 0)));
        Assert.True(hayConflicto);

        var sinConflicto = await repo.HayConflictoAsync(new IntervaloHorario(ambId, fecha, new TimeSpan(10, 0, 0), new TimeSpan(12, 0, 0)));
        Assert.False(sinConflicto);

        // Verificar consulta usando ParametrosConsultaReservas
        var paramsConsulta = new ParametrosConsultaReservas(Estado: EstadoReserva.Aprobada, AmbienteId: ambId, Fecha: fecha);
        var total = await repo.ContarAsync(paramsConsulta);
        var lista = await repo.ListarAsync(paramsConsulta);

        Assert.Equal(1, total);
        Assert.Single(lista);
        Assert.Equal(reserva1.Id_Reserva, lista[0].Id_Reserva);
    }
}
