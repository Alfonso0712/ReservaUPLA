using ReservaUpla.Application.DTOs;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Application.Mappers;

public static class AmbienteMapper
{
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
