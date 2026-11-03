namespace ReservaUpla.Application.DTOs;

// RF-08 · E-30
public record DashboardEstadisticasDto(
    int TotalReservas,
    int ReservasPendientes,
    int ReservasAprobadas,
    int ReservasRechazadas,
    int ReservasCanceladas,
    string AmbienteMasUtilizado,
    int CantidadUsoAmbienteMasUtilizado);
