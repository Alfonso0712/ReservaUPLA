import {
  HORA_APERTURA,
  HORA_CIERRE,
  MIN_LONGITUD_MOTIVO,
  MAX_LONGITUD_MOTIVO
} from '../constants/reglas';
import { MENSAJES } from '../constants/mensajes';
import { normalizarTexto } from './normalizar';

// RV-08 a RV-12 · RN-03 · RN-04 · E-13 a E-16
export function validarReserva({ ambienteId, fecha, horaInicio, horaFin, motivo }) {
  const errores = {};
  const hoyStr = new Date().toISOString().split('T')[0];
  const motivoLimpio = normalizarTexto(motivo);

  if (!ambienteId) errores.ambienteId = MENSAJES.AMBIENTE_NO_EXISTE;

  if (!fecha) {
    errores.fecha = MENSAJES.FECHA_REQUERIDA;
  } else if (fecha < hoyStr) {
    errores.fecha = MENSAJES.FECHA_PASADA;
  }

  if (!horaInicio || !horaFin) {
    errores.horas = MENSAJES.HORAS_REQUERIDAS;
  } else if (horaFin <= horaInicio) {
    errores.horaFin = MENSAJES.FIN_MAYOR_INICIO;
  } else if (horaInicio < HORA_APERTURA || horaFin > HORA_CIERRE) {
    errores.horas = MENSAJES.RANGO_HORARIO_INVALIDO;
  }

  if (!motivoLimpio || motivoLimpio.length < MIN_LONGITUD_MOTIVO || motivoLimpio.length > MAX_LONGITUD_MOTIVO) {
    errores.motivo = MENSAJES.MOTIVO_LONGITUD;
  }

  return { valido: Object.keys(errores).length === 0, errores };
}
