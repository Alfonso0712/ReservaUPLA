// RV-01..16 · RN-01..06 · Nielsen 5 · E-01..17
export const DOMINIO_CORREO_INSTITUCIONAL = 'upla.edu.pe';
export const PATRON_CORREO_INSTITUCIONAL = new RegExp(`^[^\\s@]+@${DOMINIO_CORREO_INSTITUCIONAL.replace('.', '\\.')}$`);
export const PATRON_NOMBRE_COMPLETO = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

export const MIN_LONGITUD_NOMBRE = 3;
export const MAX_LONGITUD_NOMBRE = 150;
export const MAX_LONGITUD_CORREO = 254;
export const MIN_LONGITUD_CONTRASENA = 8;
export const MAX_LONGITUD_CONTRASENA = 64;

export const MIN_LONGITUD_NOMBRE_AMBIENTE = 1;
export const MAX_LONGITUD_NOMBRE_AMBIENTE = 100;
export const MIN_CAPACIDAD_AMBIENTE = 1;
export const MAX_CAPACIDAD_AMBIENTE = 1000;
export const MIN_LONGITUD_UBICACION = 1;
export const MAX_LONGITUD_UBICACION = 100;

export const HORA_APERTURA = '07:00';
export const HORA_CIERRE = '22:00';
export const PASO_HORA_SEGUNDOS = 900;
export const MIN_LONGITUD_MOTIVO = 10;
export const MAX_LONGITUD_MOTIVO = 500;

export const TIMEOUT_PETICION_MS = 10000;
export const DEBOUNCE_BUSQUEDA_MS = 300;
export const CLAVE_SESION_MOCK = 'reservaupla_sesion_id';
