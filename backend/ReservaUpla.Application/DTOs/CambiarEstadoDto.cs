namespace ReservaUpla.Application.DTOs;

// RF-07 · RV-15 · RV-16 · RV-17
public record CambiarEstadoDto(
    string Estado,
    string? Motivo = null);
