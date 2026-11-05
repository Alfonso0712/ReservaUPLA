using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using ReservaUpla.Api.Controllers;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;
using Xunit;

namespace ReservaUpla.Tests;

public class LoginScenariosTests
{
    // E-01 · RV-01 · RV-02: Campos vacios
    [Fact]
    public void E01_LoginDto_CamposVacios_FallaValidacion()
    {
        var dto = new LoginDto("", "");
        var context = new ValidationContext(dto);
        var results = new List<ValidationResult>();

        var esValido = Validator.TryValidateObject(dto, context, results, validateAllProperties: true);

        Assert.False(esValido);
        Assert.Contains(results, r => r.ErrorMessage == MensajesValidacion.CorreoVacio);
        Assert.Contains(results, r => r.ErrorMessage == MensajesValidacion.ContrasenaVacia);
    }

    // E-02 · RV-03: Formato incorrecto (alfonso@gmail.com)
    [Fact]
    public void E02_LoginDto_CorreoDominioExterno_FallaValidacion()
    {
        var dto = new LoginDto("alfonso@gmail.com", "ClaveValida123*");
        var context = new ValidationContext(dto);
        var results = new List<ValidationResult>();

        var esValido = Validator.TryValidateObject(dto, context, results, validateAllProperties: true);

        Assert.False(esValido);
        Assert.Contains(results, r => r.ErrorMessage == MensajesValidacion.CorreoFormatoInvalido);
    }

    // E-03 · RV-02: Correo valido y contrasena vacia
    [Fact]
    public void E03_LoginDto_CorreoValidoYContrasenaVacia_FallaSoloContrasena()
    {
        var dto = new LoginDto("estudiante@upla.edu.pe", "");
        var context = new ValidationContext(dto);
        var results = new List<ValidationResult>();

        var esValido = Validator.TryValidateObject(dto, context, results, validateAllProperties: true);

        Assert.False(esValido);
        Assert.DoesNotContain(results, r => r.MemberNames.Contains(nameof(LoginDto.Correo)));
        Assert.Contains(results, r => r.ErrorMessage == MensajesValidacion.ContrasenaVacia);
    }

    // E-04 · RV-10: Credenciales incorrectas en AuthService
    [Fact]
    public async Task E04_AuthService_CredencialesIncorrectas_Lanza401EInvocaDummyHash()
    {
        var mockRepo = new Mock<IUsuarioRepository>();
        var mockHasher = new Mock<IPasswordHasherService>();

        mockRepo.Setup(r => r.ObtenerPorCorreoAsync("usuario@upla.edu.pe", It.IsAny<CancellationToken>()))
                .ReturnsAsync((Usuario?)null);

        var service = new Application.Services.AuthService(mockRepo.Object, mockHasher.Object);

        var ex = await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            service.LoginAsync(new LoginDto("usuario@upla.edu.pe", "ClaveErronea123*")));

