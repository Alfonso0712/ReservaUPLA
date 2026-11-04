// RF-01 · RV-01 · RV-02 · RV-03 · Nielsen 5 · E-01..08
import {
  PATRON_CORREO_INSTITUCIONAL,
  PATRON_NOMBRE_COMPLETO,
  MIN_LONGITUD_NOMBRE,
  MAX_LONGITUD_NOMBRE,
  MAX_LONGITUD_CORREO,
  MIN_LONGITUD_CONTRASENA,
  MAX_LONGITUD_CONTRASENA
} from '../constants/reglas';
import { MENSAJES } from '../constants/mensajes';
import { normalizarCorreo, normalizarTexto } from '../utils/normalizarTexto';

export function validarCorreoInstitucional(correo) {
  const limpio = normalizarCorreo(correo);
  if (!limpio) return MENSAJES.CORREO_OBLIGATORIO;
  if (limpio.length > MAX_LONGITUD_CORREO) return MENSAJES.CORREO_LONGITUD_MAXIMA;
  if (!PATRON_CORREO_INSTITUCIONAL.test(limpio)) return MENSAJES.CORREO_FORMATO_INVALIDO;
  return '';
}

export function validarNombreCompleto(nombre) {
  const limpio = normalizarTexto(nombre);
  if (!limpio) return MENSAJES.NOMBRE_OBLIGATORIO;
  if (limpio.length < MIN_LONGITUD_NOMBRE || limpio.length > MAX_LONGITUD_NOMBRE) {
    return MENSAJES.NOMBRE_LONGITUD_INVALIDA;
  }
  if (!PATRON_NOMBRE_COMPLETO.test(limpio)) return MENSAJES.NOMBRE_FORMATO_INVALIDO;
  return '';
}

export function validarContrasenaLogin(contrasena) {
  if (!contrasena || typeof contrasena !== 'string') return MENSAJES.CONTRASENA_OBLIGATORIA;
  if (contrasena.length > MAX_LONGITUD_CONTRASENA) return MENSAJES.CONTRASENA_LONGITUD_INVALIDA;
  return '';
}

export function validarContrasenaRegistro(contrasena) {
  if (!contrasena || typeof contrasena !== 'string') return MENSAJES.CONTRASENA_OBLIGATORIA;
  if (contrasena.length < MIN_LONGITUD_CONTRASENA || contrasena.length > MAX_LONGITUD_CONTRASENA) {
    return MENSAJES.CONTRASENA_LONGITUD_INVALIDA;
  }
  return '';
}

export function validarLogin({ correo = '', contrasena = '' } = {}) {
  const errores = {};
  const errorCorreo = validarCorreoInstitucional(correo);
  const errorContrasena = validarContrasenaLogin(contrasena);
  if (errorCorreo) errores.correo = errorCorreo;
  if (errorContrasena) errores.contrasena = errorContrasena;
  return { valido: Object.keys(errores).length === 0, errores, correoNormalizado: normalizarCorreo(correo) };
}

export function validarRegistroSolicitante({ nombreCompleto = '', correo = '', contrasena = '' } = {}) {
  const errores = {};
  const errorNombre = validarNombreCompleto(nombreCompleto);
  const errorCorreo = validarCorreoInstitucional(correo);
  const errorContrasena = validarContrasenaRegistro(contrasena);
  if (errorNombre) errores.nombreCompleto = errorNombre;
  if (errorCorreo) errores.correo = errorCorreo;
  if (errorContrasena) errores.contrasena = errorContrasena;
  return {
    valido: Object.keys(errores).length === 0,
    errores,
    datosNormalizados: {
      nombreCompleto: normalizarTexto(nombreCompleto),
      correo: normalizarCorreo(correo),
      contrasena
    }
  };
}
