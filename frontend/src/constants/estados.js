// RF-07 · RN-06 · Norman · RV-17 · E-20 · E-21 · E-39..44
export const ESTADOS_RESERVA = {
  PENDIENTE: 'Pendiente',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
  CANCELADA: 'Cancelada'
};

export const ESTADOS_AMBIENTE = {
  DISPONIBLE: 'Disponible',
  MANTENIMIENTO: 'Mantenimiento',
  LIMPIEZA: 'Limpieza',
  REMODELACION: 'Remodelación',
  FUERA_DE_SERVICIO: 'Fuera de servicio'
};

export const LISTA_ESTADOS_AMBIENTE = [
  ESTADOS_AMBIENTE.DISPONIBLE,
  ESTADOS_AMBIENTE.MANTENIMIENTO,
  ESTADOS_AMBIENTE.LIMPIEZA,
  ESTADOS_AMBIENTE.REMODELACION,
  ESTADOS_AMBIENTE.FUERA_DE_SERVICIO
];

export const ICONO_POR_ESTADO_AMBIENTE = {
  [ESTADOS_AMBIENTE.DISPONIBLE]: 'CircleCheck',
  [ESTADOS_AMBIENTE.MANTENIMIENTO]: 'Wrench',
  [ESTADOS_AMBIENTE.LIMPIEZA]: 'Sparkles',
  [ESTADOS_AMBIENTE.REMODELACION]: 'HardHat',
  [ESTADOS_AMBIENTE.FUERA_DE_SERVICIO]: 'Ban'
};

export const VARIANTE_POR_ESTADO_AMBIENTE = {
  [ESTADOS_AMBIENTE.DISPONIBLE]: 'aprobada',
  [ESTADOS_AMBIENTE.MANTENIMIENTO]: 'pendiente',
  [ESTADOS_AMBIENTE.LIMPIEZA]: 'pendiente',
  [ESTADOS_AMBIENTE.REMODELACION]: 'pendiente',
  [ESTADOS_AMBIENTE.FUERA_DE_SERVICIO]: 'cancelada'
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
