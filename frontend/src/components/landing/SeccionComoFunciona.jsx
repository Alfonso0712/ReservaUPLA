// Sección "Cómo funciona": flujo secuencial de 3 pasos con íconos y reglas del negocio
import { PASOS_COMO_FUNCIONA } from '../../constants/datosLanding';
import Icono from '../ui/Icono';

export default function SeccionComoFunciona() {
  return (
    <section id="como-funciona" aria-labelledby="titulo-como-funciona" className="py-16 border-t border-borde">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-primario dark:text-primario-enlace">
            Flujo simplificado
          </span>
          <h2 id="titulo-como-funciona" className="text-2xl sm:text-3xl font-bold text-texto mt-1 mb-3">
            Cómo funciona el proceso de reserva
          </h2>
          <p className="text-base text-texto-suave">
            Un procedimiento ordenado en tres etapas garantiza que cada espacio sea aprovechado sin cruces de horario ni trámites manuales en papel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {PASOS_COMO_FUNCIONA.map((paso, idx) => (
            <div
              key={paso.paso}
              className="relative flex flex-col items-center text-center p-6 rounded-tarjeta border border-borde bg-superficie shadow-sm"
            >
              {/* Badge ordinal de paso */}
              <div className="w-12 h-12 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center text-lg font-bold mb-4 shadow-sm">
                {paso.paso}
              </div>

              {/* Ícono de soporte */}
              <div className="w-10 h-10 rounded-control bg-superficie-2 text-texto flex items-center justify-center mb-3">
                <Icono nombre={paso.icono} className="w-5 h-5 text-primario dark:text-primario-enlace" />
              </div>

              <h3 className="text-lg font-semibold text-texto mb-2">
                {paso.titulo}
              </h3>
              <p className="text-sm text-texto-suave leading-relaxed">
                {paso.descripcion}
              </p>

              {/* Indicador visual hacia el siguiente paso en escritorio */}
              {idx < PASOS_COMO_FUNCIONA.length - 1 && (
                <div
                  className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-borde-control"
                  aria-hidden="true"
                >
                  <Icono nombre="ChevronRight" className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
