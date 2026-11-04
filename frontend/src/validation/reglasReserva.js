// RF-03 · RF-04 · RF-07 · RN-01..06 · RV-08..16 · E-12..21
import {
  HORA_APERTURA,
  HORA_CIERRE,
  MIN_LONGITUD_MOTIVO,
  MAX_LONGITUD_MOTIVO
} from '../constants/reglas';
import { ESTADOS_RESERVA, ESTADOS_FINALES } from '../constants/estados';
import { ROLES } from '../constants/roles';
import { MENSAJES } from '../constants/mensajes';
import { normalizarTexto } from '../utils/normalizarTexto';
import { obtenerFechaHoyIso } from '../utils/formatearFecha';

export function haySolapeHorario(inicioA, finA, inicioB, finB) {
  if (!inicioA || !finA || !inicioB || !finB) return false;
  return inicioA < finB && finA > inicioB;
}

export function validarAmbienteSeleccionado(ambienteId) {
  if (!normalizarTexto(String(ambienteId ?? ''))) return MENSAJES.RESERVA_AMBIENTE_OBLIGATORIO;
  return '';
}

export function validarFechaReserva(fecha, fechaReferenciaHoy = obtenerFechaHoyIso()) {
  const limpia = normalizarTexto(fecha);
  if (!limpia) return MENSAJES.RESERVA_FECHA_OBLIGATORIA;
  if (limpia < fechaReferenciaHoy) return MENSAJES.RESERVA_FECHA_PASADA;
  return '';
}

export function validarHorarioReserva(horaInicio, horaFin) {
  const inicio = normalizarTexto(horaInicio);
  const fin = normalizarTexto(horaFin);
  if (!inicio || !fin) {
    return {
      horaInicio: !inicio ? MENSAJES.RESERVA_HORAS_OBLIGATORIAS : '',
      horaFin: !fin ? MENSAJES.RESERVA_HORAS_OBLIGATORIAS : ''
    };
  }
  if (inicio < HORA_APERTURA || inicio > HORA_CIERRE || fin < HORA_APERTURA || fin > HORA_CIERRE) {
    return { horaInicio: '', horaFin: MENSAJES.RESERVA_FUERA_DE_HORARIO };
  }
  if (fin <= inicio) {
    return { horaInicio: '', horaFin: MENSAJES.RESERVA_FIN_MAYOR_INICIO };
  }
  return { horaInicio: '', horaFin: '' };
}

export function validarMotivoReserva(motivo) {
  const limpio = normalizarTexto(motivo);
  if (!limpio) return MENSAJES.RESERVA_MOTIVO_OBLIGATORIO;
  if (limpio.length < MIN_LONGITUD_MOTIVO || limpio.length > MAX_LONGITUD_MOTIVO) {
    return MENSAJES.RESERVA_MOTIVO_LONGITUD;
  }
  return '';
}

export function verificarDisponibilidadLocal(reservas = [], { ambienteId, fecha, horaInicio, horaFin } = {}) {
  if (!ambienteId || !fecha || !horaInicio || !horaFin) return true;
  return !reservas.some((item) => {
    const idAmb = item.ambiente?.id || item.ambienteId;
    const aprobada = item.estado === ESTADOS_RESERVA.APROBADA;
    return aprobada && idAmb === ambienteId && item.fecha === fecha && haySolapeHorario(horaInicio, horaFin, item.horaInicio, item.horaFin);
  });
}

export function validarReserva(
  { ambienteId = '', fecha = '', horaInicio = '', horaFin = '', motivo = '', solicitanteId = '' } = {},
  { reservasExistentes = [], requiereSolicitante = false, fechaHoy = obtenerFechaHoyIso() } = {}
) {
  const errores = {};
  const errAmb = validarAmbienteSeleccionado(ambienteId);
  const errFecha = validarFechaReserva(fecha, fechaHoy);
  const errHoras = validarHorarioReserva(horaInicio, horaFin);
  const errMotivo = validarMotivoReserva(motivo);

  if (errAmb) errores.ambienteId = errAmb;
  if (requiereSolicitante && !normalizarTexto(String(solicitanteId ?? ''))) {
    errores.solicitanteId = MENSAJES.RESERVA_SOLICITANTE_OBLIGATORIO;
  }
  if (errFecha) errores.fecha = errFecha;
  if (errHoras.horaInicio) errores.horaInicio = errHoras.horaInicio;
  if (errHoras.horaFin) errores.horaFin = errHoras.horaFin;
  if (errMotivo) errores.motivo = errMotivo;

  if (!errores.ambienteId && !errores.fecha && !errores.horaInicio && !errores.horaFin) {
    if (!verificarDisponibilidadLocal(reservasExistentes, { ambienteId, fecha, horaInicio, horaFin })) {
      errores.horaFin = MENSAJES.RESERVA_SOLAPE_HORARIO;
    }
  }
  return { valido: Object.keys(errores).length === 0, errores };
}

export function validarTransicionEstado(estadoActual, nuevoEstado, rolUsuario) {
  if (ESTADOS_FINALES.includes(estadoActual)) {
    return { valido: false, error: MENSAJES.TRANSICION_ESTADO_NO_PERMITIDA };
  }
  if (nuevoEstado === ESTADOS_RESERVA.APROBADA || nuevoEstado === ESTADOS_RESERVA.RECHAZADA) {
    if (rolUsuario !== ROLES.ADMINISTRADOR) {
      return { valido: false, error: MENSAJES.ACCION_SOLO_ADMINISTRADOR };
    }
    if (estadoActual !== ESTADOS_RESERVA.PENDIENTE) {
      return { valido: false, error: MENSAJES.TRANSICION_ESTADO_NO_PERMITIDA };
    }
    return { valido: true, error: '' };
  }
  if (nuevoEstado === ESTADOS_RESERVA.CANCELADA) {
    if (estadoActual !== ESTADOS_RESERVA.PENDIENTE && estadoActual !== ESTADOS_RESERVA.APROBADA) {
      return { valido: false, error: MENSAJES.TRANSICION_ESTADO_NO_PERMITIDA };
    }
    return { valido: true, error: '' };
  }
  return { valido: false, error: MENSAJES.TRANSICION_ESTADO_NO_PERMITIDA };
}
