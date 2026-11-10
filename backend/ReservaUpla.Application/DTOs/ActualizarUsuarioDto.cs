using System.ComponentModel.DataAnnotations;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Application.DTOs;

public record ActualizarUsuarioDto(
    [Required(ErrorMessage = Mensajes.NombreRequerido)]
    [StringLength(ReglasUsuario.MaxLongitudNombre, MinimumLength = ReglasUsuario.MinLongitudNombre, ErrorMessage = Mensajes.NombreLongitud)]
    [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$", ErrorMessage = Mensajes.NombreFormato)]
    string NombreCompleto,

    [Required(ErrorMessage = Mensajes.RolInvalido)]
    RolUsuario Rol,

    string? Contrasena = null);
