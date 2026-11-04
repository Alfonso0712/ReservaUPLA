// Nielsen 10 · Shneiderman 7 · Credenciales de prueba que solo rellenan · E-07
import { CUENTAS_DEMO } from '../../mocks/datosSemilla';

export default function PanelAyuda({ alRellenarDemo = null, deshabilitado = false }) {
  const mostrarDemo = Boolean(alRellenarDemo) && import.meta.env?.VITE_MOSTRAR_DEMO !== 'false';
  if (!mostrarDemo) return null;

  return (
    <section aria-label="Acceso de demostración" className="p-2 sm:p-2.5 rounded-control border border-borde bg-superficie-2">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs font-semibold text-texto-suave">Acceso de demostración</span>
        <span className="px-1.5 py-0.5 rounded-control border border-borde bg-superficie text-[10px] font-medium text-texto-suave">
          Solo para pruebas
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {CUENTAS_DEMO.map((cuenta) => (
          <button
            key={cuenta.rol}
            type="button"
            disabled={deshabilitado}
            onClick={() => alRellenarDemo(cuenta)}
            className="py-1 px-1 rounded-control border border-borde bg-superficie text-texto hover:bg-fondo text-[11px] font-semibold transition-colors text-center cursor-pointer whitespace-nowrap"
          >
            {cuenta.etiqueta}
          </button>
        ))}
      </div>
    </section>
  );
}
