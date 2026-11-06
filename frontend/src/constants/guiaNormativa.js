// Constantes y contenido textual de la guía y normativa de ambientes
export const INTRODUCCION_GUIA = 'Antes de solicitar un ambiente, revise las reglas que aplica el sistema.';

export const REGLAS_NORMATIVA = [
  {
    numero: 1,
    titulo: 'Horario de atención',
    descripcion: 'Las reservas solo pueden hacerse entre las 07:00 y las 22:00 horas.'
  },
  {
    numero: 2,
    titulo: 'Horario válido',
    descripcion: 'La hora de fin debe ser posterior a la hora de inicio.'
  },
  {
    numero: 3,
    titulo: 'Sin cruces',
    descripcion: 'No puede existir más de una reserva aprobada para el mismo ambiente, fecha y horario.'
  },
  {
    numero: 4,
    titulo: 'Datos obligatorios',
    descripcion: 'Toda solicitud debe indicar fecha, hora de inicio, hora de fin, ambiente, solicitante y motivo.'
  },
  {
    numero: 5,
    titulo: 'Aprobación',
    descripcion: 'Solo el administrador puede aprobar o rechazar una reserva.'
  },
  {
    numero: 6,
    titulo: 'Reservas rechazadas',
    descripcion: 'Una reserva rechazada no puede modificarse.'
  }
];
