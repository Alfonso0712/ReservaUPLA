import { MENSAJES } from '../constants/mensajes';

// Convierte {estado, datos} en {errores, errorGeneral, accion}
// E-08 · E-23 · E-24
export function interpretarRespuesta(respuesta) {
  const { estado, datos } = respuesta;
  if (estado >= 200 && estado < 300) {
    return { errores: {}, errorGeneral: '', accion: 'exito', datos };
  }

  if (estado === 0) {
    return { errores: {}, errorGeneral: MENSAJES.ERROR_CONEXION, accion: 'reintentar' };
  }

  if (estado === 401) {
    return { errores: {}, errorGeneral: MENSAJES.CREDENCIALES_INVALIDAS, accion: 'reautenticar' };
  }

  if (estado === 429) {
    return { errores: {}, errorGeneral: MENSAJES.LIMITE_INTENTOS_EXCEDIDO, accion: 'esperar' };
  }

  const mensajeError = datos?.error || MENSAJES.ERROR_SERVIDOR;
  return {
    errores: datos?.errores || {},
    errorGeneral: mensajeError,
    accion: 'corregir'
  };
}
