// Nielsen 1 · Nielsen 9 · Shneiderman 4 · WCAG 2.2 AA · E-23 · E-24 · E-26
import { forwardRef } from 'react';
import Icono from './Icono';

const CONFIG_VARIANTE = {
  error: {
    clases: 'bg-rechazada-fondo text-rechazada-texto border-rechazada-texto',
    icono: 'CircleX',
    rolDefecto: 'alert'
  },
  exito: {
    clases: 'bg-aprobada-fondo text-aprobada-texto border-aprobada-texto',
    icono: 'CircleCheck',
    rolDefecto: 'status'
  },
  advertencia: {
    clases: 'bg-pendiente-fondo text-pendiente-texto border-pendiente-texto',
    icono: 'Clock',
    rolDefecto: 'status'
  },
  info: {
    clases: 'bg-primario-suave text-texto border-primario',
    icono: 'Info',
    rolDefecto: 'status'
  }
};

const AlertMessage = forwardRef(function AlertMessage(
  {
    variante = 'error',
    titulo = '',
    mensaje = '',
    children,
    accion = null,
    role,
    className = '',
    ...props
  },
  ref
) {
  const textoContenido = mensaje || children;
  if (!titulo && !textoContenido) return null;

  const config = CONFIG_VARIANTE[variante] || CONFIG_VARIANTE.error;
  const rolFinal = role || config.rolDefecto;

  return (
    <div
      ref={ref}
      role={rolFinal}
      tabIndex={-1}
      className={`flex flex-wrap items-start justify-between gap-3 p-4 rounded-control border ${config.clases} ${className}`.trim()}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Icono nombre={config.icono} className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="text-base leading-relaxed">
          {titulo && <strong className="block font-semibold">{titulo}</strong>}
          {textoContenido && <div>{textoContenido}</div>}
        </div>
      </div>
      {accion && <div className="shrink-0 self-center">{accion}</div>}
    </div>
  );
});

export default AlertMessage;
