using ReservaUpla.Application.DTOs;
using ReservaUpla.Domain.Entities;

namespace ReservaUpla.Application.Mappers;

public static class AmbienteMapper
{
    public static AmbienteDto ToDto(Ambiente ambiente, string? nombreResponsable = null)
    {
        return new AmbienteDto(
            ambiente.Id_Ambiente,
            ambiente.Nom_Ambiente,
            ambiente.Tip_Ambiente.ToString(),
            ambiente.Cap_Ambiente,
            ambiente.Ubi_Ambiente,
            ambiente.Est_Ambiente.ToString(),
            ambiente.Idr_Ambiente,
            nombreResponsable);
    }
}
