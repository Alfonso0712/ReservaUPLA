// Shneiderman 2 · WCAG 2.2 AA · Control de tamaño de fuente (A−, A, A+) con persistencia · E-29
import { useTamanoFuente, ESCALAS_FUENTE } from '../../hooks/useTamanoFuente';

export default function ControlTamanoFuente({ tamanoActual, alCambiar }) {
  const { tamanoFuente, cambiarTamanoFuente } = useTamanoFuente();
  const actual = tamanoActual || tamanoFuente;
  const manejarCambio = alCambiar || cambiarTamanoFuente;

  return (
    <div
      role="group"
      aria-label="Tamaño de fuente"
      className="inline-flex items-center gap-1 p-1 rounded-control border border-borde bg-superficie"
    >
      {ESCALAS_FUENTE.map((escala) => {
        const activo = actual === escala.porcentaje;
        return (
          <button
            key={escala.id}
            type="button"
            aria-label={escala.descripcion}
            aria-pressed={activo}
            onClick={() => manejarCambio?.(escala.porcentaje)}
            className={`min-h-control min-w-control px-2.5 rounded-control text-sm font-semibold transition-colors cursor-pointer ${
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
