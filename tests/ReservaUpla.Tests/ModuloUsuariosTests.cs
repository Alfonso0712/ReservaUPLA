using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Services;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;
using ReservaUpla.Domain.Security;
using ReservaUpla.Infrastructure.Data;
using ReservaUpla.Infrastructure.Repositories;
using Xunit;

namespace ReservaUpla.Tests;

public class ModuloUsuariosTests
{
    private static AppDbContext CrearContextoEnMemoria(string dbNombre)
    {
        var opciones = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(dbNombre)
            .Options;
        return new AppDbContext(opciones);
    }

    [Fact]
    public void PoliticaDeAcceso_PermisosUsuarios_SoloConcedidosAAdministrador()
    {
        var permisosUsuarios = new[]
        {
            Permisos.UsuariosListar,
            Permisos.UsuariosCrear,
            Permisos.UsuariosEditar,
            Permisos.UsuariosCambiarEstado
        };

        foreach (var permiso in permisosUsuarios)
        {
            Assert.True(PoliticaDeAcceso.Tiene(RolUsuario.Administrador, permiso), $"Admin debe tener {permiso}");
            Assert.False(PoliticaDeAcceso.Tiene(RolUsuario.Responsable, permiso), $"Responsable NO debe tener {permiso}");
            Assert.False(PoliticaDeAcceso.Tiene(RolUsuario.Solicitante, permiso), $"Solicitante NO debe tener {permiso}");
        }
    }

    [Fact]
    public void Usuario_CrearPorAdmin_RolAdministrador_LanzaDomainException()
    {
        var ex = Assert.Throws<DomainException>(() =>
            Usuario.CrearPorAdmin("Admin Falso", "admin.falso@upla.edu.pe", "HashValido123", RolUsuario.Administrador)
        );

        Assert.Equal(Mensajes.RolNoAsignable, ex.Message);
    }

    [Fact]
    public void Usuario_CrearPorAdmin_RolResponsableOSolicitante_CreaUsuarioCorrectamente()
    {
        var resp = Usuario.CrearPorAdmin("Carlos Responsable", "carlos.resp@upla.edu.pe", "HashValido123", RolUsuario.Responsable);
        Assert.Equal(RolUsuario.Responsable, resp.Rol_Usuario);
        Assert.True(resp.Act_Usuario);

        var solic = Usuario.CrearPorAdmin("Ana Solicitante", "ana.solic@upla.edu.pe", "HashValido123", RolUsuario.Solicitante);
        Assert.Equal(RolUsuario.Solicitante, solic.Rol_Usuario);
        Assert.True(solic.Act_Usuario);
    }

    [Fact]
    public void Usuario_ActualizarDatos_CuentaAdministrador_LanzaDomainException()
    {
        var admin = Usuario.Crear("Admin Real", "admin@upla.edu.pe", "HashValido123", RolUsuario.Administrador);

        var ex = Assert.Throws<DomainException>(() =>
            admin.ActualizarDatos("Nuevo Nombre", RolUsuario.Responsable)
        );

        Assert.Equal(Mensajes.UsuarioAdminNoModificable, ex.Message);
    }

    [Fact]
    public void Usuario_ActualizarDatos_AsignarRolAdministrador_LanzaDomainException()
    {
        var solic = Usuario.Crear("Juan Perez", "juan.perez@upla.edu.pe", "HashValido123", RolUsuario.Solicitante);

        var ex = Assert.Throws<DomainException>(() =>
            solic.ActualizarDatos("Juan Modificado", RolUsuario.Administrador)
        );

        Assert.Equal(Mensajes.RolNoAsignable, ex.Message);
    }

    [Fact]
    public void Usuario_ActualizarDatos_ResponsableConAmbientesASolicitante_LanzaDomainException()
    {
        var resp = Usuario.Crear("Elena Huaman", "elena@upla.edu.pe", "HashValido123", RolUsuario.Responsable);

        var ex = Assert.Throws<DomainException>(() =>
            resp.ActualizarDatos("Elena Huaman", RolUsuario.Solicitante, tieneAmbientesAsignados: true)
        );

        Assert.Equal(Mensajes.ResponsableConAmbientesNoPuedeCambiarRol, ex.Message);
    }

    [Fact]
    public void Usuario_ActualizarDatos_ResponsableSinAmbientesASolicitante_Permitido()
    {
        var resp = Usuario.Crear("Elena Huaman", "elena@upla.edu.pe", "HashValido123", RolUsuario.Responsable);

        resp.ActualizarDatos("Elena Modificada", RolUsuario.Solicitante, tieneAmbientesAsignados: false);

        Assert.Equal("Elena Modificada", resp.Nom_Usuario);
        Assert.Equal(RolUsuario.Solicitante, resp.Rol_Usuario);
    }

    [Fact]
    public void Usuario_Desactivar_AdministradorASiMismo_LanzaDomainException()
    {
        var admin = Usuario.Crear("Carlos Admin", "admin@upla.edu.pe", "HashValido123", RolUsuario.Administrador);

        var ex = Assert.Throws<DomainException>(() =>
            admin.Desactivar(admin.Id_Usuario)
        );

        Assert.Equal(Mensajes.UsuarioAdminNoModificable, ex.Message);
    }

