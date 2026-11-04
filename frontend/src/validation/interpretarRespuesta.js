// Nielsen 9 · Contrato { estado, datos } -> { ok, datos, errores, errorGeneral, accion } · E-04 · E-08 · E-09 · E-23 · E-24
import { MENSAJES } from '../constants/mensajes';

function mapearErroresServidor(errors) {
  const resultado = {};
  if (!errors || typeof errors !== 'object') return resultado;
  Object.entries(errors).forEach(([campo, lista]) => {
    const clave = campo.charAt(0).toLowerCase() + campo.slice(1);
    const primerMensaje = Array.isArray(lista) ? lista[0] : String(lista);
    if (primerMensaje) resultado[clave] = primerMensaje;
  });
  return resultado;
}

export function interpretarRespuesta(respuesta) {
  const { estado = 0, datos = null } = respuesta || {};

  if (estado >= 200 && estado < 300) {
    const payload = datos && typeof datos === 'object' && 'data' in datos ? datos.data : datos;
    return {
      ok: true,
      datos: payload,
      mensaje: datos?.message || '',
      errores: {},
      errorGeneral: '',
      accion: 'exito'
    };
  }

  if (estado === 0) {
    return { ok: false, datos: null, errores: {}, errorGeneral: MENSAJES.SIN_CONEXION, accion: 'reintentar' };
  }

  if (estado === 400) {
    const errores = mapearErroresServidor(datos?.errors);
    return {
      ok: false,
      datos: null,
      errores,
      errorGeneral: Object.keys(errores).length === 0 ? (datos?.message || MENSAJES.RESUMEN_ERRORES_FORMULARIO) : '',
      accion: 'corregir'
    };
  }

  if (estado === 401) {
    return { ok: false, datos: null, errores: {}, errorGeneral: MENSAJES.CREDENCIALES_INVALIDAS, accion: 'reautenticar' };
  }

  if (estado === 403) {
    return { ok: false, datos: null, errores: {}, errorGeneral: datos?.message || MENSAJES.ACCION_SOLO_ADMINISTRADOR, accion: 'prohibido' };
  }

  if (estado === 409) {
    const errores = mapearErroresServidor(datos?.errors);
    return {
      ok: false,
      datos: null,
      errores,
      errorGeneral: Object.keys(errores).length === 0 ? (datos?.message || MENSAJES.RESERVA_SOLAPE_HORARIO) : '',
      accion: 'conflicto'
    };
  }

  if (estado === 429) {
    return { ok: false, datos: null, errores: {}, errorGeneral: MENSAJES.LIMITE_INTENTOS, accion: 'esperar' };
  }

  return { ok: false, datos: null, errores: {}, errorGeneral: MENSAJES.ERROR_SERVIDOR, accion: 'servidor' };
}
