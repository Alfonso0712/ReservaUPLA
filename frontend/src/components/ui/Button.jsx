// Norman · Nielsen 1 · Nielsen 5 · WCAG 2.2 AA · E-22
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
    children,
    type = 'button',
    variante = 'primario',
    enProceso = false,
    textoProceso = 'Validando…',
    icono = null,
    className = '',
    disabled = false,
    onClick,
    ...props
  },
  ref
) {
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
      type={type}
      disabled={bloqueado}
      aria-busy={enProceso || undefined}
      onClick={manejarClick}
      className={`inline-flex items-center justify-center gap-2 min-h-[2.75rem] px-4 py-2 rounded-control font-semibold text-base transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${estiloVariante} ${className}`.trim()}
      {...props}
    >
      {enProceso ? <Icono nombre="Loader2" className="w-4 h-4 animate-spin" /> : icono && <Icono nombre={icono} className="w-4 h-4" />}
      <span>{enProceso ? textoProceso : children}</span>
    </button>
  );
});

export default Button;
