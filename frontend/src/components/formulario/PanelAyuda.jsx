// Nielsen 10 · Ayuda y documentación plegable accesible
import { useState, useId } from 'react';
import Icono from '../ui/Icono';
import { MENSAJES } from '../../constants/mensajes';

export default function PanelAyuda() {
  const [abierto, setAbierto] = useState(false);
  const idPanel = useId();

  return (
    <div className="w-full rounded-control border border-borde bg-superficie-2">
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={idPanel}
        onClick={() => setAbierto((actual) => !actual)}
        className="flex items-center justify-between w-full min-h-[2.75rem] px-3.5 py-2 text-left text-sm font-semibold text-texto bg-transparent border-0 cursor-pointer"
      >
        <span className="inline-flex items-center gap-2">
          <Icono nombre="HelpCircle" className="w-4 h-4 text-primario" />
          <span>¿Necesita ayuda para ingresar?</span>
        </span>
        <Icono
          nombre="ChevronDown"
          className={`w-4 h-4 transition-transform ${abierto ? 'rotate-180' : ''}`}
        />
      </button>

      {abierto && (
        <div id={idPanel} className="px-3.5 pb-3 pt-1 text-sm text-texto-suave space-y-1.5 border-t border-borde">
          <p>{MENSAJES.TEXTO_PANEL_AYUDA_QUIEN}</p>
          <p>{MENSAJES.TEXTO_PANEL_AYUDA_CLAVE}</p>
        </div>
      )}
    </div>
  );
}
