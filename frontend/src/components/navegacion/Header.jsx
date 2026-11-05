// Nielsen 3 · Nielsen 4 · Nielsen 7 · Cabecera accesible con menú de usuario y controles · E-29 · E-37 · E-38
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { RUTAS } from '../../constants/rutas';
import ControlTamanoFuente from './ControlTamanoFuente';
import ConmutadorTema from './ConmutadorTema';
import MenuUsuario from './MenuUsuario';
import MigasDePan from './MigasDePan';
import Icono from '../ui/Icono';

export default function Header({ menuAbierto = false, alAlternarMenu, botonMenuRef }) {
  const { usuario, cerrarSesion } = useAuth();
  const navegar = useNavigate();
  const esMayorOIgual480 = useMediaQuery('(min-width: 480px)');

  const manejarCerrarSesion = async () => {
    await cerrarSesion?.();
    navegar(RUTAS.INGRESAR, { replace: true });
  };

  return (
    <header aria-label="Cabecera principal" className="sticky top-0 z-30 h-16 px-4 sm:px-6 lg:px-8 border-b border-borde bg-superficie text-texto flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          ref={botonMenuRef}
          type="button"
          onClick={alAlternarMenu}
          aria-label={menuAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-expanded={menuAbierto}
          aria-controls="menu-lateral-principal"
          className="lg:hidden h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] p-2 inline-flex items-center justify-center rounded-full border border-borde bg-superficie-2 text-texto hover:bg-fondo"
        >
          <Icono nombre={menuAbierto ? 'X' : 'Menu'} className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <MigasDePan />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
        {esMayorOIgual480 && (
          <>
            <ControlTamanoFuente />
            <ConmutadorTema />
            <div className="w-px h-6 bg-borde shrink-0" aria-hidden="true" />
          </>
        )}
        <MenuUsuario
          nombreCompleto={usuario?.nombreCompleto}
          rol={usuario?.rol}
          correo={usuario?.correo}
          onCerrarSesion={manejarCerrarSesion}
          incluirControlesAccesibilidad={!esMayorOIgual480}
        />
      </div>
    </header>
  );
}
