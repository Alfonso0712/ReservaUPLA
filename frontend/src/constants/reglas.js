// Espejo de reglas del backend
export const MIN_LONGITUD_NOMBRE = 3;
export const MAX_LONGITUD_NOMBRE = 150;
export const MAX_LONGITUD_CORREO = 150;
export const MIN_LONGITUD_CONTRASENA = 8;
export const MAX_LONGITUD_CONTRASENA = 64;

export const MAX_LONGITUD_NOMBRE_AMBIENTE = 100;
export const MIN_CAPACIDAD = 1;
export const MAX_CAPACIDAD = 1000;
export const MAX_LONGITUD_UBICACION = 100;

export const HORA_APERTURA = '07:00';
export const HORA_CIERRE = '22:00';
export const MIN_LONGITUD_MOTIVO = 10;
export const MAX_LONGITUD_MOTIVO = 500;

// RV-02
export const REGEX_NOMBRE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

// RV-01
export const REGEX_CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
