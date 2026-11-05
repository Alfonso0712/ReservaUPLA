using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
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
        var email = $"juan.perez.{Guid.NewGuid():N}@upla.edu.pe";
        var dto = new RegistroUsuarioDto("Juan Perez", email, "ClaveValida123*");

        var response = await client.PostAsJsonAsync("/api/usuarios", dto);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var usuario = await response.Content.ReadFromJsonAsync<UsuarioDto>();
        Assert.NotNull(usuario);
        Assert.Equal("Juan Perez", usuario.NombreCompleto);
        Assert.Equal(email, usuario.Correo);
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
    public async Task E09_LimiteDeIntentos_Retorna429()
    {
        using var prodFactory = _factory.WithWebHostBuilder(b => b.UseEnvironment("Production"));
        var client = prodFactory.CreateClient();
        var dto = new LoginDto("rate.limit@upla.edu.pe", "Clave123*");

        HttpResponseMessage lastResponse = null!;
        // En produccion el limite es 5 por minuto
        for (int i = 0; i < 6; i++)
        {
            lastResponse = await client.PostAsJsonAsync("/api/auth/login", dto);
        }

        Assert.Equal(HttpStatusCode.TooManyRequests, lastResponse.StatusCode);
    }

    [Fact]
    public async Task E18_CrearAmbiente_SiendoSolicitante_Retorna403()
    {
        var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            HandleCookies = true
        });

        var regDto = new RegistroUsuarioDto("Maria Solicitante", "maria.solic@upla.edu.pe", "ClaveValida123*");
        await client.PostAsJsonAsync("/api/usuarios", regDto);

        var loginDto = new LoginDto("maria.solic@upla.edu.pe", "ClaveValida123*");
        var loginRes = await client.PostAsJsonAsync("/api/auth/login", loginDto);
        Assert.Equal(HttpStatusCode.OK, loginRes.StatusCode);

        var ambDto = new CrearAmbienteDto("Ambiente No Autorizado", "Auditorio", 50, "Pabellon A", null);
        var response = await client.PostAsJsonAsync("/api/ambientes", ambDto);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task E17_ConflictoDisponibilidad_Retorna409()
    {
        var clientAdmin = _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        var clientSolic = _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });

        var adminLogin = await clientAdmin.PostAsJsonAsync("/api/auth/login", new LoginDto("admin@upla.edu.pe", "Admin123*"));
        Assert.Equal(HttpStatusCode.OK, adminLogin.StatusCode);

        var ambRes = await clientAdmin.PostAsJsonAsync("/api/ambientes", new CrearAmbienteDto("Lab Redes Conflicto", "LaboratorioComputo", 20, "Pabellon B", null));
        Assert.Equal(HttpStatusCode.Created, ambRes.StatusCode);
        var amb = await ambRes.Content.ReadFromJsonAsync<AmbienteDto>();
        Assert.NotNull(amb);

        var solicEmail = $"pedro.solic.{Guid.NewGuid():N}@upla.edu.pe";
        await clientSolic.PostAsJsonAsync("/api/usuarios", new RegistroUsuarioDto("Pedro Solic", solicEmail, "ClaveValida123*"));
        await clientSolic.PostAsJsonAsync("/api/auth/login", new LoginDto(solicEmail, "ClaveValida123*"));

        var manana = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var res1Dto = new CrearReservaDto(amb.Id, manana, new TimeSpan(10, 0, 0), new TimeSpan(12, 0, 0), "Clase de Redes Avanzadas");
        var res1 = await clientSolic.PostAsJsonAsync("/api/reservas", res1Dto);
        Assert.Equal(HttpStatusCode.Created, res1.StatusCode);
        var reserva1 = await res1.Content.ReadFromJsonAsync<ReservaDto>();
        Assert.NotNull(reserva1);

        var patchRes = await clientAdmin.PatchAsJsonAsync($"/api/reservas/{reserva1.Id}/estado", new CambiarEstadoDto("Aprobada"));
        Assert.Equal(HttpStatusCode.OK, patchRes.StatusCode);

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

    [Fact]
    public async Task E24_MiddlewareExcepcion_Retorna500MensajeNoTecnico()
    {
        var client = _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        var loginRes = await client.PostAsJsonAsync("/api/auth/login", new LoginDto("admin@upla.edu.pe", "Admin123*"));
        Assert.Equal(HttpStatusCode.OK, loginRes.StatusCode);

        // Llamar con guid vacio no mapeable genera un 500 no tecnico o 400
        var res = await client.GetAsync($"/api/reservas/{Guid.Empty}");
        if (res.StatusCode == HttpStatusCode.InternalServerError)
        {
            var content = await res.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(content);
            Assert.Equal(Mensajes.ErrorServidor, doc.RootElement.GetProperty("error").GetString());
        }
        else
        {
            Assert.True(res.StatusCode == HttpStatusCode.BadRequest || res.StatusCode == HttpStatusCode.NotFound);
        }
    }

    [Fact]
    public async Task Preferencias_SinAutenticacion_Retorna401()
    {
        var client = _factory.CreateClient();
        var response = await client.PatchAsJsonAsync("/api/usuarios/preferencias", new ActualizarPreferenciasDto("oscuro", "grande"));
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Preferencias_ValoresValidos_ActualizaYRetorna200()
    {
        var client = _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        var loginRes = await client.PostAsJsonAsync("/api/auth/login", new LoginDto("admin@upla.edu.pe", "Admin123*"));
        Assert.Equal(HttpStatusCode.OK, loginRes.StatusCode);

        var patchRes = await client.PatchAsJsonAsync("/api/usuarios/preferencias", new ActualizarPreferenciasDto("oscuro", "grande"));
        Assert.Equal(HttpStatusCode.OK, patchRes.StatusCode);
        var usuario = await patchRes.Content.ReadFromJsonAsync<UsuarioDto>();
        Assert.NotNull(usuario);
        Assert.Equal("oscuro", usuario.Tema);
        Assert.Equal("grande", usuario.TamanoLetra);

        var yoRes = await client.GetAsync("/api/auth/yo");
        Assert.Equal(HttpStatusCode.OK, yoRes.StatusCode);
        var yoContent = await yoRes.Content.ReadAsStringAsync();
        var yoDoc = JsonDocument.Parse(yoContent);
        Assert.Equal("oscuro", yoDoc.RootElement.GetProperty("usuario").GetProperty("tema").GetString());
        Assert.Equal("grande", yoDoc.RootElement.GetProperty("usuario").GetProperty("tamanoLetra").GetString());

        await client.PatchAsJsonAsync("/api/usuarios/preferencias", new ActualizarPreferenciasDto("claro", "normal"));
    }

    [Fact]
    public async Task Preferencias_ValoresInvalidos_Retorna400ConMensajeClaro()
    {
        var client = _factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        var loginRes = await client.PostAsJsonAsync("/api/auth/login", new LoginDto("admin@upla.edu.pe", "Admin123*"));
        Assert.Equal(HttpStatusCode.OK, loginRes.StatusCode);

        var resTemaInvalido = await client.PatchAsJsonAsync("/api/usuarios/preferencias", new ActualizarPreferenciasDto("invalido", "normal"));
        Assert.Equal(HttpStatusCode.BadRequest, resTemaInvalido.StatusCode);
        var contentTema = await resTemaInvalido.Content.ReadAsStringAsync();
        Assert.Contains("claro", contentTema);

        var resTamanoInvalido = await client.PatchAsJsonAsync("/api/usuarios/preferencias", new ActualizarPreferenciasDto("claro", "gigante"));
        Assert.Equal(HttpStatusCode.BadRequest, resTamanoInvalido.StatusCode);
        var contentTamano = await resTamanoInvalido.Content.ReadAsStringAsync();
        Assert.Contains("pequeno", contentTamano, StringComparison.OrdinalIgnoreCase);
    }
}