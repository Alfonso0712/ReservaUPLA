// Constantes y contenido textual de la guía y normativa de ambientes
export const INTRODUCCION_GUIA = 'Antes de solicitar un ambiente, revise las reglas que aplica el sistema.';

export const REGLAS_NORMATIVA = [
  {
    numero: 1,
    icono: 'Clock',
    colorIcono: 'bg-primario-suave text-primario dark:text-primario-enlace',
    colorBarra: 'border-l-primario',
    titulo: 'Horario de atención',
    descripcion: 'Las reservas solo pueden hacerse entre las 07:00 y las 22:00 horas.'
  },
  {
    numero: 2,
    icono: 'CalendarCheck',
    colorIcono: 'bg-aprobada-fondo text-aprobada-texto',
    colorBarra: 'border-l-aprobada-texto',
    titulo: 'Horario válido',
    descripcion: 'La hora de fin debe ser posterior a la hora de inicio.'
  },
  {
    numero: 3,
    icono: 'Layers',
    colorIcono: 'bg-pendiente-fondo text-pendiente-texto',
    colorBarra: 'border-l-pendiente-texto',
    titulo: 'Sin cruces',
    descripcion: 'No puede existir más de una reserva aprobada para el mismo ambiente, fecha y horario.'
  },
  {
    numero: 4,
    icono: 'ClipboardList',
    colorIcono: 'bg-primario-suave text-primario dark:text-primario-enlace',
    colorBarra: 'border-l-primario',
    titulo: 'Datos obligatorios',
    descripcion: 'Toda solicitud debe indicar fecha, hora de inicio, hora de fin, ambiente, solicitante y motivo.'
  },
  {
    numero: 5,
    icono: 'ShieldCheck',
    colorIcono: 'bg-aprobada-fondo text-aprobada-texto',
    colorBarra: 'border-l-aprobada-texto',
    titulo: 'Aprobación',
    descripcion: 'Solo el administrador puede aprobar o rechazar una reserva.'
  },
  {
    numero: 6,
    icono: 'Lock',
    colorIcono: 'bg-rechazada-fondo text-rechazada-texto',
    colorBarra: 'border-l-rechazada-texto',
    titulo: 'Reservas rechazadas',
    descripcion: 'Una reserva rechazada no puede modificarse.'
  }
];
