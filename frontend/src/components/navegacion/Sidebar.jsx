// Nielsen 2 · Nielsen 3 · Menú lateral fijo por rol con pie de usuario y Cerrar sesión siempre visible · E-18 · E-25
import { NavLink } from 'react-router-dom';
import { obtenerGruposPorRol } from '../../constants/navegacion';
import { useTrampaFoco } from '../../hooks/useTrampaFoco';
import LogoUpla from '../ui/LogoUpla';
import Icono from '../ui/Icono';

function ItemMenuLateral({ item, alAbrirNuevaReserva, alCerrarMenuMovil }) {
  const base = 'w-full min-h-control px-3 py-2.5 rounded-control flex items-center gap-3 text-base font-medium transition-colors no-underline text-left';
  if (item.accion === 'abrirModalReserva') {
    return (
      <button type="button" onClick={() => { alCerrarMenuMovil?.(); alAbrirNuevaReserva?.(); }} className={`${base} text-lateral-texto hover:bg-lateral-activo-fondo`}>
        <Icono nombre={item.icono} className="w-5 h-5" /><span>{item.etiqueta}</span>
      </button>
    );
  }
  return (
    <NavLink to={item.ruta} onClick={() => alCerrarMenuMovil?.()} className={({ isActive }) => `${base} ${isActive ? 'bg-lateral-activo-fondo text-sobre-primario font-semibold border-l-4 border-acento-sobre-oscuro' : 'text-lateral-texto hover:bg-lateral-activo-fondo'}`}>
      <Icono nombre={item.icono} className="w-5 h-5" /><span>{item.etiqueta}</span>
    </NavLink>
  );
}

export default function Sidebar({ usuario, abiertoMovil = false, alCerrarMovil, alAbrirNuevaReserva, alCerrarSesion }) {
  const grupos = obtenerGruposPorRol(usuario?.rol);
  const cajonRef = useTrampaFoco(abiertoMovil, alCerrarMovil);
  const contenido = (
    <div className="flex flex-col justify-between h-full w-64 bg-lateral-fondo text-lateral-texto border-r border-borde">
      <div className="p-4 overflow-y-auto">
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-borde">
          <div className="flex items-center gap-3">
            <LogoUpla variante="lateral" />
            <div><span className="block text-base font-bold text-sobre-primario leading-tight">ReservaUPLA</span><span className="block text-sm text-lateral-texto">Gestión académica</span></div>
          </div>
          {abiertoMovil && <button type="button" onClick={alCerrarMovil} aria-label="Cerrar menú lateral" className="lg:hidden min-h-control min-w-control p-2 inline-flex items-center justify-center rounded-control text-lateral-texto"><Icono nombre="X" className="w-5 h-5" /></button>}
        </div>
        <nav aria-label="Navegación principal" className="space-y-5">
          {grupos.map((g) => (
            <div key={g.id}>
              <p className="px-3 mb-1.5 text-sm font-semibold text-lateral-texto">{g.titulo}</p>
              <ul className="space-y-1">{g.items.map((it) => <li key={it.id}><ItemMenuLateral item={it} alAbrirNuevaReserva={alAbrirNuevaReserva} alCerrarMenuMovil={alCerrarMovil} /></li>)}</ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-borde space-y-3">
        <div className="px-3 py-2 rounded-control bg-lateral-activo-fondo">
          <p className="text-sm font-semibold text-sobre-primario truncate">{usuario?.nombreCompleto || 'Usuario UPLA'}</p>
          <p className="text-sm text-lateral-texto">{usuario?.rol || 'Solicitante'}</p>
        </div>
        <button type="button" onClick={alCerrarSesion} className="w-full min-h-control px-3 py-2.5 rounded-control border border-borde text-sobre-primario hover:bg-lateral-activo-fondo inline-flex items-center justify-center gap-2 text-base font-semibold">
          <Icono nombre="LogOut" className="w-5 h-5" /><span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
  return (
    <>
      <aside className="hidden lg:block lg:sticky lg:top-0 lg:h-screen shrink-0">{contenido}</aside>
      {abiertoMovil && <div className="fixed inset-0 z-40 flex lg:hidden bg-fondo"><aside ref={cajonRef} id="menu-lateral-principal" role="dialog" aria-modal="true" aria-label="Menú de navegación">{contenido}</aside></div>}
    </>
  );
}
