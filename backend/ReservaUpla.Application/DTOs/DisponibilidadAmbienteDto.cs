using System;
using System.Collections.Generic;

namespace ReservaUpla.Application.DTOs;

public record DisponibilidadAmbienteDto(
    Guid AmbienteId,
    string NombreAmbiente,
    DateOnly Fecha,
    IReadOnlyList<BloqueDisponibilidadDto> Reservas);
