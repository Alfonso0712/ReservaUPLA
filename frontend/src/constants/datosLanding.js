// Datos estáticos y textos descriptivos de la Landing Page pública de ReservaUPLA
export const ENLACES_NAV_LANDING = [
  { href: '#que-es', etiqueta: 'Qué es' },
  { href: '#como-funciona', etiqueta: 'Cómo funciona' },
  { href: '#ambientes', etiqueta: 'Ambientes' },
  { href: '#reglas', etiqueta: 'Reglas' }
];

export const INSIGNIAS_HERO = [
  {
    id: 'cruces',
    titulo: 'Validación de cruces',
    descripcion: 'Sin solapes de horario',
    icono: 'Check'
  },
  {
    id: 'horario',
    titulo: 'Horario académico',
    descripcion: 'De 07:00 a 22:00 h',
    icono: 'Clock'
  },
  {
    id: 'estados',
    titulo: 'Trazabilidad en vivo',
    descripcion: 'Control por estados',
    icono: 'CircleCheck'
  }
];

export const PASOS_COMO_FUNCIONA = [
  {
    paso: 1,
    titulo: 'Solicitar ambiente',
    descripcion: 'Seleccione el ambiente académico, la fecha programada y el intervalo horario, indicando el motivo de la sesión académica.',
    icono: 'CalendarPlus'
  },
  {
    paso: 2,
    titulo: 'Validar disponibilidad',
    descripcion: 'El sistema corrobora automáticamente la franja horaria permitida (07:00 a 22:00) y descarta cualquier traslape con reservas vigentes.',
    icono: 'Clock'
  },
  {
    paso: 3,
    titulo: 'Aprobación y seguimiento',
    descripcion: 'El administrador o responsable asignado evalúa la solicitud. Puede comprobar el estado de su reserva en cualquier momento.',
    icono: 'CircleCheck'
  }
];

export const AMBIENTES_LANDING = [
  {
    id: 'computo',
    tipo: 'Laboratorios de cómputo',
    descripcion: 'Estaciones de trabajo de alto rendimiento con software especializado y conectividad para prácticas de ingeniería y ciencias.',
    capacidad: '30 a 50 personas',
    icono: 'Monitor'
  },
  {
    id: 'especializados',
    tipo: 'Laboratorios especializados',
    descripcion: 'Espacios acondicionados con hardware técnico, instrumentación y redes dedicadas a formación práctica avanzada.',
    capacidad: '20 a 40 personas',
    icono: 'FlaskConical'
  },
  {
    id: 'auditorios',
    tipo: 'Auditorios institucionales',
    descripcion: 'Recintos de gran aforo con sistemas multimedia y acústica profesional para simposios, conferencias y ceremonias.',
    capacidad: '100 a 300 personas',
    icono: 'Presentation'
  },
  {
    id: 'reuniones',
    tipo: 'Salas de reuniones',
    descripcion: 'Ambientes diseñados para sustentaciones de tesis, comités de facultad, trabajo colegiado y sesiones directivas.',
    capacidad: '12 a 25 personas',
    icono: 'Users'
  }
];

export const REGLAS_LANDING = [
  {
    id: 'r1',
    numero: '01',
    titulo: 'Horario institucional de 07:00 a 22:00',
    descripcion: 'Las reservas se programan estrictamente dentro de la jornada autorizada. Cualquier solicitud fuera de este marco es rechazada.',
    icono: 'Clock'
  },
  {
    id: 'r2',
    numero: '02',
    titulo: 'Sin cruces entre reservas aprobadas',
    descripcion: 'No se permite aprobar dos reservas en el mismo ambiente y horario. El sistema valida preventivamente cada coincidencia temporal.',
    icono: 'Ban'
  },
  {
    id: 'r3',
    numero: '03',
    titulo: 'Datos y justificación obligatorios',
    descripcion: 'Toda solicitud exige indicar ambiente, fecha válida, horario coherente (inicio anterior al fin) y motivo pedagógico explícito.',
    icono: 'Check'
  },
  {
    id: 'r4',
    numero: '04',
    titulo: 'Evaluación por roles designados',
    descripcion: 'Únicamente el Administrador general y el Responsable asignado al ambiente poseen atribuciones para aprobar o rechazar solicitudes.',
    icono: 'CircleCheck'
  },
  {
    id: 'r5',
    numero: '05',
    titulo: 'Estado final irreversible',
    descripcion: 'Una reserva rechazada o cancelada concluye su ciclo de vida y no puede ser reabierta ni modificada en el sistema.',
    icono: 'CircleX'
  }
];
