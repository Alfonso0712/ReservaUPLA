using System;

namespace ReservaUpla.Application.DTOs;

// RF-05
public record FiltroReservasDto(
    string? Estado = null,
    Guid? AmbienteId = null,
    DateOnly? Fecha = null,
    int Pagina = 1,
    int TamanoPagina = 10);
