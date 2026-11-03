// Una sola fuente de mensajes en el cliente
export const MENSAJES = {
  CORREO_REQUERIDO: 'El correo electrónico es obligatorio.',
  CORREO_INVALIDO: 'El correo electrónico no tiene un formato válido.',
  CORREO_DUPLICADO: 'El correo electrónico ya se encuentra registrado.',

  NOMBRE_REQUERIDO: 'El nombre es obligatorio.',
  NOMBRE_LONGITUD: 'El nombre debe tener entre 3 y 150 caracteres.',
  NOMBRE_FORMATO: 'El nombre solo puede contener letras, espacios y tildes.',

  CONTRASENA_REQUERIDA: 'La contraseña es obligatoria.',
  CONTRASENA_LONGITUD: 'La contraseña debe tener entre 8 y 64 caracteres.',

  AMBIENTE_NOMBRE_REQUERIDO: 'El nombre del ambiente es obligatorio y máximo 100 caracteres.',
  AMBIENTE_TIPO_INVALIDO: 'El tipo de ambiente no es válido.',
  AMBIENTE_CAPACIDAD_INVALIDA: 'La capacidad debe ser un número entero entre 1 y 1000.',
  AMBIENTE_UBICACION_REQUERIDA: 'La ubicación es obligatoria y máximo 100 caracteres.',
  AMBIENTE_NO_EXISTE: 'El ambiente seleccionado no existe.',
  AMBIENTE_NO_DISPONIBLE: 'El ambiente se encuentra en mantenimiento y no admite reservas.',

  FECHA_REQUERIDA: 'La fecha de la reserva es obligatoria.',
  FECHA_PASADA: 'No se pueden realizar reservas para fechas pasadas.',
  HORAS_REQUERIDAS: 'La hora de inicio y fin son obligatorias.',
  FIN_MAYOR_INICIO: 'La hora de fin debe ser posterior a la hora de inicio.',
  RANGO_HORARIO_INVALIDO: 'El horario de reserva debe estar entre las 07:00 y las 22:00.',
  MOTIVO_LONGITUD: 'El motivo debe tener entre 10 y 500 caracteres.',

  CONFLICTO_DISPONIBILIDAD: 'El ambiente no se encuentra disponible en el horario seleccionado.',
  TRANSICION_ESTADO_INVALIDA: 'La transición de estado solicitada no es permitida.',
  RESERVA_RECHAZADA_INMODIFICABLE: 'Una reserva rechazada o cancelada no puede ser modificada.',
  SOLO_ADMIN_APRUEBA_RECHAZA: 'Solo el Administrador tiene autorización para aprobar o rechazar reservas.',
  SOLICITANTE_SOLO_CANCELA_PROPIAS: 'Solo puede cancelar reservas que le pertenezcan.',

  CREDENCIALES_INVALIDAS: 'Credenciales incorrectas.',
  LIMITE_INTENTOS_EXCEDIDO: 'Demasiados intentos fallidos. Intente nuevamente en unos minutos.',
  ERROR_CONEXION: 'No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.',
  ERROR_SERVIDOR: 'Ocurrió un error inesperado al procesar la solicitud. Por favor intente más tarde.'
};
