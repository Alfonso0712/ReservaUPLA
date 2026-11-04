// Nielsen 10 · Shneiderman 7 · Credenciales de prueba que solo rellenan · E-07
import { CUENTAS_DEMO } from '../../mocks/datosSemilla';

export default function PanelAyuda({ alRellenarDemo = null, deshabilitado = false }) {
  const mostrarDemo = Boolean(alRellenarDemo) && import.meta.env?.VITE_MOSTRAR_DEMO !== 'false';
  if (!mostrarDemo) return null;

  return (
    <section aria-label="Acceso de demostración" className="p-3.5 rounded-control border border-borde bg-superficie-2">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm font-semibold text-texto">Acceso de demostración</span>
        <span className="px-2 py-0.5 rounded-control border border-borde bg-superficie text-sm font-medium text-texto-suave">
          Solo para pruebas
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {CUENTAS_DEMO.map((cuenta) => (
          <button
            key={cuenta.rol}
            type="button"
            disabled={deshabilitado}
            onClick={() => alRellenarDemo(cuenta)}
            className="min-h-control px-2.5 py-2 rounded-control border border-borde bg-superficie text-texto hover:bg-fondo text-sm font-semibold transition-colors"
          >
            {cuenta.etiqueta}
          </button>
        ))}
      </div>
    </section>
  );
}
