// ISO 9241-110 · WCAG 2.2 AA · Botón accesible unificado con variantes y tooltip
import { forwardRef } from 'react';
import Icono from './Icono';

const VARIANTES_BASE = {
  primary: 'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] border border-transparent font-medium',
  'neutral-info': 'bg-[var(--btn-info-bg)] text-[var(--btn-info-fg)] border border-[var(--btn-info-border)] hover:bg-[var(--btn-info-hover-bg)] hover:text-[var(--btn-info-hover-fg)] font-medium',
  success: 'bg-[var(--btn-success-bg)] text-[var(--btn-success-fg)] border border-[var(--btn-success-border)] hover:bg-[var(--btn-success-hover-bg)] hover:text-[var(--btn-success-hover-fg)] hover:border-[var(--btn-success-hover-bg)] active:bg-[var(--btn-success-active-bg)] active:text-[var(--btn-success-active-fg)] font-semibold',
  danger: 'bg-[var(--btn-danger-bg)] text-[var(--btn-danger-fg)] border border-[var(--btn-danger-border)] hover:bg-[var(--btn-danger-hover-bg)] hover:text-[var(--btn-danger-hover-fg)] hover:border-[var(--btn-danger-hover-bg)] active:bg-[var(--btn-danger-active-bg)] active:text-[var(--btn-danger-active-fg)] font-semibold',
  'danger-outline': 'bg-[var(--btn-danger-outline-bg)] text-[var(--btn-danger-outline-fg)] border border-[var(--btn-danger-outline-border)] hover:bg-[var(--btn-danger-outline-hover-bg)] hover:text-[var(--btn-danger-outline-hover-fg)] hover:border-[var(--btn-danger-outline-hover-border)] active:bg-[var(--btn-danger-outline-active-bg)] font-semibold',
  warning: 'bg-[var(--btn-warning-bg)] text-[var(--btn-warning-fg)] border border-[var(--btn-warning-border)] hover:bg-[var(--btn-warning-hover-bg)] hover:text-[var(--btn-warning-hover-fg)] active:bg-[var(--btn-warning-hover-bg)] active:text-[var(--btn-warning-hover-fg)] font-medium',
  secondary: 'bg-superficie text-texto border border-borde hover:bg-superficie-2 hover:border-borde-control font-medium',
  ghost: 'bg-transparent text-texto border border-transparent hover:bg-superficie-2 font-medium',
  'icon-only': 'bg-superficie text-texto border border-borde hover:bg-superficie-2 font-medium'
};

const ALIAS_VARIANTES = {
  primario: 'primary', info: 'neutral-info',
  peligro: 'danger', advertencia: 'warning', secundario: 'secondary', fantasma: 'ghost'
};

const Button = forwardRef(function Button(
  {
    children, type, tipo, variante = 'primary', tamano = 'md', enProceso = false,
    textoProceso = 'Cargando…', icono = null, className = '', disabled = false,
    iconOnly = false, tooltip = '', 'aria-label': ariaLabelProp, onClick, ...props
  },
  ref
) {
  const tieneChildren = children !== undefined && children !== null && children !== false && children !== '';
  const esIconOnly = iconOnly || variante === 'icon-only';
  const tipoBoton = tipo || type || 'button';
  const bloqueado = disabled || enProceso;
  const clave = ALIAS_VARIANTES[variante] || variante;
  const clasesVariante = VARIANTES_BASE[clave] || VARIANTES_BASE.primary;
  const tamanoIcono = tamano === 'sm' ? 'w-4 h-4' : 'w-[18px] h-[18px]';
  const label = ariaLabelProp || tooltip || (typeof children === 'string' ? children : undefined);

  const clasesTamano = tamano === 'sm'
    ? (esIconOnly ? 'h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] p-0' : 'h-9 min-h-[2.25rem] px-3.5 text-sm gap-1.5 whitespace-nowrap')
    : (esIconOnly ? 'h-10 w-10 min-h-[2.5rem] min-w-[2.5rem] p-0' : 'h-10 min-h-[2.5rem] px-4 text-[0.9375rem] gap-2 whitespace-nowrap');

  return (
    <button
      ref={ref}
      type={tipoBoton}
      disabled={bloqueado}
      aria-busy={enProceso || undefined}
      aria-label={label}
      onClick={(e) => { if (bloqueado) { e.preventDefault(); return; } onClick?.(e); }}
      className={`group relative inline-flex items-center justify-center ${esIconOnly ? 'rounded-full' : 'rounded-md'} whitespace-nowrap font-medium transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-anillo-foco disabled:opacity-50 disabled:cursor-not-allowed ${clasesTamano} ${clasesVariante} ${className}`.trim()}
      {...props}
    >
      {enProceso ? (
        <Icono nombre="Loader2" className={`${tamanoIcono} animate-spin`} />
      ) : icono ? (
        <Icono nombre={icono} className={tamanoIcono} />
      ) : null}
      {!esIconOnly && tieneChildren && <span className="inline-flex items-center gap-2 whitespace-nowrap">{enProceso ? textoProceso : children}</span>}
      {tooltip && (
        <span
          role="tooltip"
          className="pointer-events-none hidden group-hover:block group-focus-visible:block absolute -top-8 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded-sm px-2 py-0.5 text-xs bg-lateral-fondo text-white shadow-sm transition-opacity"
        >
          {tooltip}
        </span>
      )}
    </button>
  );
});

export default Button;
