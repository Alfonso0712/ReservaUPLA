// Nielsen 1 · Nielsen 8 · Cabecera fija: migas a la izquierda, fuente y tema a la derecha, sin repetir h1 · E-29
import MigasDePan from './MigasDePan';
import ControlTamanoFuente from './ControlTamanoFuente';
import ConmutadorTema from './ConmutadorTema';
import Icono from '../ui/Icono';

export default function Header({ menuAbierto = false, alAlternarMenu, botonMenuRef }) {
  return (
    <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 lg:px-8 border-b border-borde bg-superficie text-texto flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          ref={botonMenuRef}
          type="button"
          onClick={alAlternarMenu}
          aria-label={menuAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-expanded={menuAbierto}
          aria-controls="menu-lateral-principal"
          className="lg:hidden min-h-control min-w-control p-2 inline-flex items-center justify-center rounded-control border border-borde bg-superficie-2 text-texto hover:bg-fondo"
        >
          <Icono nombre={menuAbierto ? 'X' : 'Menu'} className="w-5 h-5" />
        </button>
        <div className="truncate">
          <MigasDePan idNav="migas-cabecera" />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <ControlTamanoFuente />
        <ConmutadorTema />
      </div>
    </header>
  );
}
