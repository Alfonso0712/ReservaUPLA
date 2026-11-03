import {
  MIN_LONGITUD_NOMBRE,
  MAX_LONGITUD_NOMBRE,
  MAX_LONGITUD_CORREO,
  MIN_LONGITUD_CONTRASENA,
  MAX_LONGITUD_CONTRASENA,
  REGEX_NOMBRE,
  REGEX_CORREO
} from '../constants/reglas';
import { MENSAJES } from '../constants/mensajes';
import { normalizarCorreo, normalizarTexto } from './normalizar';

// RV-01 · RV-02 · RV-03 · E-01 a E-06
export function validarRegistroUsuario({ nombreCompleto, correo, contrasena }) {
  const errores = {};
  const nombreLimpio = normalizarTexto(nombreCompleto);
  const correoLimpio = normalizarCorreo(correo);

  if (!nombreLimpio) {
    errores.nombreCompleto = MENSAJES.NOMBRE_REQUERIDO;
  } else if (nombreLimpio.length < MIN_LONGITUD_NOMBRE || nombreLimpio.length > MAX_LONGITUD_NOMBRE) {
    errores.nombreCompleto = MENSAJES.NOMBRE_LONGITUD;
  } else if (!REGEX_NOMBRE.test(nombreLimpio)) {
    errores.nombreCompleto = MENSAJES.NOMBRE_FORMATO;
  }

  if (!correoLimpio) {
    errores.correo = MENSAJES.CORREO_REQUERIDO;
  } else if (correoLimpio.length > MAX_LONGITUD_CORREO || !REGEX_CORREO.test(correoLimpio)) {
    errores.correo = MENSAJES.CORREO_INVALIDO;
  }

  if (!contrasena) {
    errores.contrasena = MENSAJES.CONTRASENA_REQUERIDA;
  } else if (contrasena.length < MIN_LONGITUD_CONTRASENA || contrasena.length > MAX_LONGITUD_CONTRASENA) {
    errores.contrasena = MENSAJES.CONTRASENA_LONGITUD;
  }

  return { valido: Object.keys(errores).length === 0, errores };
}
