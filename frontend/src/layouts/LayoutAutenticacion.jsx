// Nielsen 4 · WCAG 2.2 AA · Layout de dos paneles para acceso institucional · E-25 · E-29
import { Link, Outlet } from 'react-router-dom';
import { RUTA_IMAGEN_FONDO_LOGIN } from '../constants/rutas';
import LogoUpla from '../components/ui/LogoUpla';
import Icono from '../components/ui/Icono';
import RedParticulas from '../components/ui/RedParticulas';
import ControlTamanoFuente from '../components/navegacion/ControlTamanoFuente';
import ConmutadorTema from '../components/navegacion/ConmutadorTema';
import SaltarAlContenido from '../components/navegacion/SaltarAlContenido';

const BENEFICIOS = [
  { icono: 'CircleCheck', texto: 'Disponibilidad inmediata y sin solapes' },
  { icono: 'Building2', texto: 'Laboratorios de cómputo y aulas especializadas' },
  { icono: 'Presentation', texto: 'Auditorios para conferencias y eventos' },
  { icono: 'Clock', texto: 'Horario oficial de atención: 07:00 a 22:00' }
];

export default function LayoutAutenticacion({ children }) {
  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row bg-fondo text-texto overflow-x-hidden overflow-y-auto">
      <SaltarAlContenido />
      <aside
        aria-label="Identidad institucional"
        className="relative lg:w-[68%] lg:h-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-sobre-primario bg-cover border-b lg:border-b-0 lg:border-r border-borde shrink-0"
        style={{ backgroundImage: `url(${RUTA_IMAGEN_FONDO_LOGIN})`, backgroundPosition: 'right center' }}
      >
        <div className="absolute inset-0 capa-superposicion-login pointer-events-none" aria-hidden="true" />
        <RedParticulas />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <Link
            to="/"
            className="flex items-center gap-3 no-underline group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acento-sobre-oscuro rounded"
            aria-label="Ir a la página principal de ReservaUPLA"
          >
            <LogoUpla variante="marca" />
            <div>
              <p className="text-base font-bold text-sobre-primario leading-tight group-hover:text-acento-sobre-oscuro transition-colors">Universidad Peruana Los Andes</p>
              <p className="text-sm text-lateral-texto">Educación con valores y trascendencia</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-[340px] my-auto py-4 space-y-4">
          <div>
            <span className="inline-block px-3 py-1 mb-2.5 rounded-pill bg-lateral-activo-fondo text-xs font-semibold text-sobre-primario">
              Sistema institucional
            </span>
            <Link
              to="/"
              className="inline-block text-2xl sm:text-3xl font-bold text-sobre-primario mb-2 no-underline hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acento-sobre-oscuro rounded"
              aria-label="Ir a la página principal de ReservaUPLA"
            >
              Reserva<span className="text-acento-sobre-oscuro">UPLA</span>
            </Link>
            <p className="text-sm text-lateral-texto leading-relaxed">
              Plataforma oficial para la gestión, reserva y trazabilidad en tiempo real de laboratorios, auditorios y salas académicas.
            </p>
          </div>
          <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-lateral-texto">
            {BENEFICIOS.map((b) => (
              <li key={b.texto} className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-acento-sobre-oscuro">
                  <Icono nombre={b.icono} className="w-3.5 h-3.5" />
                </div>
                <span className="leading-snug">{b.texto}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <ControlTamanoFuente mimetizado /><ConmutadorTema mimetizado />
        </div>
      </aside>

      <div className="flex-1 lg:w-[32%] lg:h-full flex flex-col justify-center bg-fondo text-texto lg:overflow-y-auto">
        <main id="contenido-principal" tabIndex={-1} className="flex-1 flex items-center justify-center p-2 sm:p-4 outline-none">
          <div className="w-full max-w-[370px] my-auto">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
