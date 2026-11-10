// Barra de navegación pegajosa, responsiva y accesible para la Landing Page
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RUTAS } from '../../constants/rutas';
import { ENLACES_NAV_LANDING } from '../../constants/datosLanding';
import LogoUpla from '../ui/LogoUpla';
import Icono from '../ui/Icono';
import ConmutadorTema from '../navegacion/ConmutadorTema';

export default function NavbarLanding() {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-borde bg-superficie/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Marca institucional */}
        <Link
          to="/"
          className="flex items-center gap-3 rounded-control focus-visible:outline-primario"
          aria-label="ReservaUPLA - Inicio"
        >
          <LogoUpla variante="lateral" />
          <div className="leading-tight">
            <span className="block text-base font-bold text-texto tracking-tight">ReservaUPLA</span>
            <span className="block text-xs text-texto-suave">Gestión académica</span>
          </div>
        </Link>

        {/* Enlaces de ancla (escritorio) */}
        <nav aria-label="Navegación de secciones" className="hidden md:flex items-center gap-6">
          {ENLACES_NAV_LANDING.map((enlace) => (
            <a
              key={enlace.href}
              href={enlace.href}
              className="text-sm font-medium text-texto-suave hover:text-primario-enlace transition-colors"
            >
              {enlace.etiqueta}
            </a>
          ))}
        </nav>

        {/* Acciones de cabecera (escritorio) */}
        <div className="hidden md:flex items-center gap-3">
          <ConmutadorTema />
          <Link
            to={RUTAS.REGISTRO}
            className="h-10 inline-flex items-center justify-center px-4 rounded-control border border-borde bg-superficie text-texto hover:bg-superficie-2 hover:border-borde-control text-sm font-semibold transition-colors"
          >
            Registrarse
          </Link>
          <Link
            to={RUTAS.INGRESAR}
            className="h-10 inline-flex items-center justify-center px-4 rounded-control bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] text-sm font-semibold transition-colors shadow-sm"
          >
            Iniciar sesión
          </Link>
        </div>

        {/* Botón de menú móvil */}
        <div className="flex md:hidden items-center gap-2">
          <ConmutadorTema />
          <button
            type="button"
            onClick={() => setMenuMovilAbierto((prev) => !prev)}
            aria-expanded={menuMovilAbierto}
            aria-label={menuMovilAbierto ? 'Cerrar menú' : 'Abrir menú'}
            className="h-10 w-10 inline-flex items-center justify-center rounded-control border border-borde bg-superficie text-texto hover:bg-superficie-2"
          >
            <Icono nombre={menuMovilAbierto ? 'X' : 'Menu'} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Menú desplegable en móvil */}
      {menuMovilAbierto && (
        <div className="md:hidden border-t border-borde bg-superficie px-4 py-4 space-y-3">
          <nav aria-label="Navegación móvil de secciones" className="flex flex-col space-y-2">
            {ENLACES_NAV_LANDING.map((enlace) => (
              <a
                key={enlace.href}
                href={enlace.href}
                onClick={() => setMenuMovilAbierto(false)}
                className="py-2 text-sm font-medium text-texto-suave hover:text-primario-enlace"
              >
                {enlace.etiqueta}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-borde flex flex-col gap-2">
            <Link
              to={RUTAS.REGISTRO}
              onClick={() => setMenuMovilAbierto(false)}
              className="w-full h-10 inline-flex items-center justify-center rounded-control border border-borde bg-superficie text-texto text-sm font-semibold"
            >
              Registrarse
            </Link>
            <Link
              to={RUTAS.INGRESAR}
              onClick={() => setMenuMovilAbierto(false)}
              className="w-full h-10 inline-flex items-center justify-center rounded-control bg-[var(--color-brand)] text-white text-sm font-semibold"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
