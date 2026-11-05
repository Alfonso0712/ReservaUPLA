using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Infrastructure.Data;
using ReservaUpla.Infrastructure.Repositories;
using Xunit;

namespace ReservaUpla.Tests;

public class ReservaRepositoryTests
{
    private static AppDbContext CrearContextoEnMemoria(string dbNombre)
    {
        var opciones = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(dbNombre)
            .Options;
        return new AppDbContext(opciones);
    }

    [Fact]
    public async Task ObtenerEstadisticasDashboardAsync_SinDatos_RetornaSinRegistrosYCero()
    {
        var context = CrearContextoEnMemoria(nameof(ObtenerEstadisticasDashboardAsync_SinDatos_RetornaSinRegistrosYCero));
        var repo = new ReservaRepository(context);

        var stats = await repo.ObtenerEstadisticasDashboardAsync(null, null);

        Assert.Equal(0, stats.TotalReservas);
        Assert.Equal(0, stats.ReservasPendientes);
        Assert.Equal(0, stats.ReservasAprobadas);
        Assert.Equal(0, stats.ReservasRechazadas);
        Assert.Equal(0, stats.ReservasCanceladas);
        Assert.Equal("Sin registros", stats.AmbienteMasUtilizado);
        Assert.Equal(0, stats.CantidadUsoAmbienteMasUtilizado);
    }

    [Fact]
    public async Task ObtenerEstadisticasDashboardAsync_ConEmpate_DesempataAlfabeticamentePorNombreAmbiente()
    {
        var context = CrearContextoEnMemoria(nameof(ObtenerEstadisticasDashboardAsync_ConEmpate_DesempataAlfabeticamentePorNombreAmbiente));

        var ambZ = Ambiente.Crear("Z - Sala de Videoconferencias", TipoAmbiente.SalaReuniones, 20, "Pabellón Z");
        var ambA = Ambiente.Crear("A - Auditorio Central", TipoAmbiente.Auditorio, 100, "Pabellón A");
        var ambM = Ambiente.Crear("M - Laboratorio de Cómputo", TipoAmbiente.LaboratorioComputo, 30, "Pabellón M");

        await context.Ambientes.AddRangeAsync(ambZ, ambA, ambM);

        var usuarioId = Guid.NewGuid();
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        // 2 reservas para Z, 2 reservas para A (empate en el máximo de 2 usos), 1 para M
        var r1 = Reserva.Crear(hoy, new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Motivo de reserva Z 1", usuarioId, ambZ.Id_Ambiente);
        var r2 = Reserva.Crear(hoy.AddDays(1), new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Motivo de reserva Z 2", usuarioId, ambZ.Id_Ambiente);

        var r3 = Reserva.Crear(hoy, new TimeSpan(10, 0, 0), new TimeSpan(12, 0, 0), "Motivo de reserva A 1", usuarioId, ambA.Id_Ambiente);
        var r4 = Reserva.Crear(hoy.AddDays(1), new TimeSpan(10, 0, 0), new TimeSpan(12, 0, 0), "Motivo de reserva A 2", usuarioId, ambA.Id_Ambiente);

        var r5 = Reserva.Crear(hoy, new TimeSpan(14, 0, 0), new TimeSpan(16, 0, 0), "Motivo de reserva M 1", usuarioId, ambM.Id_Ambiente);

        await context.Reservas.AddRangeAsync(r1, r2, r3, r4, r5);
        await context.SaveChangesAsync();

        var repo = new ReservaRepository(context);
        var stats = await repo.ObtenerEstadisticasDashboardAsync(null, null);

        Assert.Equal(5, stats.TotalReservas);
        Assert.Equal(2, stats.CantidadUsoAmbienteMasUtilizado);
        // Debe desempatar determinísticamente eligiendo 'A - Auditorio Central' antes que 'Z - Sala de Videoconferencias'
        Assert.Equal("A - Auditorio Central", stats.AmbienteMasUtilizado);
    }

    [Fact]
    public async Task ObtenerEstadisticasDashboardAsync_SinEmpate_RetornaAmbienteConMayorCantidad()
    {
        var context = CrearContextoEnMemoria(nameof(ObtenerEstadisticasDashboardAsync_SinEmpate_RetornaAmbienteConMayorCantidad));

        var amb1 = Ambiente.Crear("Laboratorio 101", TipoAmbiente.LaboratorioComputo, 30, "Pabellón B");
        var amb2 = Ambiente.Crear("Auditorio Magna", TipoAmbiente.Auditorio, 200, "Pabellón A");

        await context.Ambientes.AddRangeAsync(amb1, amb2);

        var usuarioId = Guid.NewGuid();
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var r1 = Reserva.Crear(hoy, new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Motivo de reserva 1", usuarioId, amb1.Id_Ambiente);
        var r2 = Reserva.Crear(hoy.AddDays(1), new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Motivo de reserva 2", usuarioId, amb1.Id_Ambiente);
        var r3 = Reserva.Crear(hoy, new TimeSpan(10, 0, 0), new TimeSpan(12, 0, 0), "Motivo de reserva 3", usuarioId, amb2.Id_Ambiente);

        await context.Reservas.AddRangeAsync(r1, r2, r3);
        await context.SaveChangesAsync();

        var repo = new ReservaRepository(context);
        var stats = await repo.ObtenerEstadisticasDashboardAsync(null, null);

        Assert.Equal(3, stats.TotalReservas);
        Assert.Equal(2, stats.CantidadUsoAmbienteMasUtilizado);
        Assert.Equal("Laboratorio 101", stats.AmbienteMasUtilizado);
    }
}
