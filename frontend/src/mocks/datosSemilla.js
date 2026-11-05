// Datos semilla en memoria para el adaptador mock · RF-01..08
import { ROLES } from '../constants/roles';
import { ESTADOS_RESERVA, ESTADOS_AMBIENTE } from '../constants/estados';
import { TIPOS_AMBIENTE } from '../constants/tiposAmbiente';

export const CUENTAS_DEMO = [
  { etiqueta: 'Administrador', rol: ROLES.ADMINISTRADOR, correo: 'admin@upla.edu.pe', contrasenaDemo: 'AdminUpla2026!' },
  { etiqueta: 'Responsable', rol: ROLES.RESPONSABLE, correo: 'responsable@upla.edu.pe', contrasenaDemo: 'RespUpla2026!' },
  { etiqueta: 'Solicitante', rol: ROLES.SOLICITANTE, correo: 'solicitante@upla.edu.pe', contrasenaDemo: 'SolicUpla2026!' }
];

export const CLAVES_MOCK = {
  'admin@upla.edu.pe': 'AdminUpla2026!',
  'responsable@upla.edu.pe': 'RespUpla2026!',
  'solicitante@upla.edu.pe': 'SolicUpla2026!',
  'lgomez@upla.edu.pe': 'SolicUpla2026!'
};

export const USUARIOS_SEMILLA = [
  { id: 'usr-admin', nombreCompleto: 'Carlos Mendoza Quispe', correo: 'admin@upla.edu.pe', rol: ROLES.ADMINISTRADOR, activo: true, tema: 'claro', tamanoLetra: 'normal' },
  { id: 'usr-resp', nombreCompleto: 'Elena Huamán Rojas', correo: 'responsable@upla.edu.pe', rol: ROLES.RESPONSABLE, activo: true, tema: 'claro', tamanoLetra: 'normal' },
  { id: 'usr-solic', nombreCompleto: 'Marco Paredes Castro', correo: 'solicitante@upla.edu.pe', rol: ROLES.SOLICITANTE, activo: true, tema: 'claro', tamanoLetra: 'normal' },
  { id: 'usr-solic-2', nombreCompleto: 'Lucía Gómez Soto', correo: 'lgomez@upla.edu.pe', rol: ROLES.SOLICITANTE, activo: true, tema: 'claro', tamanoLetra: 'normal' }
];

export const AMBIENTES_SEMILLA = [
  { id: 'amb-1', nombre: 'Laboratorio de Cómputo 101', tipo: TIPOS_AMBIENTE.LABORATORIO_COMPUTO, capacidad: 40, ubicacion: 'Pabellón B, 3er piso', estado: ESTADOS_AMBIENTE.DISPONIBLE, responsableId: 'usr-resp', responsableNombre: 'Elena Huamán Rojas' },
  { id: 'amb-2', nombre: 'Auditorio Central UPLA', tipo: TIPOS_AMBIENTE.AUDITORIO, capacidad: 250, ubicacion: 'Pabellón A, 1er piso', estado: ESTADOS_AMBIENTE.DISPONIBLE, responsableId: 'usr-resp', responsableNombre: 'Elena Huamán Rojas' },
  { id: 'amb-3', nombre: 'Sala de Reuniones Decanato', tipo: TIPOS_AMBIENTE.SALA_REUNIONES, capacidad: 20, ubicacion: 'Pabellón C, 2do piso', estado: ESTADOS_AMBIENTE.DISPONIBLE, responsableId: '', responsableNombre: 'Sin asignar' },
  { id: 'amb-4', nombre: 'Laboratorio de Redes y Telecomunicaciones', tipo: TIPOS_AMBIENTE.LABORATORIO_ESPECIALIZADO, capacidad: 30, ubicacion: 'Pabellón B, 4to piso', estado: ESTADOS_AMBIENTE.DISPONIBLE, responsableId: 'usr-resp', responsableNombre: 'Elena Huamán Rojas' }
];

export const RESERVAS_SEMILLA = [
  { id: 'res-1', fecha: '2026-11-15', horaInicio: '10:00', horaFin: '12:00', motivo: 'Práctica calificada de Construcción de Software con estudiantes del IX ciclo.', estado: ESTADOS_RESERVA.APROBADA, solicitante: { id: 'usr-solic', nombreCompleto: 'Marco Paredes Castro', correo: 'solicitante@upla.edu.pe' }, ambiente: { id: 'amb-1', nombre: 'Laboratorio de Cómputo 101', tipo: TIPOS_AMBIENTE.LABORATORIO_COMPUTO }, fechaRegistro: '2026-11-01T09:00:00Z' },
  { id: 'res-2', fecha: '2026-11-16', horaInicio: '08:00', horaFin: '10:00', motivo: 'Taller de pruebas automatizadas y aseguramiento de calidad de software.', estado: ESTADOS_RESERVA.PENDIENTE, solicitante: { id: 'usr-solic', nombreCompleto: 'Marco Paredes Castro', correo: 'solicitante@upla.edu.pe' }, ambiente: { id: 'amb-1', nombre: 'Laboratorio de Cómputo 101', tipo: TIPOS_AMBIENTE.LABORATORIO_COMPUTO }, fechaRegistro: '2026-11-02T10:30:00Z' },
  { id: 'res-3', fecha: '2026-11-17', horaInicio: '15:00', horaFin: '18:00', motivo: 'Conferencia magistral de arquitectura de software para la facultad de ingeniería.', estado: ESTADOS_RESERVA.PENDIENTE, solicitante: { id: 'usr-solic-2', nombreCompleto: 'Lucía Gómez Soto', correo: 'lgomez@upla.edu.pe' }, ambiente: { id: 'amb-2', nombre: 'Auditorio Central UPLA', tipo: TIPOS_AMBIENTE.AUDITORIO }, fechaRegistro: '2026-11-02T14:15:00Z' },
  { id: 'res-4', fecha: '2026-11-12', horaInicio: '09:00', horaFin: '11:00', motivo: 'Coordinación de acreditación académica del comité curricular de ingeniería.', estado: ESTADOS_RESERVA.RECHAZADA, solicitante: { id: 'usr-solic', nombreCompleto: 'Marco Paredes Castro', correo: 'solicitante@upla.edu.pe' }, ambiente: { id: 'amb-3', nombre: 'Sala de Reuniones Decanato', tipo: TIPOS_AMBIENTE.SALA_REUNIONES }, fechaRegistro: '2026-11-01T16:00:00Z' },
  { id: 'res-5', fecha: '2026-11-18', horaInicio: '14:00', horaFin: '16:00', motivo: 'Simulación de topologías de red empresarial para el curso de redes.', estado: ESTADOS_RESERVA.CANCELADA, solicitante: { id: 'usr-solic', nombreCompleto: 'Marco Paredes Castro', correo: 'solicitante@upla.edu.pe' }, ambiente: { id: 'amb-4', nombre: 'Laboratorio de Redes y Telecomunicaciones', tipo: TIPOS_AMBIENTE.LABORATORIO_ESPECIALIZADO }, fechaRegistro: '2026-11-03T08:00:00Z' }
];
