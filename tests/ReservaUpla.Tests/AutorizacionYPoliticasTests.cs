using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Domain.Common;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;
using ReservaUpla.Domain.Security;
using Xunit;

namespace ReservaUpla.Tests;

public class AutorizacionYPoliticasTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public AutorizacionYPoliticasTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    // 1. Matriz exhaustiva: 36 combinaciones (3 roles x 12 permisos)
    [Theory]
    // Administrador (10 permitidos, 2 denegados)
    [InlineData(RolUsuario.Administrador, Permisos.DashboardVer, true)]
    [InlineData(RolUsuario.Administrador, Permisos.ReservasVer, true)]
    [InlineData(RolUsuario.Administrador, Permisos.ReservasCrear, false)]
    [InlineData(RolUsuario.Administrador, Permisos.ReservasAprobar, true)]
    [InlineData(RolUsuario.Administrador, Permisos.ReservasRechazar, true)]
    [InlineData(RolUsuario.Administrador, Permisos.ReservasCancelarPropias, false)]
    [InlineData(RolUsuario.Administrador, Permisos.ReservasCancelarCualquiera, true)]
    [InlineData(RolUsuario.Administrador, Permisos.AmbientesVer, true)]
    [InlineData(RolUsuario.Administrador, Permisos.AmbientesCrear, true)]
    [InlineData(RolUsuario.Administrador, Permisos.AmbientesEditar, true)]
    [InlineData(RolUsuario.Administrador, Permisos.AmbientesCambiarEstado, true)]
    [InlineData(RolUsuario.Administrador, Permisos.UsuariosListarResponsables, true)]
    // Responsable (3 permitidos, 9 denegados)
    [InlineData(RolUsuario.Responsable, Permisos.DashboardVer, true)]
    [InlineData(RolUsuario.Responsable, Permisos.ReservasVer, true)]
    [InlineData(RolUsuario.Responsable, Permisos.ReservasCrear, false)]
    [InlineData(RolUsuario.Responsable, Permisos.ReservasAprobar, false)]
    [InlineData(RolUsuario.Responsable, Permisos.ReservasRechazar, false)]
    [InlineData(RolUsuario.Responsable, Permisos.ReservasCancelarPropias, false)]
    [InlineData(RolUsuario.Responsable, Permisos.ReservasCancelarCualquiera, false)]
    [InlineData(RolUsuario.Responsable, Permisos.AmbientesVer, true)]
    [InlineData(RolUsuario.Responsable, Permisos.AmbientesCrear, false)]
    [InlineData(RolUsuario.Responsable, Permisos.AmbientesEditar, false)]
    [InlineData(RolUsuario.Responsable, Permisos.AmbientesCambiarEstado, false)]
    [InlineData(RolUsuario.Responsable, Permisos.UsuariosListarResponsables, false)]
    // Solicitante (5 permitidos, 7 denegados)
    [InlineData(RolUsuario.Solicitante, Permisos.DashboardVer, true)]
    [InlineData(RolUsuario.Solicitante, Permisos.ReservasVer, true)]
    [InlineData(RolUsuario.Solicitante, Permisos.ReservasCrear, true)]
    [InlineData(RolUsuario.Solicitante, Permisos.ReservasAprobar, false)]
    [InlineData(RolUsuario.Solicitante, Permisos.ReservasRechazar, false)]
    [InlineData(RolUsuario.Solicitante, Permisos.ReservasCancelarPropias, true)]
    [InlineData(RolUsuario.Solicitante, Permisos.ReservasCancelarCualquiera, false)]
    [InlineData(RolUsuario.Solicitante, Permisos.AmbientesVer, true)]
    [InlineData(RolUsuario.Solicitante, Permisos.AmbientesCrear, false)]
    [InlineData(RolUsuario.Solicitante, Permisos.AmbientesEditar, false)]
    [InlineData(RolUsuario.Solicitante, Permisos.AmbientesCambiarEstado, false)]
    [InlineData(RolUsuario.Solicitante, Permisos.UsuariosListarResponsables, false)]
    public void MatrizPermisos_Verifica36Combinaciones(RolUsuario rol, string permiso, bool esperado)
    {
        var resultado = PoliticaDeAcceso.Tiene(rol, permiso);
        Assert.Equal(esperado, resultado);
    }

    // 2. Transición inválida sobre reserva rechazada o cancelada lanza 409
    [Fact]
    public void ReservaRechazadaOCancelada_Modificar_LanzaConflicto409()
    {
        var reserva = Reserva.Crear(
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
            new TimeSpan(8, 0, 0),
            new TimeSpan(10, 0, 0),
            "Reserva para pruebas",
            Guid.NewGuid(),
            Guid.NewGuid()
        );

        var adminActor = new ActorReserva(Guid.NewGuid(), RolUsuario.Administrador);
        reserva.CambiarEstado(EstadoReserva.Rechazada, adminActor);

        var ex = Assert.Throws<DomainException>(() =>
            reserva.CambiarEstado(EstadoReserva.Aprobada, adminActor));

        Assert.True(ex.EsConflicto);
        Assert.Equal(Mensajes.ReservaRechazadaInmodificable, ex.Message);
    }

    // 3. Cancelación: solicitante no puede cancelar reservas ajenas
    [Fact]
    public void Solicitante_CancelarReservaAjena_LanzaDomainException()
    {
        var solicitanteOriginal = Guid.NewGuid();
        var otroSolicitante = Guid.NewGuid();

        var reserva = Reserva.Crear(
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
            new TimeSpan(8, 0, 0),
            new TimeSpan(10, 0, 0),
            "Reserva propia de solicitante 1",
            solicitanteOriginal,
            Guid.NewGuid()
        );

        var actorAjeno = new ActorReserva(otroSolicitante, RolUsuario.Solicitante);
        var ex = Assert.Throws<DomainException>(() =>
            reserva.CambiarEstado(EstadoReserva.Cancelada, actorAjeno));

        Assert.Equal(Mensajes.SolicitanteSoloCancelaPropias, ex.Message);
    }

    // 4. Cancelación: solicitante sí puede cancelar su propia reserva
    [Fact]
    public void Solicitante_CancelarReservaPropia_CambiaACancelada()
    {
        var solicitanteId = Guid.NewGuid();
        var reserva = Reserva.Crear(
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
            new TimeSpan(8, 0, 0),
            new TimeSpan(10, 0, 0),
            "Reserva propia de solicitante",
            solicitanteId,
            Guid.NewGuid()
        );

        var actorPropio = new ActorReserva(solicitanteId, RolUsuario.Solicitante);
        reserva.CambiarEstado(EstadoReserva.Cancelada, actorPropio);

        Assert.Equal(EstadoReserva.Cancelada, reserva.Est_Reserva);
    }

    // 5. Admin no tiene permiso para crear reservas (403 genérico)
    [Fact]
    public async Task Admin_CrearReserva_Retorna403Generico()
    {
        var client = _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        var login = await client.PostAsJsonAsync("/api/auth/login", new LoginDto("admin@upla.edu.pe", "Admin123*"));
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);

        var dto = new CrearReservaDto(Guid.NewGuid(), DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)), new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), "Motivo prueba");
        var res = await client.PostAsJsonAsync("/api/reservas", dto);

        Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
        var contenido = await res.Content.ReadAsStringAsync();
        Assert.Contains(Mensajes.AccesoDenegado, contenido);
        Assert.DoesNotContain("reservas.crear", contenido); // No expone código interno
    }

    // 6. Solicitante intentando listar responsables (403)
    [Fact]
    public async Task Solicitante_ListarResponsables_Retorna403()
    {
        var client = _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        var email = $"solic.resp.{Guid.NewGuid():N}@upla.edu.pe";
        await client.PostAsJsonAsync("/api/usuarios", new RegistroUsuarioDto("Solic Resp", email, "ClaveValida123*"));
        await client.PostAsJsonAsync("/api/auth/login", new LoginDto(email, "ClaveValida123*"));

        var res = await client.GetAsync("/api/usuarios/responsables");
        Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
    }

    // 7. Solicitante intentando ver reserva ajena retorna 404 (no 403) para no revelar existencia
    [Fact]
    public async Task Solicitante_ObtenerReservaAjena_Retorna404()
    {
        var clientAdmin = _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        await clientAdmin.PostAsJsonAsync("/api/auth/login", new LoginDto("admin@upla.edu.pe", "Admin123*"));

        var ambRes = await clientAdmin.PostAsJsonAsync("/api/ambientes", new CrearAmbienteDto($"Ambiente {Guid.NewGuid():N}", "Auditorio", 40, "Pabellon Z", null));
        var amb = await ambRes.Content.ReadFromJsonAsync<AmbienteDto>();
        Assert.NotNull(amb);

        // Solicitante A crea reserva
        var clientA = _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        var emailA = $"solic.a.{Guid.NewGuid():N}@upla.edu.pe";
        await clientA.PostAsJsonAsync("/api/usuarios", new RegistroUsuarioDto("Solic A", emailA, "ClaveValida123*"));
        await clientA.PostAsJsonAsync("/api/auth/login", new LoginDto(emailA, "ClaveValida123*"));

        var manana = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(2));
        var resDto = new CrearReservaDto(amb.Id, manana, new TimeSpan(9, 0, 0), new TimeSpan(11, 0, 0), "Reserva de usuario A");
        var crearRes = await clientA.PostAsJsonAsync("/api/reservas", resDto);
        Assert.Equal(HttpStatusCode.Created, crearRes.StatusCode);
        var reservaCreada = await crearRes.Content.ReadFromJsonAsync<ReservaDto>();
        Assert.NotNull(reservaCreada);

        // Solicitante B intenta ver reserva de Solicitante A
        var clientB = _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        var emailB = $"solic.b.{Guid.NewGuid():N}@upla.edu.pe";
        await clientB.PostAsJsonAsync("/api/usuarios", new RegistroUsuarioDto("Solic B", emailB, "ClaveValida123*"));
        await clientB.PostAsJsonAsync("/api/auth/login", new LoginDto(emailB, "ClaveValida123*"));

        var verRes = await clientB.GetAsync($"/api/reservas/{reservaCreada.Id}");
        Assert.Equal(HttpStatusCode.NotFound, verRes.StatusCode);
    }
}
