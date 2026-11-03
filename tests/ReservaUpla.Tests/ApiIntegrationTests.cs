using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Domain.Constants;
using Xunit;

namespace ReservaUpla.Tests;

public class ApiIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ApiIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task E01_RegistroSolicitante_DatosCorrectos_Retorna201()
    {
        var client = _factory.CreateClient();
        var dto = new RegistroUsuarioDto("Juan Perez", "juan.perez@upla.edu.pe", "ClaveValida123*");

        var response = await client.PostAsJsonAsync("/api/usuarios", dto);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var usuario = await response.Content.ReadFromJsonAsync<UsuarioDto>();
        Assert.NotNull(usuario);
        Assert.Equal("Juan Perez", usuario.NombreCompleto);
        Assert.Equal("juan.perez@upla.edu.pe", usuario.Correo);
    }

    [Fact]
    public async Task E02_RegistroSolicitante_CamposVacios_Retorna400()
    {
        var client = _factory.CreateClient();
        var dto = new RegistroUsuarioDto("", "", "");

        var response = await client.PostAsJsonAsync("/api/usuarios", dto);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task E08_Login_CredencialesErroneas_Retorna401()
    {
        var client = _factory.CreateClient();
        var dto = new LoginDto("usuario.inexistente@upla.edu.pe", "ClaveInvalida123*");

        var response = await client.PostAsJsonAsync("/api/auth/login", dto);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task E18_CrearAmbiente_SiendoSolicitante_Retorna403()
    {
        var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            HandleCookies = true
        });

        // 1. Registrar y loguear solicitante
        var regDto = new RegistroUsuarioDto("Maria Solicitante", "maria.solic@upla.edu.pe", "ClaveValida123*");
        await client.PostAsJsonAsync("/api/usuarios", regDto);

        var loginDto = new LoginDto("maria.solic@upla.edu.pe", "ClaveValida123*");
        var loginRes = await client.PostAsJsonAsync("/api/auth/login", loginDto);
        Assert.Equal(HttpStatusCode.OK, loginRes.StatusCode);

        // 2. Intentar crear ambiente siendo Solicitante (RN-05 / E-18)
        var ambDto = new CrearAmbienteDto("Ambiente No Autorizado", "Auditorio", 50, "Pabellon A", null);
        var response = await client.PostAsJsonAsync("/api/ambientes", ambDto);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task E17_ConflictoDisponibilidad_Retorna409()
    {
        var clientAdmin = _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        var clientSolic = _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });

        // Login Admin
        var adminLogin = await clientAdmin.PostAsJsonAsync("/api/auth/login", new LoginDto("admin@upla.edu.pe", "Admin123*"));
        Assert.Equal(HttpStatusCode.OK, adminLogin.StatusCode);

        // Crear ambiente
        var ambRes = await clientAdmin.PostAsJsonAsync("/api/ambientes", new CrearAmbienteDto("Lab Redes Conflicto", "LaboratorioComputo", 20, "Pabellon B", null));
        Assert.Equal(HttpStatusCode.Created, ambRes.StatusCode);
        var amb = await ambRes.Content.ReadFromJsonAsync<AmbienteDto>();
        Assert.NotNull(amb);

        // Registrar y loguear Solicitante
        var solicEmail = $"pedro.solic.{Guid.NewGuid():N}@upla.edu.pe";
        await clientSolic.PostAsJsonAsync("/api/usuarios", new RegistroUsuarioDto("Pedro Solic", solicEmail, "ClaveValida123*"));
        await clientSolic.PostAsJsonAsync("/api/auth/login", new LoginDto(solicEmail, "ClaveValida123*"));

        // Crear primera reserva 10:00 a 12:00 mañana
        var manana = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var res1Dto = new CrearReservaDto(amb.Id, manana, new TimeSpan(10, 0, 0), new TimeSpan(12, 0, 0), "Clase de Redes Avanzadas");
        var res1 = await clientSolic.PostAsJsonAsync("/api/reservas", res1Dto);
        Assert.Equal(HttpStatusCode.Created, res1.StatusCode);
        var reserva1 = await res1.Content.ReadFromJsonAsync<ReservaDto>();
        Assert.NotNull(reserva1);

        // Admin aprueba reserva1
        var patchRes = await clientAdmin.PatchAsJsonAsync($"/api/reservas/{reserva1.Id}/estado", new CambiarEstadoDto("Aprobada"));
        Assert.Equal(HttpStatusCode.OK, patchRes.StatusCode);

        // Intentar crear segunda reserva solapada (11:00 a 13:00) -> 409 Conflicto
        var res2Dto = new CrearReservaDto(amb.Id, manana, new TimeSpan(11, 0, 0), new TimeSpan(13, 0, 0), "Taller de Prácticas Redes");
        var res2 = await clientSolic.PostAsJsonAsync("/api/reservas", res2Dto);

        Assert.Equal(HttpStatusCode.Conflict, res2.StatusCode);
    }

    [Fact]
    public async Task E07_LoginAdmin_ConsultaDashboard_Retorna200()
    {
        var client = _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        var loginRes = await client.PostAsJsonAsync("/api/auth/login", new LoginDto("admin@upla.edu.pe", "Admin123*"));
        Assert.Equal(HttpStatusCode.OK, loginRes.StatusCode);

        var dashRes = await client.GetAsync("/api/dashboard");
        Assert.Equal(HttpStatusCode.OK, dashRes.StatusCode);
        var dash = await dashRes.Content.ReadFromJsonAsync<DashboardEstadisticasDto>();
        Assert.NotNull(dash);
    }
}
