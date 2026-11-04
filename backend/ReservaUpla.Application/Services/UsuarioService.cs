using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Mappers;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Application.Services;

// RF-01 · RV-01 a RV-03 · E-01 a E-06
public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _usuarioRepo;
    private readonly IPasswordHasherService _hasher;
    private readonly IUnitOfWork _unitOfWork;

    public UsuarioService(IUsuarioRepository usuarioRepo, IPasswordHasherService hasher, IUnitOfWork unitOfWork)
    {
        _usuarioRepo = usuarioRepo;
        _hasher = hasher;
        _unitOfWork = unitOfWork;
    }

    public async Task<UsuarioDto> RegistrarSolicitanteAsync(RegistroUsuarioDto dto, CancellationToken ct = default)
    {
        ValidarPrecondiciones(dto);

        var correoNormalizado = ReglasUsuario.NormalizarCorreo(dto.Correo);
        if (await _usuarioRepo.ExisteCorreoAsync(correoNormalizado, ct))
            throw new DomainException(Mensajes.CorreoDuplicado, esConflicto: true);

        var hash = _hasher.HashPassword(dto.Contrasena);
        var usuario = Usuario.Crear(dto.NombreCompleto, correoNormalizado, hash, RolUsuario.Solicitante);

        await _usuarioRepo.AgregarAsync(usuario, ct);
        await _unitOfWork.GuardarCambiosAsync(ct);

        return UsuarioMapper.ToDto(usuario);
    }

    public async Task<UsuarioDto?> ObtenerPorIdAsync(Guid id, CancellationToken ct = default)
    {
        var usuario = await _usuarioRepo.ObtenerPorIdAsync(id, ct);
        return usuario == null ? null : UsuarioMapper.ToDto(usuario);
    }

    public async Task<IReadOnlyList<UsuarioDto>> ListarResponsablesAsync(CancellationToken ct = default)
    {
        var lista = await _usuarioRepo.ListarResponsablesAsync(ct);
        return lista.Select(UsuarioMapper.ToDto).ToList();
    }

    private static void ValidarPrecondiciones(RegistroUsuarioDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Contrasena) ||
            dto.Contrasena.Length < ReglasUsuario.MinLongitudContrasena ||
            dto.Contrasena.Length > ReglasUsuario.MaxLongitudContrasena)
        {
            throw new DomainException(Mensajes.ContrasenaLongitud);
        }
    }
}
