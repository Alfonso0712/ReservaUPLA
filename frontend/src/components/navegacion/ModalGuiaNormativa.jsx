// Modal accesible con normativa y reglas del sistema de reservas
import { useId, useEffect } from 'react';
import { useTrampaFoco } from '../../hooks/useTrampaFoco';
import { INTRODUCCION_GUIA, REGLAS_NORMATIVA } from '../../constants/guiaNormativa';
import Button from '../ui/Button';
import Icono from '../ui/Icono';

export default function ModalGuiaNormativa({ abierto, alCerrar }) {
  const idTitulo = useId();
  const idSubtitulo = useId();
  const contenedorRef = useTrampaFoco(abierto, alCerrar, '[aria-label="Cerrar guía"]');

  useEffect(() => {
    if (!abierto) return undefined;
    const alHacerClicFondo = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        alCerrar?.();
      }
    };
    document.addEventListener('click', alHacerClicFondo);
    return () => document.removeEventListener('click', alHacerClicFondo);
  }, [abierto, alCerrar, contenedorRef]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fondo-modal">
      <div
        ref={contenedorRef}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={idSubtitulo}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col p-6 rounded-tarjeta border border-borde bg-superficie text-texto shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-borde">
          <div>
            <h2 id={idTitulo} className="text-xl font-semibold text-texto">Guía y normativa de ambientes</h2>
            <p id={idSubtitulo} className="text-sm text-texto-suave mt-0.5">Reglas de reserva de ambientes UPLA</p>
          </div>
          <button
            type="button"
            onClick={alCerrar}
            aria-label="Cerrar guía"
            className="h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] p-2 inline-flex items-center justify-center rounded-full text-texto-suave hover:bg-superficie-2 cursor-pointer"
          >
            <Icono nombre="X" className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pr-1 my-4 flex-1">
          <p className="text-sm text-texto-suave leading-relaxed">{INTRODUCCION_GUIA}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REGLAS_NORMATIVA.map((regla) => (
              <div key={regla.numero} className="p-3.5 rounded-tarjeta border border-borde bg-superficie-2">
                <h3 className="text-sm font-semibold text-texto mb-1">{regla.titulo}</h3>
                <p className="text-xs text-texto-suave leading-relaxed">{regla.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-borde">
          <Button variante="primary" onClick={alCerrar}>Entendido</Button>
        </div>
      </div>
    </div>
  );
}
