namespace ReservaUpla.Application.DTOs;

// RF-08 · E-30 · E-49
public record DashboardEstadisticasDto(
    int TotalReservas,
    int ReservasPendientes,
    int ReservasAprobadas,
    int ReservasRechazadas,
    int ReservasCanceladas,
    string AmbienteMasUtilizado,
    int CantidadUsoAmbienteMasUtilizado,
    string Alcance = "global")
{
    public int Total => TotalReservas;
    public int Pendientes => ReservasPendientes;
    public int Aprobadas => ReservasAprobadas;
    public int Rechazadas => ReservasRechazadas;
    public int Canceladas => ReservasCanceladas;
}
