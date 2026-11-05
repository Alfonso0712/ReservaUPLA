// ISO 9241-110 · WCAG 2.2 AA · Toast flotante accesible apoyado sobre AlertMessage
import { useEffect, useRef, useCallback } from 'react';
import AlertMessage from './AlertMessage';

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

  const acciones = (
    <>
      {alDeshacer && (
        <button type="button" onClick={alDeshacer} className="text-xs font-semibold text-primario-enlace hover:underline shrink-0 ml-1">
          Deshacer
        </button>
      )}
      {alReintentar && (
        <button type="button" onClick={alReintentar} className="text-xs font-semibold px-2 py-1 rounded bg-superficie-2 border border-borde hover:bg-fondo">
          Reintentar
        </button>
      )}
    </>
  );

  return (
    <div onMouseEnter={pausar} onMouseLeave={reanudar} onFocus={pausar} onBlur={reanudar} className="pointer-events-auto">
      <AlertMessage
        modoToast
        variante={tipo}
        mensaje={mensaje}
        accion={acciones}
        alCerrar={() => alCerrar(id)}
      />
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
