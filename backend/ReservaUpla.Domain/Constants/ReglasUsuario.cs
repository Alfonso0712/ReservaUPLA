using System.Text.RegularExpressions;

namespace ReservaUpla.Domain.Constants;

public static class ReglasUsuario
{
    // Dominio institucional institucionalizado una sola vez (RV-03)
    public const string DominioInstitucional = "upla.edu.pe";
    public const string PatronCorreo = @"^[^\s@]+@upla\.edu\.pe$";

    // Longitudes maximas y minimas (RV-13)
    public const int CorreoMaxLength = 254;
    public const int ContrasenaMinLength = 8;
    public const int ContrasenaMaxLength = 128;

    public const int MinLongitudNombre = 3;
    public const int MaxLongitudNombre = 150;

    // Compatibilidad
    public const int MaxLongitudCorreo = CorreoMaxLength;
    public const int MinLongitudContrasena = ContrasenaMinLength;
    public const int MaxLongitudContrasena = ContrasenaMaxLength;

    // RV-02
    public static readonly Regex RegexNombre = new(
        @"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$",
        RegexOptions.Compiled);

    // RV-01 · RV-03
    public static readonly Regex RegexCorreo = new(
        PatronCorreo,
        RegexOptions.Compiled);

    // RV-04 · Nielsen 5: Recortar y pasar a minusculas con UNA sola funcion. La contrasena NUNCA se recorta.
    public static string NormalizarCorreo(string? correo)
    {
        return string.IsNullOrWhiteSpace(correo) ? string.Empty : correo.Trim().ToLowerInvariant();
    }
}
