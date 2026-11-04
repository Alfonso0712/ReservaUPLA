// Nielsen 1 · Nielsen 9 · Shneiderman 4 · WCAG 2.2 AA · Alerta accesible con foco opcional · E-23..26
import { forwardRef, useEffect, useRef } from 'react';
import Icono from './Icono';

const CONFIG_VARIANTE = {
  error: { clases: 'bg-rechazada-fondo text-rechazada-texto border-rechazada-texto', icono: 'CircleX', rolDefecto: 'alert' },
  exito: { clases: 'bg-aprobada-fondo text-aprobada-texto border-aprobada-texto', icono: 'CircleCheck', rolDefecto: 'status' },
  advertencia: { clases: 'bg-pendiente-fondo text-pendiente-texto border-pendiente-texto', icono: 'Clock', rolDefecto: 'status' },
  info: { clases: 'bg-primario-suave text-texto border-primario', icono: 'Info', rolDefecto: 'status' }
};

const AlertMessage = forwardRef(function AlertMessage(
  {
    variante = 'error', titulo = '', mensaje = '', children, accion = null,
    role, rol, enfocarAlAparecer = false, alCerrar = null, className = '', ...props
  },
  refExterna
) {
  const refInterna = useRef(null);
  const textoContenido = mensaje || children;

  useEffect(() => {
    if (enfocarAlAparecer && (titulo || textoContenido)) {
      refInterna.current?.focus();
    }
  }, [enfocarAlAparecer, titulo, textoContenido]);

  if (!titulo && !textoContenido) return null;

  const config = CONFIG_VARIANTE[variante] || CONFIG_VARIANTE.error;
  const rolFinal = rol || role || config.rolDefecto;

  return (
    <div
      ref={(nodo) => {
        refInterna.current = nodo;
        if (typeof refExterna === 'function') refExterna(nodo);
        else if (refExterna) refExterna.current = nodo;
      }}
      role={rolFinal}
      tabIndex={-1}
      className={`flex flex-wrap items-start justify-between gap-3 p-4 rounded-control border outline-none ${config.clases} ${className}`.trim()}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Icono nombre={config.icono} className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="text-base leading-relaxed">
          {titulo && <strong className="block font-semibold">{titulo}</strong>}
          {textoContenido && <div>{textoContenido}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 self-center">
        {accion}
        {alCerrar && (
          <button type="button" onClick={alCerrar} aria-label="Cerrar mensaje" className="min-h-control min-w-control p-2 inline-flex items-center justify-center rounded-control">
            <Icono nombre="X" className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
});

export default AlertMessage;
