// Norman · Nielsen 1 · Nielsen 5 · WCAG 2.2 AA · Botón accesible multivariante y tamaño · E-22
import { forwardRef } from 'react';
import Icono from './Icono';

const ESTILOS_VARIANTE = {
  primario: 'bg-primario text-sobre-primario hover:bg-primario-hover border border-transparent',
  secundario: 'bg-superficie text-texto hover:bg-superficie-2 border border-borde-control',
  peligro: 'bg-rechazada-fondo text-rechazada-texto hover:opacity-90 border border-rechazada-texto',
  fantasma: 'bg-transparent text-texto hover:bg-superficie-2 border border-transparent'
};

const ESTILOS_TAMANO = {
  md: 'min-h-control px-4 py-2 font-semibold text-sm sm:text-base gap-2',
  sm: 'min-h-[32px] h-8 px-2.5 py-1 font-semibold text-xs gap-1.5'
};

const Button = forwardRef(function Button(
  {
    children, type, tipo, variante = 'primario', tamano = 'md', enProceso = false,
    textoProceso = 'Validando…', icono = null, className = '', disabled = false, onClick, ...props
  },
  ref
) {
  const tipoBoton = tipo || type || 'button';
  const bloqueado = disabled || enProceso;
  const estiloVariante = ESTILOS_VARIANTE[variante] || ESTILOS_VARIANTE.primario;
  const estiloTamano = ESTILOS_TAMANO[tamano] || ESTILOS_TAMANO.md;
  const tamanoIcono = tamano === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  const manejarClick = (evento) => {
    if (bloqueado) { evento.preventDefault(); return; }
    onClick?.(evento);
  };

  return (
    <button
      ref={ref} type={tipoBoton} disabled={bloqueado} aria-busy={enProceso || undefined} onClick={manejarClick}
      className={`inline-flex items-center justify-center rounded-control whitespace-nowrap transition-all duration-200 ease-out cursor-pointer hover:-translate-y-0.5 active:translate-y-0 hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ${estiloTamano} ${estiloVariante} ${className}`.trim()}
      {...props}
    >
      {enProceso ? <Icono nombre="Loader2" className={`${tamanoIcono} animate-spin shrink-0`} /> : icono && <Icono nombre={icono} className={`${tamanoIcono} shrink-0`} />}
      <span className="whitespace-nowrap">{enProceso ? textoProceso : children}</span>
    </button>
  );
});

export default Button;
