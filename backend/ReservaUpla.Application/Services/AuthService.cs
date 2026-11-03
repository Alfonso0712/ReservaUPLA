using System;
using System.Threading;
using System.Threading.Tasks;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Mappers;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Application.Services;

// E-07 · E-08
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
        var correo = ReglasUsuario.NormalizarCorreo(loginDto.Correo);
        if (string.IsNullOrWhiteSpace(correo) || string.IsNullOrWhiteSpace(loginDto.Contrasena))
        {
            _hasher.VerifyDummyPassword();
            throw new UnauthorizedAccessException(Mensajes.CredencialesInvalidas);
        }

        var usuario = await _usuarioRepo.ObtenerPorCorreoAsync(correo, ct);
        if (usuario == null || !usuario.Act_Usuario)
        {
            _hasher.VerifyDummyPassword();
            throw new UnauthorizedAccessException(Mensajes.CredencialesInvalidas);
        }

        if (!_hasher.VerifyPassword(usuario.Has_Usuario, loginDto.Contrasena))
            throw new UnauthorizedAccessException(Mensajes.CredencialesInvalidas);

        return UsuarioMapper.ToDto(usuario);
    }
}
