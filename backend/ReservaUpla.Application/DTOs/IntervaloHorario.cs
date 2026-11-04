using System;

namespace ReservaUpla.Application.DTOs;

public record IntervaloHorario(
    Guid AmbienteId,
    DateOnly Fecha,
    TimeSpan Inicio,
    TimeSpan Fin,
    Guid? ExcluirReservaId = null);
