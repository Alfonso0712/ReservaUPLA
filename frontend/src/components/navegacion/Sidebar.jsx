// Nielsen 1 · Nielsen 2 · Nielsen 3 · Shneiderman 2 · Sidebar con navegación accesible · E-18 · E-54
import { usePermisos } from '../../hooks/usePermisos';
import { obtenerItemsPorPermiso, ITEMS_NAVEGACION } from '../../constants/navegacion';
import { useTrampaFoco } from '../../hooks/useTrampaFoco';
import ItemNavegacion from './ItemNavegacion';
import LogoUpla from '../ui/LogoUpla';
import Icono from '../ui/Icono';
import UsuarioLateral from './UsuarioLateral';

export default function Sidebar({ abiertoMovil = false, alCerrarMovil, usuario }) {
  const cajonRef = useTrampaFoco(abiertoMovil, alCerrarMovil);
  const { puede } = usePermisos();
  const items = typeof puede === 'function' ? obtenerItemsPorPermiso(puede) : ITEMS_NAVEGACION;

  const contenido = (
    <div className="flex flex-col h-full w-64 bg-lateral-fondo text-lateral-texto border-r border-borde">
      <div className="p-4 flex-1 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-borde">
          <div className="flex items-center gap-3">
            <LogoUpla variante="lateral" />
            <div>
              <span className="block text-[1.125rem] font-bold text-white leading-tight">ReservaUPLA</span>
              <span className="block text-[0.875rem] text-lateral-texto">Gestión académica</span>
            </div>
          </div>
          {abiertoMovil && (
            <button type="button" onClick={alCerrarMovil} aria-label="Cerrar menú lateral" className="lg:hidden min-h-control min-w-control p-2 inline-flex items-center justify-center rounded-control text-lateral-texto">
              <Icono nombre="X" className="w-5 h-5" />
            </button>
          )}
        </div>
        <nav aria-label="Navegación principal" className="mt-8 flex-1">
          <ul className="space-y-1">
            {items.map((it) => (
              <li key={it.id}>
                <ItemNavegacion item={it} alCerrarMenuMovil={alCerrarMovil} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <UsuarioLateral alCerrarMenu={alCerrarMovil} usuario={usuario} />
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
