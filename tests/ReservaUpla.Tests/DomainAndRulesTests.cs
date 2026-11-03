using System;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;
using Xunit;

namespace ReservaUpla.Tests;

public class DomainAndRulesTests
{
    [Theory]
    [InlineData("Ab")] // min - 1 (2)
    [InlineData("   ")] // vacio
    public void E05_Nombre_BajoElMinimo_LanzaDomainException(string nombreInvalido)
    {
        Assert.Throws<DomainException>(() =>
            Usuario.Crear(nombreInvalido, "test@upla.edu.pe", "HashValido123", RolUsuario.Solicitante));
    }

    [Fact]
    public void E05_Nombre_EnLimitesExactos_CreaCorrectamente()
    {
        var nombreMin = "Ana"; // min (3)
        var nombreMax = new string('A', 150); // max (150)

        var uMin = Usuario.Crear(nombreMin, "min@upla.edu.pe", "HashValido123", RolUsuario.Solicitante);
        var uMax = Usuario.Crear(nombreMax, "max@upla.edu.pe", "HashValido123", RolUsuario.Solicitante);

        Assert.Equal(3, uMin.Nom_Usuario.Length);
        Assert.Equal(150, uMax.Nom_Usuario.Length);
    }

    [Fact]
    public void E05_Nombre_SuperaMaximo_LanzaDomainException()
    {
        var nombreSobreMax = new string('A', 151);
        Assert.Throws<DomainException>(() =>
            Usuario.Crear(nombreSobreMax, "sobre@upla.edu.pe", "HashValido123", RolUsuario.Solicitante));
    }

    [Fact]
    public void E06_EspaciosYMayusculasEnCorreo_SeNormalizanCorrectamente()
    {
        var entrada = "  Estudiante.UPLA@Upla.Edu.Pe  ";
        var normalizado = ReglasUsuario.NormalizarCorreo(entrada);

        Assert.Equal("estudiante.upla@upla.edu.pe", normalizado);

        var usuario = Usuario.Crear("Carlos Ramos", entrada, "HashValido123", RolUsuario.Solicitante);
        Assert.Equal("estudiante.upla@upla.edu.pe", usuario.Cor_Usuario);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    [InlineData(1001)]
    public void E11_CapacidadInvalida_LanzaDomainException(int capacidad)
    {
        Assert.Throws<DomainException>(() =>
            Ambiente.Crear("Laboratorio Test", TipoAmbiente.LaboratorioComputo, capacidad, "Pabellon B"));
    }

    [Fact]
    public void E14_FinMenorOIgualAInicio_LanzaDomainException()
    {
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var inicio = new TimeSpan(10, 0, 0);
        var finMenor = new TimeSpan(9, 30, 0);
        var finIgual = new TimeSpan(10, 0, 0);

        Assert.Throws<DomainException>(() =>
            Reserva.Crear(hoy, inicio, finMenor, "Motivo con mas de 10 caracteres", Guid.NewGuid(), Guid.NewGuid(), hoy));

        Assert.Throws<DomainException>(() =>
            Reserva.Crear(hoy, inicio, finIgual, "Motivo con mas de 10 caracteres", Guid.NewGuid(), Guid.NewGuid(), hoy));
    }

    [Theory]
    [InlineData(6, 59, 10, 0)]  // Antes de 07:00
    [InlineData(20, 0, 22, 1)]  // Despues de 22:00
    public void E15_HorarioFueraDe07a22_LanzaDomainException(int h1, int m1, int h2, int m2)
    {
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var inicio = new TimeSpan(h1, m1, 0);
        var fin = new TimeSpan(h2, m2, 0);

        Assert.Throws<DomainException>(() =>
            Reserva.Crear(hoy, inicio, fin, "Clase teorica de software", Guid.NewGuid(), Guid.NewGuid(), hoy));
    }

    [Fact]
    public void E16_FechaPasada_LanzaDomainException()
    {
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow);
        var ayer = hoy.AddDays(-1);

        Assert.Throws<DomainException>(() =>
            Reserva.Crear(ayer, new TimeSpan(9, 0, 0), new TimeSpan(11, 0, 0), "Motivo de prueba fecha pasada", Guid.NewGuid(), Guid.NewGuid(), hoy));
    }

    [Fact]
    public void E20_ModificarReservaRechazada_LanzaDomainException()
    {
        var solicitanteId = Guid.NewGuid();
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var reserva = Reserva.Crear(hoy, new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Sustentacion de tesis", solicitanteId, Guid.NewGuid(), hoy);

        reserva.CambiarEstado(EstadoReserva.Rechazada, RolUsuario.Administrador, Guid.NewGuid());

        Assert.Throws<DomainException>(() =>
            reserva.CambiarEstado(EstadoReserva.Aprobada, RolUsuario.Administrador, Guid.NewGuid()));
    }

    [Fact]
    public void E21_TransicionInvalida_LanzaDomainException()
    {
        var solicitanteId = Guid.NewGuid();
        var hoy = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var reserva = Reserva.Crear(hoy, new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Sustentacion de grado", solicitanteId, Guid.NewGuid(), hoy);

        // Aprobada a Rechazada directamente es invalido
        reserva.CambiarEstado(EstadoReserva.Aprobada, RolUsuario.Administrador, Guid.NewGuid());

        Assert.Throws<DomainException>(() =>
            reserva.CambiarEstado(EstadoReserva.Rechazada, RolUsuario.Administrador, Guid.NewGuid()));
    }
}
