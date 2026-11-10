// Pie de página institucional sobrio de la Landing Page sin enlaces simulados
import { Link } from 'react-router-dom';
import { RUTAS } from '../../constants/rutas';
import { ENLACES_NAV_LANDING } from '../../constants/datosLanding';
import LogoUpla from '../ui/LogoUpla';

export default function FooterLanding() {
  return (
    <footer className="border-t border-borde bg-superficie py-12 text-texto-suave">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-borde">
          {/* Marca */}
          <div className="flex items-center gap-3">
            <LogoUpla variante="lateral" />
            <div>
              <span className="block text-base font-bold text-texto">ReservaUPLA</span>
              <span className="block text-xs">Universidad Peruana Los Andes</span>
            </div>
          </div>

          {/* Enlaces de ancla */}
          <nav aria-label="Navegación secundaria del pie" className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {ENLACES_NAV_LANDING.map((enlace) => (
              <a
                key={enlace.href}
                href={enlace.href}
                className="hover:text-primario-enlace transition-colors"
              >
                {enlace.etiqueta}
              </a>
            ))}
            <Link to={RUTAS.INGRESAR} className="font-semibold text-texto hover:text-primario-enlace transition-colors">
              Iniciar sesión
            </Link>
            <Link to={RUTAS.REGISTRO} className="font-semibold text-texto hover:text-primario-enlace transition-colors">
              Registrarse
            </Link>
          </nav>
        </div>

        {/* Derechos y créditos */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-texto-suave text-center sm:text-left">
          <p>
            © 2026 Universidad Peruana Los Andes. ReservaUPLA · Sistema de reserva y gestión de ambientes académicos.
          </p>
          <p>
            Construcción de Software · IX Ciclo
          </p>
        </div>
      </div>
    </footer>
  );
}
