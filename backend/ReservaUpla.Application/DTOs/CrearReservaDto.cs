using System;

namespace ReservaUpla.Application.DTOs;

// RF-03 · RN-02 · RN-03 · RN-04 · RV-08 · RV-09 · RV-10 · RV-11 · RV-12
public record CrearReservaDto(
    Guid AmbienteId,
    DateOnly Fecha,
    TimeSpan HoraInicio,
    TimeSpan HoraFin,
    string Motivo);
