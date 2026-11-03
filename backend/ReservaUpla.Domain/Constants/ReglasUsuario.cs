using System.Text.RegularExpressions;

namespace ReservaUpla.Domain.Constants;

public static class ReglasUsuario
{
    public const int MinLongitudNombre = 3;
    public const int MaxLongitudNombre = 150;
    public const int MaxLongitudCorreo = 150;
    public const int MinLongitudContrasena = 8;
    public const int MaxLongitudContrasena = 64;

    // RV-02
    public static readonly Regex RegexNombre = new(
        @"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$",
        RegexOptions.Compiled);

    // RV-01
    public static readonly Regex RegexCorreo = new(
        @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
        RegexOptions.Compiled);

    // RV-01
    public static string NormalizarCorreo(string? correo)
    {
        return string.IsNullOrWhiteSpace(correo) ? string.Empty : correo.Trim().ToLowerInvariant();
    }
}
