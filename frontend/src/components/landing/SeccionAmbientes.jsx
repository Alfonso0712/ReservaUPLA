// Sección "Ambientes": 4 tarjetas estáticas según tipos del sistema universitario
import { AMBIENTES_LANDING } from '../../constants/datosLanding';
import Icono from '../ui/Icono';

export default function SeccionAmbientes() {
  return (
    <section id="ambientes" aria-labelledby="titulo-ambientes" className="py-16 border-t border-borde bg-superficie-2/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-primario dark:text-primario-enlace">
            Infraestructura académica
          </span>
          <h2 id="titulo-ambientes" className="text-2xl sm:text-3xl font-bold text-texto mt-1 mb-3">
            Tipos de ambientes disponibles
          </h2>
          <p className="text-base text-texto-suave">
            Conozca los espacios físicos habilitados para sesiones lectivas, evaluaciones prácticas, investigación y reuniones institucionales.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AMBIENTES_LANDING.map((amb) => (
            <div
              key={amb.id}
              className="p-6 rounded-tarjeta border border-borde bg-superficie shadow-sm flex flex-col justify-between hover:border-borde-control transition-colors"
            >
              <div>
                <div className="w-12 h-12 rounded-tarjeta bg-primario-suave text-primario dark:text-primario-enlace flex items-center justify-center mb-4">
                  <Icono nombre={amb.icono} className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-texto mb-2 leading-snug">
                  {amb.tipo}
                </h3>
                <p className="text-sm text-texto-suave leading-relaxed mb-4">
                  {amb.descripcion}
                </p>
              </div>

              <div className="pt-3 border-t border-borde flex items-center justify-between text-xs text-texto-suave">
                <span className="font-semibold text-texto">Capacidad referencial:</span>
                <span className="font-medium">{amb.capacidad}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
