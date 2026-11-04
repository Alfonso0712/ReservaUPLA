namespace ReservaUpla.Domain.Constants;

public static class Mensajes
{
    // RV-01
    public const string CorreoRequerido = MensajesValidacion.CorreoVacio;
    public const string CorreoInvalido = MensajesValidacion.CorreoFormatoInvalido;
    public const string CorreoDuplicado = "El correo electrónico ya se encuentra registrado.";

    // RV-02
    public const string NombreRequerido = "El nombre es obligatorio.";
    public const string NombreLongitud = "El nombre debe tener entre 3 y 150 caracteres.";
    public const string NombreFormato = "El nombre solo puede contener letras, espacios y tildes.";

    // RV-03
    public const string ContrasenaRequerida = MensajesValidacion.ContrasenaVacia;
    public const string ContrasenaLongitud = "La contraseña debe tener al menos 8 caracteres.";

    // RV-04, RV-05, RV-06, RV-07, RV-13
    public const string AmbienteNombreRequerido = "El nombre del ambiente es obligatorio y máximo 100 caracteres.";
    public const string AmbienteTipoInvalido = "El tipo de ambiente no es válido.";
    public const string AmbienteCapacidadInvalida = "La capacidad debe ser un número entero entre 1 y 1000.";
    public const string AmbienteUbicacionRequerida = "La ubicación es obligatoria y máximo 100 caracteres.";
    public const string AmbienteNoExiste = "El ambiente seleccionado no existe.";
    public const string AmbienteNoDisponible = "El ambiente se encuentra en mantenimiento y no admite reservas.";

    // RV-08, RV-09, RV-10, RV-11, RV-12
    public const string FechaRequerida = "La fecha de la reserva es obligatoria.";
    public const string FechaPasada = "No se pueden realizar reservas para fechas pasadas.";
    public const string HorasRequeridas = "La hora de inicio y fin son obligatorias.";
    public const string FinMayorInicio = "La hora de fin debe ser posterior a la hora de inicio.";
    public const string RangoHorarioInvalido = "El horario de reserva debe estar entre las 07:00 y las 22:00.";
    public const string MotivoLongitud = "El motivo debe tener entre 10 y 500 caracteres.";

    // RV-14, RV-15, RV-16, RV-17
    public const string ConflictoDisponibilidad = "El ambiente no se encuentra disponible en el horario seleccionado.";
    public const string TransicionEstadoInvalida = "La transición de estado solicitada no es permitida.";
    public const string ReservaRechazadaInmodificable = "Una reserva rechazada o cancelada no puede ser modificada.";
    public const string SoloAdminApruebaRechaza = "Solo el Administrador tiene autorización para aprobar o rechazar reservas.";
    public const string SolicitanteSoloCancelaPropias = "Solo puede cancelar reservas que le pertenezcan.";

    // Auth & General
    public const string CredencialesInvalidas = MensajesValidacion.CredencialesNoValidasDetalle;
    public const string LimiteIntentosExcedido = "Demasiados intentos. Espere unos segundos e intente nuevamente.";
    public const string RecursoNoEncontrado = "El recurso solicitado no fue encontrado.";
    public const string AccesoDenegado = "No tiene permisos para realizar esta acción.";
    public const string ErrorServidor = MensajesValidacion.ErrorInternoDetalle;
}
