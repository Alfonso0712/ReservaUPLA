using System;

namespace ReservaUpla.Application.DTOs;

// RF-04 · RN-01 · RV-14
public record BloqueDisponibilidadDto(
    TimeSpan HoraInicio,
    TimeSpan HoraFin,
    string Estado,
    string? Motivo);
