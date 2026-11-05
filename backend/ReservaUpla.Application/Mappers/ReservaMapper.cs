using ReservaUpla.Application.DTOs;
using ReservaUpla.Domain.Entities;

namespace ReservaUpla.Application.Mappers;

public static class ReservaMapper
{
    public static ReservaDto ToDto(Reserva reserva, Usuario? solicitante, Ambiente? ambiente)
    {
        var solDto = solicitante != null
            ? new UsuarioResumenDto(solicitante.Id_Usuario, solicitante.Nom_Usuario, solicitante.Cor_Usuario)
            : null;
        var ambDto = ambiente != null
            ? new AmbienteResumenDto(ambiente.Id_Ambiente, ambiente.Nom_Ambiente, AmbienteMapper.FormatearTipo(ambiente.Tip_Ambiente))
            : null;

        return new ReservaDto(
            reserva.Id_Reserva,
            reserva.Fec_Reserva,
            reserva.Hin_Reserva,
            reserva.Hfi_Reserva,
            reserva.Mot_Reserva,
            reserva.Est_Reserva.ToString(),
            reserva.Idu_Reserva,
            solicitante?.Nom_Usuario ?? string.Empty,
            reserva.Ida_Reserva,
            ambiente?.Nom_Ambiente ?? string.Empty,
            reserva.Fre_Reserva,
            solDto,
            ambDto);
    }

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

    public static ReservaDetalleDto ToDetalleDto(Reserva reserva, Usuario solicitante, Ambiente ambiente)
    {
        var solDto = new UsuarioResumenDto(solicitante.Id_Usuario, solicitante.Nom_Usuario, solicitante.Cor_Usuario);
        var tipoFormateado = AmbienteMapper.FormatearTipo(ambiente.Tip_Ambiente);
        var ambDto = new AmbienteDetalleResumenDto(
            ambiente.Id_Ambiente,
            ambiente.Nom_Ambiente,
            tipoFormateado,
            ambiente.Ubi_Ambiente,
            ambiente.Cap_Ambiente);

        return new ReservaDetalleDto(
            reserva.Id_Reserva,
            reserva.Fec_Reserva,
            reserva.Hin_Reserva,
            reserva.Hfi_Reserva,
            reserva.Mot_Reserva,
            reserva.Est_Reserva.ToString(),
            reserva.Idu_Reserva,
            solicitante.Nom_Usuario,
            solicitante.Cor_Usuario,
            reserva.Ida_Reserva,
            ambiente.Nom_Ambiente,
            ambiente.Ubi_Ambiente,
            tipoFormateado,
            reserva.Fre_Reserva,
            solDto,
            ambDto,
            ambiente.Cap_Ambiente);
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
