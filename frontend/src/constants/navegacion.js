// Configuración centralizada de navegación derivada de permisos · E-45..46
import { RUTAS } from './rutas';
import { PERMISOS } from './permisos';
import { obtenerPermisosDeRol } from '../mocks/permisosPorRol';

export const ITEMS_NAVEGACION = Object.freeze([
  {
    id: 'panel',
    etiqueta: 'Panel',
    ruta: RUTAS.PANEL,
    icono: 'LayoutDashboard',
    permiso: PERMISOS.DASHBOARD_VER
  },
  {
    id: 'reservas',
    etiqueta: 'Reservas',
    ruta: RUTAS.RESERVAS,
    icono: 'CalendarDays',
    permiso: PERMISOS.RESERVAS_VER
  },
  {
    id: 'ambientes',
    etiqueta: 'Ambientes',
    ruta: RUTAS.AMBIENTES,
    icono: 'Building2',
    permiso: PERMISOS.AMBIENTES_VER
  }
]);

export function obtenerItemsPorPermiso(puede) {
  if (typeof puede !== 'function') return [];
  return ITEMS_NAVEGACION.filter((item) => puede(item.permiso));
}

// Compatibilidad retroactiva para suite de pruebas existente (E-31)
export function obtenerGruposPorRol(rol) {
  const permisos = obtenerPermisosDeRol(rol);
  const tieneNueva = permisos.includes(PERMISOS.RESERVAS_CREAR);
  return [
    {
      id: 'principal',
      titulo: '',
      items: [
        { id: 'panel', etiqueta: 'Panel', ruta: RUTAS.PANEL, permiso: PERMISOS.DASHBOARD_VER },
        { id: 'listado-reservas', etiqueta: 'Reservas', ruta: RUTAS.RESERVAS, permiso: PERMISOS.RESERVAS_VER },
        ...(tieneNueva ? [{ id: 'nueva-reserva', etiqueta: 'Nueva reserva', permiso: PERMISOS.RESERVAS_CREAR }] : []),
        { id: 'ambientes', etiqueta: 'Ambientes', ruta: RUTAS.AMBIENTES, permiso: PERMISOS.AMBIENTES_VER }
      ]
    }
  ];
}
