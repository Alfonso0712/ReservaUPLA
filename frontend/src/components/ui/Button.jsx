// Norman · Nielsen 1 · Nielsen 5 · WCAG 2.2 AA · Guarda contra doble clic y estado ocupado · E-22
import { forwardRef } from 'react';
import Icono from './Icono';

const ESTILOS_VARIANTE = {
  primario: 'bg-primario text-sobre-primario hover:bg-primario-hover border border-transparent',
  secundario: 'bg-superficie text-texto hover:bg-superficie-2 border border-borde-control',
  peligro: 'bg-rechazada-fondo text-rechazada-texto hover:opacity-90 border border-rechazada-texto',
  fantasma: 'bg-transparent text-texto hover:bg-superficie-2 border border-transparent'
};

const Button = forwardRef(function Button(
  {
    children, type, tipo, variante = 'primario', enProceso = false,
    textoProceso = 'Validando…', icono = null, className = '', disabled = false, onClick, ...props
  },
  ref
) {
  const tipoBoton = tipo || type || 'button';
  const bloqueado = disabled || enProceso;
  const estiloVariante = ESTILOS_VARIANTE[variante] || ESTILOS_VARIANTE.primario;

  const manejarClick = (evento) => {
    if (bloqueado) {
      evento.preventDefault();
      return;
    }
    onClick?.(evento);
  };

  return (
    <button
      ref={ref}
      type={tipoBoton}
      disabled={bloqueado}
      aria-busy={enProceso || undefined}
      onClick={manejarClick}
      className={`inline-flex items-center justify-center gap-2 min-h-control px-4 py-2 rounded-control font-semibold text-sm sm:text-base whitespace-nowrap transition-all duration-200 ease-out cursor-pointer hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_6px_16px_rgba(10,61,145,0.28)] dark:hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ${estiloVariante} ${className}`.trim()}
      {...props}
    >
      {enProceso ? <Icono nombre="Loader2" className="w-4 h-4 animate-spin shrink-0" /> : icono && <Icono nombre={icono} className="w-4 h-4 shrink-0" />}
      <span className="whitespace-nowrap">{enProceso ? textoProceso : children}</span>
    </button>
  );
});

export default Button;
