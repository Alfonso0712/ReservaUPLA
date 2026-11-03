using System;

namespace ReservaUpla.Application.DTOs;

// RF-02 · RV-04 · RV-05 · RV-06 · RV-07
public record CrearAmbienteDto(
    string Nombre,
    string Tipo,
    int Capacidad,
    string Ubicacion,
    Guid? ResponsableId);