    [Fact]
    public void Usuario_Desactivar_UsuarioNoAdminPorSiMismo_LanzaDomainException()
    {
        var solic = Usuario.Crear("Marco Solicitante", "marco@upla.edu.pe", "HashValido123", RolUsuario.Solicitante);

        var ex = Assert.Throws<DomainException>(() =>
            solic.Desactivar(solic.Id_Usuario)
        );

        Assert.Equal(Mensajes.UsuarioNoPuedeDesactivarseASiMismo, ex.Message);
    }

    [Fact]
    public void Usuario_DesactivarYReactivar_PorOtroOperador_ActualizaEstado()
    {
        var operadorId = Guid.NewGuid();
        var solic = Usuario.Crear("Marco Solicitante", "marco@upla.edu.pe", "HashValido123", RolUsuario.Solicitante);
        Assert.True(solic.Act_Usuario);

        solic.Desactivar(operadorId);
        Assert.False(solic.Act_Usuario);

        solic.Activar();
        Assert.True(solic.Act_Usuario);
    }

    [Fact]
    public async Task UsuarioService_RegistrarPorAdmin_CorreoDuplicado_LanzaConflictDomainException()
    {
        var repoMock = new Mock<IUsuarioRepository>();
        repoMock.Setup(r => r.ExisteCorreoAsync("duplicado@upla.edu.pe", It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var hasherMock = new Mock<IPasswordHasherService>();
        var uowMock = new Mock<IUnitOfWork>();

        var service = new UsuarioService(repoMock.Object, hasherMock.Object, uowMock.Object);

        var dto = new CrearUsuarioAdminDto("Usuario Test", "duplicado@upla.edu.pe", RolUsuario.Responsable, "ClaveValida123*");

        var ex = await Assert.ThrowsAsync<DomainException>(() =>
            service.RegistrarPorAdminAsync(dto)
        );

        Assert.True(ex.EsConflicto);
        Assert.Equal(Mensajes.CorreoDuplicado, ex.Message);
    }

    [Fact]
    public async Task UsuarioRepository_ListarAsync_FiltraPorNombreRolYEstadoCorrectamente()
    {
        var context = CrearContextoEnMemoria(nameof(UsuarioRepository_ListarAsync_FiltraPorNombreRolYEstadoCorrectamente));
        var repo = new UsuarioRepository(context);

        var u1 = Usuario.Crear("Alberto Ramos", "alberto@upla.edu.pe", "hash", RolUsuario.Responsable);
        var u2 = Usuario.Crear("Beatriz Solis", "beatriz@upla.edu.pe", "hash", RolUsuario.Solicitante);
        var u3 = Usuario.Crear("Carlos Quispe", "carlos@upla.edu.pe", "hash", RolUsuario.Solicitante);
        u3.Desactivar(Guid.NewGuid()); // Inactivo

        await context.Usuarios.AddRangeAsync(u1, u2, u3);
        await context.SaveChangesAsync();

        // 1. Filtrar por búsqueda
        var porNombre = await repo.ListarAsync(busqueda: "alberto");
        Assert.Single(porNombre);
        Assert.Equal(u1.Id_Usuario, porNombre[0].Id_Usuario);

        // 2. Filtrar por rol
        var porRol = await repo.ListarAsync(rol: RolUsuario.Solicitante);
        Assert.Equal(2, porRol.Count);

        // 3. Filtrar por activo
        var activos = await repo.ListarAsync(activo: true);
        Assert.Equal(2, activos.Count);

        var inactivos = await repo.ListarAsync(activo: false);
        Assert.Single(inactivos);
        Assert.Equal(u3.Id_Usuario, inactivos[0].Id_Usuario);
    }

    [Fact]
    public async Task UsuarioRepository_ContarAmbientesAsignadosAsync_RetornaConteoExacto()
    {
        var context = CrearContextoEnMemoria(nameof(UsuarioRepository_ContarAmbientesAsignadosAsync_RetornaConteoExacto));
        var repo = new UsuarioRepository(context);

        var respId = Guid.NewGuid();
        var amb1 = Ambiente.Crear("Laboratorio 1", TipoAmbiente.LaboratorioComputo, 30, "Pabellón A", respId);
        var amb2 = Ambiente.Crear("Laboratorio 2", TipoAmbiente.LaboratorioComputo, 25, "Pabellón B", respId);
        var amb3 = Ambiente.Crear("Auditorio", TipoAmbiente.Auditorio, 100, "Pabellón C", Guid.NewGuid());

        await context.Ambientes.AddRangeAsync(amb1, amb2, amb3);
        await context.SaveChangesAsync();

        var conteo = await repo.ContarAmbientesAsignadosAsync(respId);
        Assert.Equal(2, conteo);

        var conteoOtro = await repo.ContarAmbientesAsignadosAsync(Guid.NewGuid());
        Assert.Equal(0, conteoOtro);
    }
}
