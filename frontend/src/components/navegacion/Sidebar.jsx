// Nielsen 2 · Nielsen 3 · Menú lateral simplificado con enlaces principales · E-18 · E-37
import { NavLink } from 'react-router-dom';
import { obtenerGruposPorRol } from '../../constants/navegacion';
import { useTrampaFoco } from '../../hooks/useTrampaFoco';
import { RUTAS } from '../../constants/rutas';
import LogoUpla from '../ui/LogoUpla';
import Icono from '../ui/Icono';

const ENLACES_BASE = [
  { id: 'panel', etiqueta: 'Panel', ruta: RUTAS.PANEL, icono: 'LayoutDashboard' },
  { id: 'listado-reservas', etiqueta: 'Reservas', ruta: RUTAS.RESERVAS, icono: 'CalendarDays' },
  { id: 'ambientes', etiqueta: 'Ambientes', ruta: RUTAS.AMBIENTES, icono: 'Building2' }
];

function ItemMenuLateral({ item, alCerrarMenuMovil }) {
  const base = 'w-full min-h-control px-3 py-2.5 rounded-control flex items-center gap-3 text-base font-medium transition-colors no-underline text-left';
  return (
    <NavLink
      to={item.ruta}
      onClick={() => alCerrarMenuMovil?.()}
      className={({ isActive }) => `${base} ${isActive ? 'bg-lateral-activo-fondo text-sobre-primario font-semibold border-l-4 border-acento-sobre-oscuro' : 'text-lateral-texto hover:bg-lateral-activo-fondo'}`}
    >
      <Icono nombre={item.icono} className="w-5 h-5" />
      <span>{item.etiqueta}</span>
    </NavLink>
  );
}

export default function Sidebar({ usuario, abiertoMovil = false, alCerrarMovil }) {
  const cajonRef = useTrampaFoco(abiertoMovil, alCerrarMovil);
  const items = usuario?.rol
    ? obtenerGruposPorRol(usuario.rol).flatMap((g) => g.items).filter((it) => it.id !== 'nueva-reserva')
    : ENLACES_BASE;

  const contenido = (
    <div className="flex flex-col h-full w-64 bg-lateral-fondo text-lateral-texto border-r border-borde">
      <div className="p-4 overflow-y-auto flex-1">
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-borde">
          <div className="flex items-center gap-3">
            <LogoUpla variante="lateral" />
            <div>
              <span className="block text-base font-bold text-sobre-primario leading-tight">ReservaUPLA</span>
              <span className="block text-sm text-lateral-texto">Gestión académica</span>
            </div>
          </div>
          {abiertoMovil && (
            <button
              type="button"
              onClick={alCerrarMovil}
              aria-label="Cerrar menú lateral"
              className="lg:hidden min-h-control min-w-control p-2 inline-flex items-center justify-center rounded-control text-lateral-texto"
            >
              <Icono nombre="X" className="w-5 h-5" />
            </button>
          )}
        </div>
        <nav aria-label="Navegación principal">
          <ul className="space-y-1">
            {items.map((it) => (
              <li key={it.id}>
                <ItemMenuLateral item={it} alCerrarMenuMovil={alCerrarMovil} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
  return (
    <>
      <aside className="hidden lg:block lg:sticky lg:top-0 lg:h-screen shrink-0">{contenido}</aside>
      {abiertoMovil && (
        <div className="fixed inset-0 z-40 flex lg:hidden bg-fondo">
          <aside ref={cajonRef} id="menu-lateral-principal" role="dialog" aria-modal="true" aria-label="Menú de navegación">{contenido}</aside>
        </div>
      )}
    </>
  );
}
