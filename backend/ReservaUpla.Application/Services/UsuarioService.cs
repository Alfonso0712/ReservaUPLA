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
    private readonly IAmbienteRepository? _ambienteRepo;

    public UsuarioService(
        IUsuarioRepository usuarioRepo,
        IPasswordHasherService hasher,
        IUnitOfWork unitOfWork,
        IAmbienteRepository? ambienteRepo = null)
    {
        _usuarioRepo = usuarioRepo;
        _hasher = hasher;
        _unitOfWork = unitOfWork;
        _ambienteRepo = ambienteRepo;
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
        if (usuario == null) return null;
        var ambientesCount = await _usuarioRepo.ContarAmbientesAsignadosAsync(id, ct);
        return UsuarioMapper.ToDto(usuario, ambientesCount);
    }

    public async Task<IReadOnlyList<UsuarioDto>> ListarResponsablesAsync(CancellationToken ct = default)
    {
        var lista = await _usuarioRepo.ListarResponsablesAsync(ct);
        return lista.Select(u => UsuarioMapper.ToDto(u)).ToList();
    }

    public async Task<UsuarioDto> ActualizarPreferenciasAsync(Guid usuarioId, ActualizarPreferenciasDto dto, CancellationToken ct = default)
    {
        var usuario = await _usuarioRepo.ObtenerPorIdSeguimientoAsync(usuarioId, ct);
        if (usuario == null)
            throw new DomainException("Usuario no encontrado.");

        usuario.ActualizarPreferencias(dto.Tema, dto.TamanoLetra);

        await _usuarioRepo.ActualizarAsync(usuario, ct);
        await _unitOfWork.GuardarCambiosAsync(ct);

        var count = await _usuarioRepo.ContarAmbientesAsignadosAsync(usuarioId, ct);
        return UsuarioMapper.ToDto(usuario, count);
    }

    // Módulo de Usuarios (Admin)
    public async Task<UsuarioDto> RegistrarPorAdminAsync(CrearUsuarioAdminDto dto, CancellationToken ct = default)
    {
        if (dto == null) throw new ArgumentNullException(nameof(dto));

        if (dto.Rol != RolUsuario.Responsable && dto.Rol != RolUsuario.Solicitante)
            throw new DomainException(Mensajes.RolNoAsignable);

        var correoNormalizado = ReglasUsuario.NormalizarCorreo(dto.Correo);
        if (await _usuarioRepo.ExisteCorreoAsync(correoNormalizado, ct))
            throw new DomainException(Mensajes.CorreoDuplicado, esConflicto: true);

        if (string.IsNullOrWhiteSpace(dto.Contrasena) || dto.Contrasena.Length < 8)
            throw new DomainException(Mensajes.ContrasenaLongitud);

        var hash = _hasher.HashPassword(dto.Contrasena);
        var usuario = Usuario.CrearPorAdmin(dto.NombreCompleto, correoNormalizado, hash, dto.Rol);

        await _usuarioRepo.AgregarAsync(usuario, ct);
        await _unitOfWork.GuardarCambiosAsync(ct);

        return UsuarioMapper.ToDto(usuario);
    }

    public async Task<IReadOnlyList<UsuarioDto>> ListarUsuariosAdminAsync(string? busqueda = null, RolUsuario? rol = null, bool? activo = null, CancellationToken ct = default)
    {
        var usuarios = await _usuarioRepo.ListarAsync(busqueda, rol, activo, ct);
        var resultado = new List<UsuarioDto>(usuarios.Count);
        foreach (var u in usuarios)
        {
            var count = await _usuarioRepo.ContarAmbientesAsignadosAsync(u.Id_Usuario, ct);
            resultado.Add(UsuarioMapper.ToDto(u, count));
        }
        return resultado;
    }

    public async Task<UsuarioDto> ActualizarUsuarioAsync(Guid id, ActualizarUsuarioDto dto, CancellationToken ct = default)
    {
        if (dto == null) throw new ArgumentNullException(nameof(dto));

        var usuario = await _usuarioRepo.ObtenerPorIdSeguimientoAsync(id, ct)
            ?? throw new DomainException(Mensajes.UsuarioNoExiste);

        bool tieneAmbientes = false;
        if (usuario.Rol_Usuario == RolUsuario.Responsable && dto.Rol == RolUsuario.Solicitante)
        {
            tieneAmbientes = (await _usuarioRepo.ContarAmbientesAsignadosAsync(id, ct)) > 0;
        }

        string? nuevoHash = null;
        if (!string.IsNullOrWhiteSpace(dto.Contrasena))
        {
            if (dto.Contrasena.Length < 8)
                throw new DomainException(Mensajes.ContrasenaLongitud);
            nuevoHash = _hasher.HashPassword(dto.Contrasena);
        }

        usuario.ActualizarDatos(dto.NombreCompleto, dto.Rol, tieneAmbientes, nuevoHash);

        await _usuarioRepo.ActualizarAsync(usuario, ct);
        await _unitOfWork.GuardarCambiosAsync(ct);

        var count = await _usuarioRepo.ContarAmbientesAsignadosAsync(id, ct);
        return UsuarioMapper.ToDto(usuario, count);
    }

    public async Task<UsuarioDto> CambiarEstadoUsuarioAsync(Guid id, bool activo, Guid idOperador, CancellationToken ct = default)
    {
        var usuario = await _usuarioRepo.ObtenerPorIdSeguimientoAsync(id, ct)
            ?? throw new DomainException(Mensajes.UsuarioNoExiste);

        if (!activo)
        {
            usuario.Desactivar(idOperador);
        }
        else
        {
            usuario.Activar();
        }

        await _usuarioRepo.ActualizarAsync(usuario, ct);
        await _unitOfWork.GuardarCambiosAsync(ct);

        var count = await _usuarioRepo.ContarAmbientesAsignadosAsync(id, ct);
        return UsuarioMapper.ToDto(usuario, count);
    }

    private static void ValidarPrecondiciones(RegistroUsuarioDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.NombreCompleto))
            throw new DomainException(Mensajes.NombreRequerido);

        if (string.IsNullOrWhiteSpace(dto.Correo))
            throw new DomainException(Mensajes.CorreoRequerido);

        if (string.IsNullOrWhiteSpace(dto.Contrasena))
            throw new DomainException(Mensajes.ContrasenaRequerida);
    }
}
