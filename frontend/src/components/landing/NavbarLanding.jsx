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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#071c3d]/95 backdrop-blur-md text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Marca institucional */}
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById('inicio');
            if (el?.scrollIntoView) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else if (typeof window !== 'undefined' && window.scrollTo) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-3 rounded-control focus-visible:outline-white cursor-pointer no-underline"
          aria-label="ReservaUPLA - Inicio"
        >
          <LogoUpla variante="lateral" />
          <div className="leading-tight">
            <span className="block text-base font-bold text-white tracking-tight">ReservaUPLA</span>
            <span className="block text-xs text-blue-200">Gestión académica</span>
          </div>
        </a>

        {/* Enlaces de ancla (escritorio) */}
        <nav aria-label="Navegación de secciones" className="hidden md:flex items-center gap-6">
          {ENLACES_NAV_LANDING.map((enlace) => (
            <a
              key={enlace.href}
              href={enlace.href}
              className="text-sm font-medium text-blue-100 hover:text-white transition-colors"
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
            className="h-10 inline-flex items-center justify-center px-4 rounded-control border border-white/30 bg-white/10 text-white hover:bg-white/20 text-sm font-semibold transition-colors backdrop-blur-sm"
          >
            Registrarse
          </Link>
          <Link
            to={RUTAS.INGRESAR}
            className="h-10 inline-flex items-center justify-center px-4 rounded-control bg-white text-[#071c3d] hover:bg-blue-50 text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
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
            className="h-10 w-10 inline-flex items-center justify-center rounded-control border border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <Icono nombre={menuMovilAbierto ? 'X' : 'Menu'} className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Menú desplegable en móvil */}
      {menuMovilAbierto && (
        <div className="md:hidden border-t border-white/10 bg-[#071c3d] px-4 py-4 space-y-3 text-white">
          <nav aria-label="Navegación móvil de secciones" className="flex flex-col space-y-2">
            {ENLACES_NAV_LANDING.map((enlace) => (
              <a
                key={enlace.href}
                href={enlace.href}
                onClick={() => setMenuMovilAbierto(false)}
                className="py-2 text-sm font-medium text-blue-100 hover:text-white"
              >
                {enlace.etiqueta}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              to={RUTAS.REGISTRO}
              onClick={() => setMenuMovilAbierto(false)}
              className="w-full h-10 inline-flex items-center justify-center rounded-control border border-white/25 bg-white/10 text-white text-sm font-semibold"
            >
              Registrarse
            </Link>
            <Link
              to={RUTAS.INGRESAR}
              onClick={() => setMenuMovilAbierto(false)}
              className="w-full h-10 inline-flex items-center justify-center rounded-control bg-white text-[#071c3d] text-sm font-bold"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
