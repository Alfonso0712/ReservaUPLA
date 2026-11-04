// RF-07 · RN-06 · Norman · RV-17 · E-20 · E-21 · E-39..44 · E-52
export const ESTADOS_RESERVA = {
  PENDIENTE: 'Pendiente', APROBADA: 'Aprobada', RECHAZADA: 'Rechazada', CANCELADA: 'Cancelada'
};

export const ESTADOS_AMBIENTE = {
  DISPONIBLE: 'Disponible', MANTENIMIENTO: 'Mantenimiento', LIMPIEZA: 'Limpieza',
  REMODELACION: 'Remodelación', FUERA_DE_SERVICIO: 'Fuera de servicio'
};

export const LISTA_ESTADOS_AMBIENTE = Object.values(ESTADOS_AMBIENTE);

export const ICONO_POR_ESTADO_AMBIENTE = {
  [ESTADOS_AMBIENTE.DISPONIBLE]: 'CircleCheck', [ESTADOS_AMBIENTE.MANTENIMIENTO]: 'Wrench',
  [ESTADOS_AMBIENTE.LIMPIEZA]: 'Sparkles', [ESTADOS_AMBIENTE.REMODELACION]: 'HardHat',
  [ESTADOS_AMBIENTE.FUERA_DE_SERVICIO]: 'Ban'
};

export const VARIANTE_POR_ESTADO_AMBIENTE = {
  [ESTADOS_AMBIENTE.DISPONIBLE]: 'aprobada', [ESTADOS_AMBIENTE.MANTENIMIENTO]: 'pendiente',
  [ESTADOS_AMBIENTE.LIMPIEZA]: 'pendiente', [ESTADOS_AMBIENTE.REMODELACION]: 'pendiente',
  [ESTADOS_AMBIENTE.FUERA_DE_SERVICIO]: 'cancelada'
};

export const LISTA_ESTADOS_RESERVA = Object.values(ESTADOS_RESERVA);
export const ESTADOS_FINALES = [ESTADOS_RESERVA.RECHAZADA, ESTADOS_RESERVA.CANCELADA];

export const ICONO_POR_ESTADO = {
  [ESTADOS_RESERVA.PENDIENTE]: 'Clock', [ESTADOS_RESERVA.APROBADA]: 'CircleCheck',
  [ESTADOS_RESERVA.RECHAZADA]: 'CircleX', [ESTADOS_RESERVA.CANCELADA]: 'Ban'
};

const tono = (f, t, b) => ({ fondo: f, texto: t, borde: b, chip: `${f} ${t}`, badge: `${f} ${t} ${b}` });

export const TONOS_ESTADO = {
  [ESTADOS_RESERVA.PENDIENTE]: tono('bg-pendiente-fondo', 'text-pendiente-texto', 'border-pendiente-texto'),
  [ESTADOS_RESERVA.APROBADA]: tono('bg-aprobada-fondo', 'text-aprobada-texto', 'border-aprobada-texto'),
  [ESTADOS_RESERVA.RECHAZADA]: tono('bg-rechazada-fondo', 'text-rechazada-texto', 'border-rechazada-texto'),
  [ESTADOS_RESERVA.CANCELADA]: tono('bg-cancelada-fondo', 'text-cancelada-texto', 'border-cancelada-texto'),
  primario: tono('bg-primario-suave', 'text-primario chip-icono-primario', 'border-primario')
};

export const QUE_SIGUE_POR_ESTADO = {
  [ESTADOS_RESERVA.PENDIENTE]: 'Esperando aprobación del administrador.',
  [ESTADOS_RESERVA.APROBADA]: 'Reserva aprobada. El ambiente está confirmado para el horario seleccionado.',
  [ESTADOS_RESERVA.RECHAZADA]: 'Estado final: la solicitud fue rechazada y no admite modificaciones.',
  [ESTADOS_RESERVA.CANCELADA]: 'Estado final: la reserva fue cancelada y no admite modificaciones.'
};
