namespace ReservaUpla.Domain.Constants;

public static class MensajesValidacion
{
    // RV-01 · RV-06 · E-01
    public const string CorreoVacio = "Ingrese su correo institucional.";

    // RV-03 · RV-06 · E-02 · E-10
    public const string CorreoFormatoInvalido = "Ingrese un correo institucional válido.";

    // RV-06 · E-11
    public const string CorreoMaximo = "El correo no puede superar los 254 caracteres.";

    // RV-02 · RV-06 · E-01 · E-03
    public const string ContrasenaVacia = "Ingrese su contraseña.";

    // RV-13 · RV-06 · E-26
    public const string ContrasenaMinimo = "La contraseña debe tener al menos 8 caracteres.";

    // RV-06 · E-11
    public const string ContrasenaMaximo = "La contraseña no puede superar los 128 caracteres.";

    // RV-10 · Nielsen 9 · E-04 · E-13
    public const string CredencialesNoValidasTitulo = "Credenciales no válidas";
    public const string CredencialesNoValidasDetalle = "El correo o la contraseña no son correctos. Revíselos e intente nuevamente.";

    // E-14 · E-23
    public const string SinConexion = "No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.";

    // E-15
    public const string ErrorInternoTitulo = "Error interno";
    public const string ErrorInternoDetalle = "No se pudo completar la solicitud. Intente nuevamente más tarde.";

    // RV-11 · E-22
    public const string DemasiadosIntentosFormato = "Demasiados intentos. Espere {0} segundos e intente nuevamente.";
}
