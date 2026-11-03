using ReservaUpla.Application.DTOs;
using ReservaUpla.Domain.Entities;

namespace ReservaUpla.Application.Mappers;

public static class ReservaMapper
{
    public static ReservaDto ToDto(Reserva reserva, string nombreSolicitante, string nombreAmbiente)
    {
        return new ReservaDto(
            reserva.Id_Reserva,
            reserva.Fec_Reserva,
            reserva.Hin_Reserva,
            reserva.Hfi_Reserva,
            reserva.Mot_Reserva,
            reserva.Est_Reserva.ToString(),
            reserva.Idu_Reserva,
            nombreSolicitante,
            reserva.Ida_Reserva,
            nombreAmbiente,
            reserva.Fre_Reserva);
    }

    public static ReservaDetalleDto ToDetalleDto(
        Reserva reserva,
        string nombreSolicitante,
        string correoSolicitante,
        string nombreAmbiente,
        string ubicacionAmbiente,
        string tipoAmbiente)
    {
        return new ReservaDetalleDto(
            reserva.Id_Reserva,
            reserva.Fec_Reserva,
            reserva.Hin_Reserva,
            reserva.Hfi_Reserva,
            reserva.Mot_Reserva,
            reserva.Est_Reserva.ToString(),
            reserva.Idu_Reserva,
            nombreSolicitante,
            correoSolicitante,
            reserva.Ida_Reserva,
            nombreAmbiente,
            ubicacionAmbiente,
            tipoAmbiente,
            reserva.Fre_Reserva);
    }
}
