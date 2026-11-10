// Sección "Qué es": problema de cruces en pabellones y solución centralizada institucional
import Icono from '../ui/Icono';

const PILARES = [
  {
    titulo: 'Transparencia de ocupación',
    descripcion: 'Consulte en cualquier instante la agenda de los ambientes por pabellón, tipo y franja horaria sin acudir a ventanilla.',
    icono: 'Search'
  },
  {
    titulo: 'Cero cruces de horario',
    descripcion: 'El motor de reglas bloquea automáticamente solapamientos entre actividades aprobadas en el mismo espacio académico.',
    icono: 'Check'
  },
  {
    titulo: 'Gestión por roles autorizados',
    descripcion: 'Docentes y alumnos solicitan, responsables evalúan su área y administradores supervisan integralmente la facultad.',
    icono: 'Users'
  }
];

export default function SeccionQueEs() {
  return (
    <section id="que-es" aria-labelledby="titulo-que-es" className="py-16 border-t border-borde bg-superficie-2/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 id="titulo-que-es" className="text-2xl sm:text-3xl font-bold text-texto mb-4">
            ¿Qué es ReservaUPLA?
          </h2>
          <p className="text-base sm:text-lg text-texto-suave leading-relaxed">
            ReservaUPLA es el sistema centralizado de gestión de espacios académicos de la universidad. Resuelve los conflictos de solapes y la incertidumbre de ocupación en aulas y laboratorios, brindando un canal ágil y transparente para solicitar, validar y aprobar ambientes con total trazabilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILARES.map((pilar) => (
            <div
              key={pilar.titulo}
              className="p-6 rounded-tarjeta border border-borde bg-superficie shadow-sm flex flex-col"
            >
              <div className="w-10 h-10 rounded-control bg-primario-suave text-primario dark:text-primario-enlace flex items-center justify-center mb-4 shrink-0">
                <Icono nombre={pilar.icono} className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-texto mb-2">
                {pilar.titulo}
              </h3>
              <p className="text-sm text-texto-suave leading-relaxed">
                {pilar.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
