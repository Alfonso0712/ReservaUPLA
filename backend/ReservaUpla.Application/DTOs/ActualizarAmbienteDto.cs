using System;

namespace ReservaUpla.Application.DTOs;

// RF-02 · RV-04 · RV-05 · RV-06 · RV-07 · E-39 · E-40
public record ActualizarAmbienteDto(
    string Nombre,
    string Tipo,
    int Capacidad,
    string Ubicacion,
    Guid? ResponsableId);
