// Nielsen 4 · WCAG 2.2 AA · Layout de dos paneles para acceso institucional · E-25 · E-29
import { Outlet } from 'react-router-dom';
import { RUTA_IMAGEN_FONDO_LOGIN } from '../constants/rutas';
import LogoUpla from '../components/ui/LogoUpla';
import ControlTamanoFuente from '../components/navegacion/ControlTamanoFuente';
import ConmutadorTema from '../components/navegacion/ConmutadorTema';
import SaltarAlContenido from '../components/navegacion/SaltarAlContenido';

const BENEFICIOS = [
  'Disponibilidad inmediata y sin solapes',
  'Laboratorios, auditorios y salas académicas',
  'Horario oficial de atención: 07:00 a 22:00'
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
        <div className="relative z-10 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <LogoUpla variante="marca" />
              <div>
                <p className="text-base font-bold text-sobre-primario leading-tight">Universidad Peruana Los Andes</p>
                <p className="text-sm text-lateral-texto">Educación con valores y trascendencia</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ControlTamanoFuente mimetizado /><ConmutadorTema mimetizado />
            </div>
          </div>
          <div className="max-w-[320px] space-y-3">
            <div>
              <span className="inline-block px-3 py-1 mb-2 rounded-control bg-lateral-activo-fondo text-xs font-semibold text-sobre-primario">Sistema institucional</span>
              <p className="text-2xl sm:text-3xl font-bold text-sobre-primario mb-2">ReservaUPLA</p>
              <p className="text-sm text-lateral-texto">Plataforma oficial para la gestión, reserva y trazabilidad en tiempo real de laboratorios de cómputo, auditorios y salas académicas especializadas.</p>
            </div>
            <ul className="space-y-2 pt-1 text-xs text-lateral-texto">
              {BENEFICIOS.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-acento-sobre-oscuro shrink-0" aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative z-10 hidden sm:flex items-center justify-between text-xs text-lateral-texto pt-3 mt-auto border-t border-borde">
          <span>Universidad Peruana Los Andes © 2026</span><span>Gestión de ambientes universitarios</span>
        </div>
      </aside>
      <div className="flex-1 lg:w-[32%] lg:h-full flex flex-col justify-center bg-superficie text-texto lg:overflow-y-auto">
        <main id="contenido-principal" tabIndex={-1} className="flex-1 flex items-center justify-center p-4 sm:p-6 outline-none">
          <div className="w-full max-w-[340px] my-auto">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
