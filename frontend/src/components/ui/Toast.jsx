// ISO 9241-110 · WCAG 2.2 AA · Toast flotante accesible con pausa por hover/foco
import { useEffect, useRef, useCallback } from 'react';
import Icono from './Icono';

function ToastItem({ toast, alCerrar }) {
  const { id, tipo = 'exito', mensaje, alReintentar, alDeshacer } = toast;
  const esError = tipo === 'error';
  const tiempoRestanteRef = useRef(5000);
  const inicioRef = useRef(Date.now());
  const timerRef = useRef(null);

  const reanudar = useCallback(() => {
    if (esError) return;
    inicioRef.current = Date.now();
    timerRef.current = setTimeout(() => alCerrar(id), tiempoRestanteRef.current);
  }, [esError, alCerrar, id]);

  const pausar = () => {
    if (esError || !timerRef.current) return;
    clearTimeout(timerRef.current);
    tiempoRestanteRef.current -= Date.now() - inicioRef.current;
  };

  useEffect(() => {
    if (!esError) reanudar();
    return () => clearTimeout(timerRef.current);
  }, [id, esError, reanudar]);

  return (
    <div
      role={esError ? 'alert' : 'status'}
      aria-live={esError ? 'assertive' : 'polite'}
      onMouseEnter={pausar}
      onMouseLeave={reanudar}
      onFocus={pausar}
      onBlur={reanudar}
      className="pointer-events-auto flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-control border border-borde bg-superficie shadow-lg text-sm text-texto max-w-md w-full transition-all"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icono
          nombre={esError ? 'CircleX' : 'CircleCheck'}
          className={`w-5 h-5 shrink-0 ${esError ? 'text-rechazada-texto' : 'text-aprobada-texto'}`}
        />
        <span className="leading-snug">{mensaje}</span>
        {alDeshacer && (
          <button type="button" onClick={alDeshacer} className="text-xs font-semibold text-primario-enlace hover:underline shrink-0 ml-1">
            Deshacer
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {alReintentar && (
          <button type="button" onClick={alReintentar} className="text-xs font-semibold px-2 py-1 rounded bg-superficie-2 border border-borde hover:bg-fondo">
            Reintentar
          </button>
        )}
        <button type="button" aria-label="Cerrar notificación" onClick={() => alCerrar(id)} className="p-1 rounded text-texto-suave hover:text-texto">
          <Icono nombre="X" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function Toast({ toasts = [], alCerrar }) {
  const visibles = toasts.slice(-3);
  if (!visibles.length) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 max-sm:left-4 z-50 flex flex-col gap-2 pointer-events-none">
      {visibles.map((t) => (
        <ToastItem key={t.id} toast={t} alCerrar={alCerrar} />
      ))}
    </div>
  );
}
