// Nielsen 2 · Nielsen 4 · ISO 9241-110 · E-31
import { ROLES } from './roles';
import { RUTAS } from './rutas';

export const GRUPOS_NAVEGACION = [
  {
    id: 'resumen',
    titulo: 'Resumen',
    items: [
      {
        id: 'panel',
        etiqueta: 'Panel',
        ruta: RUTAS.PANEL,
        icono: 'LayoutDashboard',
        roles: [ROLES.ADMINISTRADOR, ROLES.RESPONSABLE, ROLES.SOLICITANTE]
      }
    ]
  },
  {
    id: 'reservas',
    titulo: 'Reservas',
    items: [
      {
        id: 'listado-reservas',
        etiqueta: 'Reservas',
        ruta: RUTAS.RESERVAS,
        icono: 'CalendarDays',
        roles: [ROLES.ADMINISTRADOR, ROLES.RESPONSABLE, ROLES.SOLICITANTE]
      },
      {
        id: 'nueva-reserva',
        etiqueta: 'Nueva reserva',
        accion: 'abrirModalReserva',
        icono: 'CalendarPlus',
        roles: [ROLES.ADMINISTRADOR, ROLES.SOLICITANTE]
      }
    ]
  },
  {
    id: 'catalogo',
    titulo: 'Catálogo',
    items: [
      {
        id: 'ambientes',
        etiqueta: 'Ambientes',
        ruta: RUTAS.AMBIENTES,
        icono: 'Building2',
        roles: [ROLES.ADMINISTRADOR, ROLES.RESPONSABLE, ROLES.SOLICITANTE]
      }
    ]
  }
];

export function obtenerGruposPorRol(rol) {
  return GRUPOS_NAVEGACION.map((grupo) => ({
    ...grupo,
    items: grupo.items.filter((item) => item.roles.includes(rol))
  })).filter((grupo) => grupo.items.length > 0);
}
