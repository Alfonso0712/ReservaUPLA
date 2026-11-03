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
            Act_Usuario = true
        };
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
