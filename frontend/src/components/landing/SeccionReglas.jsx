// Sección "Reglas": resumen de la normativa institucional vigente de reservas
import { REGLAS_LANDING } from '../../constants/datosLanding';
import Icono from '../ui/Icono';

export default function SeccionReglas() {
  return (
    <section id="reglas" aria-labelledby="titulo-reglas" className="py-16 border-t border-borde">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-primario dark:text-primario-enlace">
            Normativa y convivencia
          </span>
          <h2 id="titulo-reglas" className="text-2xl sm:text-3xl font-bold text-texto mt-1 mb-3">
            Reglas de reserva de ambientes
          </h2>
          <p className="text-base text-texto-suave">
            El cumplimiento de estas normas asegura el acceso equitativo y la puntualidad en los espacios académicos de la universidad.
          </p>
        </div>

        <div className="space-y-4">
          {REGLAS_LANDING.map((regla) => (
            <div
              key={regla.id}
              className="p-5 rounded-tarjeta border border-borde bg-superficie shadow-sm flex items-start gap-4 hover:border-borde-control transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-superficie-2 border border-borde text-texto font-bold text-sm flex items-center justify-center shrink-0">
                {regla.numero}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-texto leading-snug">
                    {regla.titulo}
                  </h3>
                </div>
                <p className="text-sm text-texto-suave leading-relaxed">
                  {regla.descripcion}
                </p>
              </div>
              <div className="hidden sm:flex w-8 h-8 rounded-control bg-primario-suave text-primario dark:text-primario-enlace items-center justify-center shrink-0 mt-0.5">
                <Icono nombre={regla.icono} className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
