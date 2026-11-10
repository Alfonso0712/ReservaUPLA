using System.ComponentModel.DataAnnotations;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Application.DTOs;

public record CrearUsuarioAdminDto(
    [Required(ErrorMessage = Mensajes.NombreRequerido)]
    [StringLength(ReglasUsuario.MaxLongitudNombre, MinimumLength = ReglasUsuario.MinLongitudNombre, ErrorMessage = Mensajes.NombreLongitud)]
    [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$", ErrorMessage = Mensajes.NombreFormato)]
    string NombreCompleto,

    [Required(ErrorMessage = Mensajes.CorreoRequerido)]
    [StringLength(ReglasUsuario.MaxLongitudCorreo, ErrorMessage = Mensajes.CorreoInvalido)]
    [EmailAddress(ErrorMessage = Mensajes.CorreoInvalido)]
    string Correo,

    [Required(ErrorMessage = Mensajes.RolInvalido)]
    RolUsuario Rol,

    [Required(ErrorMessage = Mensajes.ContrasenaRequerida)]
    [MinLength(8, ErrorMessage = Mensajes.ContrasenaLongitud)]
    string Contrasena);
