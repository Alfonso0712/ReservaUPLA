// Modal accesible con normativa y reglas visuales del sistema de reservas
import { useId, useEffect } from 'react';
import { BookOpen, Info, X, Clock, CalendarCheck, Layers, ClipboardList, ShieldCheck, Lock } from 'lucide-react';
import { useTrampaFoco } from '../../hooks/useTrampaFoco';
import { INTRODUCCION_GUIA, REGLAS_NORMATIVA } from '../../constants/guiaNormativa';
import Button from '../ui/Button';

const ICONOS_MAPA = { Clock, CalendarCheck, Layers, ClipboardList, ShieldCheck, Lock };

export default function ModalGuiaNormativa({ abierto, alCerrar }) {
  const idTitulo = useId(); const idSubtitulo = useId();
  const contenedorRef = useTrampaFoco(abierto, alCerrar, '[aria-label="Cerrar guía"]');

  useEffect(() => {
    if (!abierto) return undefined;
    const alClicFondo = (e) => { if (contenedorRef.current && !contenedorRef.current.contains(e.target)) alCerrar?.(); };
    document.addEventListener('click', alClicFondo);
    return () => document.removeEventListener('click', alClicFondo);
  }, [abierto, alCerrar, contenedorRef]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fondo-modal">
      <div ref={contenedorRef} role="dialog" tabIndex={-1} aria-modal="true" aria-labelledby={idTitulo} aria-describedby={idSubtitulo} className="w-full max-w-2xl max-h-[90vh] flex flex-col p-6 rounded-tarjeta border border-borde bg-superficie text-texto shadow-xl">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-borde">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primario-suave text-primario dark:text-primario-enlace flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" aria-hidden="true" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <h2 id={idTitulo} className="text-xl font-semibold text-texto leading-snug">Guía y normativa de ambientes</h2>
              <p id={idSubtitulo} className="text-sm text-texto-suave mt-0.5 leading-snug">Reglas de reserva de ambientes UPLA</p>
            </div>
          </div>
          <button type="button" onClick={alCerrar} aria-label="Cerrar guía" className="h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] p-2 inline-flex items-center justify-center rounded-full text-texto-suave hover:bg-superficie-2 cursor-pointer">
            <X className="w-5 h-5" aria-hidden="true" strokeWidth={1.8} />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pr-1 my-4 flex-1">
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-primario-enlace/20 bg-primario-suave text-texto text-sm leading-relaxed">
            <Info className="w-4 h-4 text-primario dark:text-primario-enlace shrink-0 mt-0.5" aria-hidden="true" strokeWidth={1.8} />
            <p className="text-sm text-texto leading-relaxed">{INTRODUCCION_GUIA}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REGLAS_NORMATIVA.map((regla) => {
              const IconoCard = ICONOS_MAPA[regla.icono];
              return (
                <div key={regla.numero} className={`p-3.5 rounded-tarjeta border border-borde border-l-[3px] ${regla.colorBarra} bg-superficie-2 transition-all duration-150 hover:shadow-sm hover:border-borde-control`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${regla.colorIcono}`}>
                      {IconoCard && <IconoCard className="w-3.5 h-3.5" aria-hidden="true" strokeWidth={1.8} />}
                    </div>
                    <h3 className="text-sm font-semibold text-texto leading-tight">{regla.titulo}</h3>
                  </div>
                  <p className="text-xs text-texto-suave leading-relaxed">{regla.descripcion}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-borde">
          <span className="text-xs text-texto-suave">Normativa vigente · UPLA</span>
          <Button variante="primary" onClick={alCerrar}>Entendido</Button>
        </div>
      </div>
    </div>
  );
}
