using System;
using System.Threading;
using System.Threading.Tasks;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Mappers;
using ReservaUpla.Domain.Constants;

namespace ReservaUpla.Application.Services;

// Nielsen 5 · RV-04 · RV-10 · E-04 · E-05 · E-09 · E-12 · E-13
public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _usuarioRepo;
    private readonly IPasswordHasherService _hasher;

    public AuthService(IUsuarioRepository usuarioRepo, IPasswordHasherService hasher)
    {
        _usuarioRepo = usuarioRepo;
        _hasher = hasher;
    }

    public async Task<UsuarioDto> LoginAsync(LoginDto loginDto, CancellationToken ct = default)
    {
        // RV-04: Recortar y pasar a minusculas solo con ReglasUsuario.NormalizarCorreo. La contrasena NUNCA se recorta.
        var correo = ReglasUsuario.NormalizarCorreo(loginDto.Correo);
        var contrasena = loginDto.Contrasena;

        if (string.IsNullOrWhiteSpace(correo) || string.IsNullOrEmpty(contrasena))
        {
            _hasher.VerifyDummyPassword();
            throw new UnauthorizedAccessException(MensajesValidacion.CredencialesNoValidasDetalle);
        }

        var usuario = await _usuarioRepo.ObtenerPorCorreoAsync(correo, ct);
        if (usuario == null || !usuario.Act_Usuario)
        {
            // RV-10: Verificar hash ficticio ante usuario inexistente o inactivo para igualar tiempos
            _hasher.VerifyDummyPassword();
            throw new UnauthorizedAccessException(MensajesValidacion.CredencialesNoValidasDetalle);
        }

        if (!_hasher.VerifyPassword(usuario.Has_Usuario, contrasena))
        {
            throw new UnauthorizedAccessException(MensajesValidacion.CredencialesNoValidasDetalle);
        }

        return UsuarioMapper.ToDto(usuario);
    }
}
