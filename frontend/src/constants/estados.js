// RF-07 · RN-06 · Norman · E-20 · E-21
export const ESTADOS_RESERVA = {
  PENDIENTE: 'Pendiente',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
  CANCELADA: 'Cancelada'
};

export const ESTADOS_AMBIENTE = {
  DISPONIBLE: 'Disponible',
  MANTENIMIENTO: 'En mantenimiento'
};

export const LISTA_ESTADOS_RESERVA = [
  ESTADOS_RESERVA.PENDIENTE,
  ESTADOS_RESERVA.APROBADA,
  ESTADOS_RESERVA.RECHAZADA,
  ESTADOS_RESERVA.CANCELADA
];

export const ESTADOS_FINALES = [
  ESTADOS_RESERVA.RECHAZADA,
  ESTADOS_RESERVA.CANCELADA
];

export const ICONO_POR_ESTADO = {
  [ESTADOS_RESERVA.PENDIENTE]: 'Clock',
  [ESTADOS_RESERVA.APROBADA]: 'CircleCheck',
  [ESTADOS_RESERVA.RECHAZADA]: 'CircleX',
  [ESTADOS_RESERVA.CANCELADA]: 'Ban'
};

export const QUE_SIGUE_POR_ESTADO = {
  [ESTADOS_RESERVA.PENDIENTE]: 'Esperando aprobación del administrador.',
  [ESTADOS_RESERVA.APROBADA]: 'Reserva aprobada. El ambiente está confirmado para el horario seleccionado.',
  [ESTADOS_RESERVA.RECHAZADA]: 'Estado final: la solicitud fue rechazada y no admite modificaciones.',
  [ESTADOS_RESERVA.CANCELADA]: 'Estado final: la reserva fue cancelada y no admite modificaciones.'
};
