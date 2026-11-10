using System;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Domain.Entities;

public class Usuario
{
    public Guid Id_Usuario { get; private set; }
    public string Nom_Usuario { get; private set; } = string.Empty;
    public string Cor_Usuario { get; private set; } = string.Empty;
    public string Has_Usuario { get; private set; } = string.Empty;
    public RolUsuario Rol_Usuario { get; private set; }
    public bool Act_Usuario { get; private set; }
    public string Tema { get; private set; } = "claro";
    public string TamanoLetra { get; private set; } = "normal";

    // Constructor privado para EF Core
    private Usuario() { }

    // RF-01 · RV-01 · RV-02 · E-01 · E-02 · E-03 · E-05 · E-06
    public static Usuario Crear(string nombre, string correo, string hashContrasena, RolUsuario rol)
    {
        var nombreLimpio = nombre?.Trim() ?? string.Empty;
        var correoNormalizado = ReglasUsuario.NormalizarCorreo(correo);

        ValidarDatos(nombreLimpio, correoNormalizado, hashContrasena);

        return new Usuario
        {
            Id_Usuario = Guid.NewGuid(),
            Nom_Usuario = nombreLimpio,
            Cor_Usuario = correoNormalizado,
            Has_Usuario = hashContrasena,
            Rol_Usuario = rol,
            Act_Usuario = true,
            Tema = "claro",
            TamanoLetra = "normal"
        };
    }

    public static Usuario CrearPorAdmin(string nombre, string correo, string hashContrasena, RolUsuario rol)
    {
        if (rol != RolUsuario.Responsable && rol != RolUsuario.Solicitante)
            throw new DomainException(Mensajes.RolNoAsignable);

        return Crear(nombre, correo, hashContrasena, rol);
    }

    public void ActualizarDatos(string nombre, RolUsuario nuevoRol, bool tieneAmbientesAsignados = false, string? nuevoHash = null)
    {
        if (Rol_Usuario == RolUsuario.Administrador)
            throw new DomainException(Mensajes.UsuarioAdminNoModificable);

        if (nuevoRol != RolUsuario.Responsable && nuevoRol != RolUsuario.Solicitante)
            throw new DomainException(Mensajes.RolNoAsignable);

        if (Rol_Usuario == RolUsuario.Responsable && nuevoRol == RolUsuario.Solicitante && tieneAmbientesAsignados)
            throw new DomainException(Mensajes.ResponsableConAmbientesNoPuedeCambiarRol);

        var nombreLimpio = nombre?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(nombreLimpio) || nombreLimpio.Length < ReglasUsuario.MinLongitudNombre || nombreLimpio.Length > ReglasUsuario.MaxLongitudNombre)
            throw new DomainException(Mensajes.NombreLongitud);

        if (!ReglasUsuario.RegexNombre.IsMatch(nombreLimpio))
            throw new DomainException(Mensajes.NombreFormato);

        Nom_Usuario = nombreLimpio;
        Rol_Usuario = nuevoRol;

        if (!string.IsNullOrWhiteSpace(nuevoHash))
        {
            Has_Usuario = nuevoHash;
        }
    }

    public void ActualizarContrasena(string nuevoHash)
    {
        if (Rol_Usuario == RolUsuario.Administrador)
            throw new DomainException(Mensajes.UsuarioAdminNoModificable);

        if (string.IsNullOrWhiteSpace(nuevoHash))
            throw new DomainException(Mensajes.ContrasenaRequerida);

        Has_Usuario = nuevoHash;
    }

    public void Desactivar(Guid idOperador)
    {
        if (Rol_Usuario == RolUsuario.Administrador)
            throw new DomainException(Mensajes.UsuarioAdminNoModificable);

        if (Id_Usuario == idOperador)
            throw new DomainException(Mensajes.UsuarioNoPuedeDesactivarseASiMismo);

        Act_Usuario = false;
    }

    public void Activar()
    {
        if (Rol_Usuario == RolUsuario.Administrador)
            throw new DomainException(Mensajes.UsuarioAdminNoModificable);

        Act_Usuario = true;
    }

    public void ActualizarPreferencias(string? tema, string? tamanoLetra)
    {
        if (tema == null && tamanoLetra == null)
            throw new DomainException("Debe proporcionar al menos una preferencia válida ('tema' o 'tamanoLetra').");

        if (tema != null)
        {
            var temaLimpio = tema.Trim().ToLowerInvariant();
            if (temaLimpio != "claro" && temaLimpio != "oscuro")
                throw new DomainException("El tema debe ser 'claro' u 'oscuro'.");
            Tema = temaLimpio;
        }

        if (tamanoLetra != null)
        {
            var tamanoLimpio = tamanoLetra.Trim().ToLowerInvariant();
            if (tamanoLimpio != "pequeno" && tamanoLimpio != "normal" && tamanoLimpio != "grande")
                throw new DomainException("El tamaño de letra debe ser 'pequeno', 'normal' o 'grande'.");
            TamanoLetra = tamanoLimpio;
        }
    }

    private static void ValidarDatos(string nombre, string correo, string hashContrasena)
    {
        if (string.IsNullOrWhiteSpace(nombre) || nombre.Length < ReglasUsuario.MinLongitudNombre || nombre.Length > ReglasUsuario.MaxLongitudNombre)
            throw new DomainException(Mensajes.NombreLongitud);

        if (!ReglasUsuario.RegexNombre.IsMatch(nombre))
            throw new DomainException(Mensajes.NombreFormato);

        if (string.IsNullOrWhiteSpace(correo) || correo.Length > ReglasUsuario.MaxLongitudCorreo || !ReglasUsuario.RegexCorreo.IsMatch(correo))
            throw new DomainException(Mensajes.CorreoInvalido);

        if (string.IsNullOrWhiteSpace(hashContrasena))
            throw new DomainException(Mensajes.ContrasenaRequerida);
    }
}
