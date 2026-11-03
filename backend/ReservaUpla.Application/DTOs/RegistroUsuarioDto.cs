namespace ReservaUpla.Application.DTOs;

// RF-01 · RV-01 · RV-02 · RV-03
public record RegistroUsuarioDto(
    string NombreCompleto,
    string Correo,
    string Contrasena);
