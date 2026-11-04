// Shneiderman 2 · WCAG 2.2 AA · Control de tamaño de fuente (A−, A, A+) con persistencia · E-29
import { useTamanoFuente, ESCALAS_FUENTE } from '../../hooks/useTamanoFuente';

export default function ControlTamanoFuente({ tamanoActual, alCambiar, mimetizado = false }) {
  const { tamanoFuente, cambiarTamanoFuente } = useTamanoFuente();
  const actual = tamanoActual || tamanoFuente;
  const manejarCambio = alCambiar || cambiarTamanoFuente;
  const estiloCaja = mimetizado ? 'border-white/20 bg-white/10 backdrop-blur-md' : 'border-borde bg-superficie';

  return (
    <div role="group" aria-label="Tamaño de fuente" className={`inline-flex items-center gap-1 p-1 rounded-control border ${estiloCaja}`}>
      {ESCALAS_FUENTE.map((escala) => {
        const activo = actual === escala.porcentaje;
        const estiloActivo = mimetizado ? 'bg-white text-primario shadow-sm' : 'bg-primario text-sobre-primario';
        const estiloInactivo = mimetizado ? 'bg-transparent text-sobre-primario hover:bg-white/20' : 'bg-transparent text-texto hover:bg-superficie-2';
        return (
          <button
            key={escala.id}
            type="button"
            aria-label={escala.descripcion}
            aria-pressed={activo}
            onClick={() => manejarCambio?.(escala.porcentaje)}
            className={`min-h-control min-w-control px-2.5 rounded-control text-sm font-semibold transition-colors cursor-pointer ${activo ? estiloActivo : estiloInactivo}`}
          >
            {escala.etiqueta}
          </button>
        );
      })}
    </div>
  );
}
