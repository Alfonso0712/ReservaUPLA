// ISO 9241-110 · WCAG 2.2 AA · Botón accesible unificado con variantes y tooltip
import { forwardRef } from 'react';
import Icono from './Icono';

const VARIANTES = {
  primary: 'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] border border-transparent',
  primario: 'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] border border-transparent',
  success: 'bg-aprobada-texto text-sobre-primario hover:opacity-90 border border-transparent',
  'danger-outline': 'bg-transparent text-rechazada-texto border border-rechazada-texto hover:bg-rechazada-fondo',
  peligro: 'bg-transparent text-rechazada-texto border border-rechazada-texto hover:bg-rechazada-fondo',
  secondary: 'bg-superficie text-texto border border-borde hover:bg-superficie-2 hover:border-borde-control',
  secundario: 'bg-superficie text-texto border border-borde hover:bg-superficie-2 hover:border-borde-control',
  ghost: 'bg-transparent text-texto border border-transparent hover:bg-superficie-2',
  fantasma: 'bg-transparent text-texto border border-transparent hover:bg-superficie-2',
  'icon-only': 'bg-superficie text-texto border border-borde hover:bg-superficie-2'
};

const Button = forwardRef(function Button(
  {
    children, type, tipo, variante = 'primary', tamano = 'md', enProceso = false,
    textoProceso = 'Cargando…', icono = null, className = '', disabled = false,
    iconOnly = false, tooltip = '', 'aria-label': ariaLabelProp, onClick, ...props
  },
  ref
) {
  const esIconOnly = iconOnly || variante === 'icon-only';
  const tipoBoton = tipo || type || 'button';
  const bloqueado = disabled || enProceso;
  const clasesVariante = VARIANTES[variante] || VARIANTES.primary;
  const tamanoIcono = tamano === 'sm' ? 'w-4 h-4' : 'w-[18px] h-[18px]';
  const label = ariaLabelProp || tooltip || (typeof children === 'string' ? children : undefined);

  const clasesTamano = tamano === 'sm'
    ? (esIconOnly ? 'h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] p-0' : 'h-9 min-h-[2.25rem] px-3 text-sm gap-2')
    : (esIconOnly ? 'h-10 w-10 min-h-[2.5rem] min-w-[2.5rem] p-0' : 'h-10 min-h-[2.5rem] px-4 text-sm sm:text-base gap-2');

  return (
    <button
      ref={ref}
      type={tipoBoton}
      disabled={bloqueado}
      aria-busy={enProceso || undefined}
      aria-label={label}
      onClick={(e) => { if (bloqueado) { e.preventDefault(); return; } onClick?.(e); }}
      className={`group relative inline-flex items-center justify-center rounded-control whitespace-nowrap font-medium transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-anillo-foco disabled:opacity-50 disabled:cursor-not-allowed ${clasesTamano} ${clasesVariante} ${className}`.trim()}
      {...props}
    >
      {enProceso ? (
        <Icono nombre="Loader2" className={`${tamanoIcono} animate-spin`} />
      ) : icono ? (
        <Icono nombre={icono} className={tamanoIcono} />
      ) : null}
      {!esIconOnly && <span className="inline-flex items-center gap-2 whitespace-nowrap">{enProceso ? textoProceso : children}</span>}
      {esIconOnly && tooltip && (
        <span
          role="tooltip"
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded px-2 py-0.5 text-xs bg-lateral-fondo text-white shadow-sm opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
        >
          {tooltip}
        </span>
      )}
    </button>
  );
});

export default Button;
