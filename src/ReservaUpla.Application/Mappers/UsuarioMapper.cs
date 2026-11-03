using ReservaUpla.Application.DTOs;
using ReservaUpla.Domain.Entities;

namespace ReservaUpla.Application.Mappers;

public static class UsuarioMapper
{
    public static UsuarioDto ToDto(Usuario usuario)
    {
        return new UsuarioDto(
            usuario.Id_Usuario,
            usuario.Nom_Usuario,
            usuario.Cor_Usuario,
            usuario.Rol_Usuario.ToString(),
            usuario.Act_Usuario);
    }
}
