import { IconoAlerta, IconoCheckCirculo, IconoCruz } from './Iconos';

// Nielsen 9 · Shneiderman 3 · E-23 · E-24
export default function AlertMessage({
  tipo = 'error',
  mensaje = '',
  tabIndex = -1,
  alertRef,
  onCerrar
}) {
  if (!mensaje) return null;

  const esError = tipo === 'error';
  const role = esError ? 'alert' : 'status';

  return (
    <div
      ref={alertRef}
      tabIndex={tabIndex}
      role={role}
      className={`alerta alerta-${tipo}`}
      style={{ outline: 'none' }}
    >
      <span className="alerta-icono" aria-hidden="true">
        {esError ? <IconoAlerta size={18} /> : <IconoCheckCirculo size={18} />}
      </span>
      <span className="alerta-mensaje">{mensaje}</span>
      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          className="alerta-cerrar"
          aria-label="Cerrar notificación"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <IconoCruz size={16} />
        </button>
      )}
    </div>
  );
}
