// Nielsen 10 · Shneiderman 7 · Ayuda plegable accesible y credenciales de prueba que solo rellenan · E-07
import { useState, useId } from 'react';
import Icono from '../ui/Icono';
import { MENSAJES } from '../../constants/mensajes';
import { CUENTAS_DEMO } from '../../mocks/datosSemilla';

export default function PanelAyuda({ alRellenarDemo = null, deshabilitado = false }) {
  const [abierto, setAbierto] = useState(false);
  const idPanel = useId();
  const mostrarDemo = Boolean(alRellenarDemo) && import.meta.env?.VITE_MOSTRAR_DEMO !== 'false';

  return (
    <div className="space-y-3">
      <div className="w-full rounded-control border border-borde bg-superficie-2">
        <button
          type="button"
          aria-expanded={abierto}
          aria-controls={idPanel}
          onClick={() => setAbierto((actual) => !actual)}
          className="flex items-center justify-between w-full min-h-control px-3.5 py-2 text-left text-sm font-semibold text-texto bg-transparent border-0 cursor-pointer"
        >
          <span className="inline-flex items-center gap-2">
            <Icono nombre="HelpCircle" className="w-4 h-4 text-primario" />
            <span>¿Necesita ayuda para ingresar?</span>
          </span>
          <Icono nombre="ChevronDown" className={`w-4 h-4 transition-transform ${abierto ? 'rotate-180' : ''}`} />
        </button>

        {abierto && (
          <div id={idPanel} className="px-3.5 pb-3 pt-1 text-sm text-texto-suave space-y-1.5 border-t border-borde">
            <p>{MENSAJES.TEXTO_PANEL_AYUDA_QUIEN}</p>
            <p>{MENSAJES.TEXTO_PANEL_AYUDA_CLAVE}</p>
          </div>
        )}
      </div>

      {mostrarDemo && (
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
      )}
    </div>
  );
}
