using System;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Application.DTOs;

public record ParametrosConsultaReservas(
    EstadoReserva? Estado = null,
    Guid? AmbienteId = null,
    DateOnly? Fecha = null,
    Guid? SolicitanteId = null,
    Guid? ResponsableId = null,
    int Pagina = 1,
    int TamanoPagina = 10);
