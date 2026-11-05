using ReservaUpla.Application.DTOs;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Application.Mappers;

public static class AmbienteMapper
{
    public static TipoAmbiente ParsearTipo(string? tipo)
    {
        if (string.IsNullOrWhiteSpace(tipo))
            throw new DomainException(Mensajes.AmbienteTipoInvalido);

        var limpio = tipo.Trim().ToLowerInvariant()
            .Replace("ó", "o")
            .Replace(" ", "");

        return limpio switch
        {
            "laboratoriocomputo" or "laboratoriodecomputo" => TipoAmbiente.LaboratorioComputo,
            "auditorio" => TipoAmbiente.Auditorio,
            "salareuniones" or "saladereuniones" => TipoAmbiente.SalaReuniones,
            "laboratorioespecializado" => TipoAmbiente.LaboratorioEspecializado,
            _ => System.Enum.TryParse<TipoAmbiente>(limpio, true, out var t)
                ? t
                : throw new DomainException(Mensajes.AmbienteTipoInvalido)
        };
    }

    public static string FormatearTipo(TipoAmbiente tipo) => tipo switch
    {
        TipoAmbiente.LaboratorioComputo => "Laboratorio de cómputo",
        TipoAmbiente.Auditorio => "Auditorio",
        TipoAmbiente.SalaReuniones => "Sala de reuniones",
        TipoAmbiente.LaboratorioEspecializado => "Laboratorio especializado",
        _ => tipo.ToString()
    };

    public static AmbienteDto ToDto(Ambiente ambiente, string? nombreResponsable = null)
    {
        return new AmbienteDto(
            ambiente.Id_Ambiente,
            ambiente.Nom_Ambiente,
            FormatearTipo(ambiente.Tip_Ambiente),
            ambiente.Cap_Ambiente,
            ambiente.Ubi_Ambiente,
            ambiente.Est_Ambiente.ToString(),
            ambiente.Idr_Ambiente,
            nombreResponsable);
    }
}