        Assert.Equal(MensajesValidacion.CredencialesNoValidasDetalle, ex.Message);
        mockHasher.Verify(h => h.VerifyDummyPassword(), Times.Once);
    }

    // E-05 · RV-10: Credenciales correctas en AuthService
    [Fact]
    public async Task E05_AuthService_CredencialesCorrectas_RetornaUsuarioDto()
    {
        var mockRepo = new Mock<IUsuarioRepository>();
        var mockHasher = new Mock<IPasswordHasherService>();

        var usuario = Usuario.Crear("Juan Perez", "juan.perez@upla.edu.pe", "HashReal123*", RolUsuario.Solicitante);
        mockRepo.Setup(r => r.ObtenerPorCorreoAsync("juan.perez@upla.edu.pe", It.IsAny<CancellationToken>()))
                .ReturnsAsync(usuario);

        mockHasher.Setup(h => h.VerifyPassword("HashReal123*", "ClaveValida123*"))
                  .Returns(true);

        var service = new Application.Services.AuthService(mockRepo.Object, mockHasher.Object);
        var resultado = await service.LoginAsync(new LoginDto("juan.perez@upla.edu.pe", "ClaveValida123*"));

        Assert.NotNull(resultado);
        Assert.Equal("Juan Perez", resultado.NombreCompleto);
        Assert.Equal("juan.perez@upla.edu.pe", resultado.Correo);
    }

    // E-09 · RV-04: Correo con espacios y mayusculas se normaliza y autentica
    [Fact]
    public async Task E09_AuthService_CorreoConEspaciosYMayusculas_NormalizaYAutentica()
    {
        var mockRepo = new Mock<IUsuarioRepository>();
        var mockHasher = new Mock<IPasswordHasherService>();

        var usuario = Usuario.Crear("Maria Ramos", "maria.ramos@upla.edu.pe", "HashReal123*", RolUsuario.Solicitante);
        mockRepo.Setup(r => r.ObtenerPorCorreoAsync("maria.ramos@upla.edu.pe", It.IsAny<CancellationToken>()))
                .ReturnsAsync(usuario);

        mockHasher.Setup(h => h.VerifyPassword("HashReal123*", "ClaveValida123*"))
                  .Returns(true);

        var service = new Application.Services.AuthService(mockRepo.Object, mockHasher.Object);
        var resultado = await service.LoginAsync(new LoginDto("  Maria.Ramos@Upla.Edu.Pe  ", "ClaveValida123*"));

        Assert.NotNull(resultado);
        mockRepo.Verify(r => r.ObtenerPorCorreoAsync("maria.ramos@upla.edu.pe", It.IsAny<CancellationToken>()), Times.Once);
    }

    // E-10 · RV-03: Otro dominio, sin @ o con espacios internos
    [Theory]
    [InlineData("usuario@gmail.com")]
    [InlineData("usuario.upla.edu.pe")]
    [InlineData("usuario @upla.edu.pe")]
    [InlineData("usuario@ upla.edu.pe")]
    public void E10_LoginDto_FormatosInvalidosDeCorreo_FallanValidacion(string correoInvalido)
    {
        var dto = new LoginDto(correoInvalido, "ClaveValida123*");
        var context = new ValidationContext(dto);
        var results = new List<ValidationResult>();

        var esValido = Validator.TryValidateObject(dto, context, results, validateAllProperties: true);

        Assert.False(esValido);
        Assert.Contains(results, r => r.ErrorMessage == MensajesValidacion.CorreoFormatoInvalido);
    }

    // E-11: Correo > 254 y contrasena > 128
    [Fact]
    public void E11_LoginDto_LongitudesExcesivas_FallanValidacion()
    {
        var correoLargo = new string('a', 243) + "@upla.edu.pe"; // 255 chars
        var claveLarga = new string('x', 129);

        var dto = new LoginDto(correoLargo, claveLarga);
        var context = new ValidationContext(dto);
        var results = new List<ValidationResult>();

        var esValido = Validator.TryValidateObject(dto, context, results, validateAllProperties: true);

        Assert.False(esValido);
        Assert.Contains(results, r => r.ErrorMessage == MensajesValidacion.CorreoMaximo);
        Assert.Contains(results, r => r.ErrorMessage == MensajesValidacion.ContrasenaMaximo);
    }

    // E-12 · RV-04: Contrasena con espacios al inicio o fin se conserva sin recortar
    [Fact]
    public async Task E12_AuthService_ContrasenaConEspacios_SeConservaSinRecortar()
    {
        var mockRepo = new Mock<IUsuarioRepository>();
        var mockHasher = new Mock<IPasswordHasherService>();

        var usuario = Usuario.Crear("Pedro Diaz", "pedro.diaz@upla.edu.pe", "HashConEspacios", RolUsuario.Solicitante);
        mockRepo.Setup(r => r.ObtenerPorCorreoAsync("pedro.diaz@upla.edu.pe", It.IsAny<CancellationToken>()))
                .ReturnsAsync(usuario);

        mockHasher.Setup(h => h.VerifyPassword("HashConEspacios", "  ClaveConEspacios123*  "))
                  .Returns(true);

        var service = new Application.Services.AuthService(mockRepo.Object, mockHasher.Object);
        var resultado = await service.LoginAsync(new LoginDto("pedro.diaz@upla.edu.pe", "  ClaveConEspacios123*  "));

        Assert.NotNull(resultado);
        // Verificar que el hasher recibio exactamente la contrasena con sus espacios
        mockHasher.Verify(h => h.VerifyPassword("HashConEspacios", "  ClaveConEspacios123*  "), Times.Once);
    }

    // E-13 · RV-10: Usuario inactivo produce mismo 401 y llama hash ficticio
    [Fact]
    public async Task E13_AuthService_UsuarioInactivo_ProduceMismo401EYDummyHash()
    {
        var mockRepo = new Mock<IUsuarioRepository>();
        var mockHasher = new Mock<IPasswordHasherService>();

        // Usamos reflection o constructor para simular usuario inactivo
        var usuario = Usuario.Crear("Inactivo User", "inactivo@upla.edu.pe", "Hash123*", RolUsuario.Solicitante);
        typeof(Usuario).GetProperty(nameof(Usuario.Act_Usuario))!.SetValue(usuario, false);

        mockRepo.Setup(r => r.ObtenerPorCorreoAsync("inactivo@upla.edu.pe", It.IsAny<CancellationToken>()))
                .ReturnsAsync(usuario);

        var service = new Application.Services.AuthService(mockRepo.Object, mockHasher.Object);

        var ex = await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            service.LoginAsync(new LoginDto("inactivo@upla.edu.pe", "ClaveValida123*")));

        Assert.Equal(MensajesValidacion.CredencialesNoValidasDetalle, ex.Message);
        mockHasher.Verify(h => h.VerifyDummyPassword(), Times.Once);
    }

    // E-15: Error 500 en AuthController devuelve ProblemDetails con titulo y detalle institucional
    [Fact]
    public async Task E15_AuthController_ExcepcionInesperada_Retorna500ProblemDetails()
    {
        var mockAuthService = new Mock<IAuthService>();
        var mockLogger = new Mock<ILogger<AuthController>>();

        mockAuthService.Setup(s => s.LoginAsync(It.IsAny<LoginDto>(), It.IsAny<CancellationToken>()))
                       .ThrowsAsync(new InvalidOperationException("Fallo catastrofico simulado"));

        var controller = new AuthController(mockAuthService.Object, mockLogger.Object);
        var response = await controller.Login(new LoginDto("usuario@upla.edu.pe", "ClaveValida123*"), CancellationToken.None);

        var problemResult = Assert.IsType<ObjectResult>(response);
        Assert.Equal(StatusCodes.Status500InternalServerError, problemResult.StatusCode);

        var problem = Assert.IsType<ProblemDetails>(problemResult.Value);
        Assert.Equal(MensajesValidacion.ErrorInternoTitulo, problem.Title);
        Assert.Equal(MensajesValidacion.ErrorInternoDetalle, problem.Detail);
    }

    // Eliminacion de restriccion de minimo 8 caracteres en LoginDto
    [Fact]
    public void LoginDto_ContrasenaCorta_EsAceptadaParaAutenticar()
    {
        var dto = new LoginDto("usuario@upla.edu.pe", "1234567");
        var context = new ValidationContext(dto);
        var results = new List<ValidationResult>();

        var esValido = Validator.TryValidateObject(dto, context, results, validateAllProperties: true);

        Assert.True(esValido);
        Assert.Empty(results);
    }
}
