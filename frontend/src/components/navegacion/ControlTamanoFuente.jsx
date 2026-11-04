// Shneiderman 2 · WCAG 2.2 AA · E-29
import { ESCALAS_FUENTE } from '../../hooks/useTamanoFuente';

export default function ControlTamanoFuente({ tamanoActual = '100%', alCambiar }) {
  return (
    <div
      role="group"
      aria-label="Tamaño de fuente"
      className="inline-flex items-center gap-1 p-1 rounded-control border border-borde bg-superficie"
    >
      {ESCALAS_FUENTE.map((escala) => {
        const activo = tamanoActual === escala.porcentaje;
        return (
          <button
            key={escala.id}
            type="button"
            aria-label={escala.descripcion}
            aria-pressed={activo}
            onClick={() => alCambiar?.(escala.porcentaje)}
            className={`min-h-[2.75rem] min-w-[2.75rem] px-2.5 rounded-control text-sm font-semibold transition-colors cursor-pointer ${
              activo
                ? 'bg-primario text-sobre-primario'
                : 'bg-transparent text-texto hover:bg-superficie-2'
            }`}
          >
            {escala.etiqueta}
          </button>
        );
      })}
    </div>
  );
}
