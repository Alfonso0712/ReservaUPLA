using System.ComponentModel.DataAnnotations;
using ReservaUpla.Domain.Constants;

namespace ReservaUpla.Application.DTOs;

// Nielsen 5 · RV-01 · RV-02 · RV-03 · E-01 · E-02 · E-03 · E-11
public class LoginDto
{
    [Required(ErrorMessage = MensajesValidacion.CorreoVacio)]
    [MaxLength(ReglasUsuario.CorreoMaxLength, ErrorMessage = MensajesValidacion.CorreoMaximo)]
    [RegularExpression(ReglasUsuario.PatronCorreo, ErrorMessage = MensajesValidacion.CorreoFormatoInvalido)]
    public string Correo { get; set; } = string.Empty;

    [Required(ErrorMessage = MensajesValidacion.ContrasenaVacia)]
    [MaxLength(ReglasUsuario.ContrasenaMaxLength, ErrorMessage = MensajesValidacion.ContrasenaMaximo)]
    public string Contrasena { get; set; } = string.Empty;

    public LoginDto() { }

    public LoginDto(string correo, string contrasena)
    {
        Correo = correo;
        Contrasena = contrasena;
    }
}
