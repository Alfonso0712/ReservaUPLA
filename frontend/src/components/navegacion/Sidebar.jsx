// Nielsen 1 · WCAG 2.2 AA · ISO 9241-11 · Barra lateral accesible con navegación semántica
import LogoUpla from '../ui/LogoUpla';
import ItemNavegacion from './ItemNavegacion';
import UsuarioLateral from './UsuarioLateral';
import Icono from '../ui/Icono';

export default function Sidebar({ items = [], abiertoMovil = false, alCerrarMovil }) {
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
            <button type="button" onClick={alCerrarMovil} aria-label="Cerrar menú lateral" className="lg:hidden h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] p-2 inline-flex items-center justify-center rounded-full text-lateral-texto">
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
      <UsuarioLateral alCerrarMenu={alCerrarMovil} />
    </div>
  );

  return (
    <>
      <aside aria-label="Navegación lateral" className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-40">
        {contenido}
      </aside>
      {abiertoMovil && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={alCerrarMovil} aria-hidden="true" />
          <aside aria-label="Navegación lateral móvil" className="relative z-10 h-full">
            {contenido}
          </aside>
        </div>
      )}
    </>
  );
}
