// Componente base reutilizable: etiqueta + obligatorio + control + ayuda + error
// Shneiderman 2 · Nielsen 4 · Nielsen 6 · Nielsen 9
export default function Campo({
  id,
  label,
  obligatorio = false,
  ayuda = '',
  error = '',
  children
}) {
  const ayudaId = ayuda ? `${id}-ayuda` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const descripcionIds = [ayudaId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`campo-grupo ${error ? 'campo-error' : ''}`}>
      <label htmlFor={id} className="campo-etiqueta">
        {label}
        {obligatorio && <span className="campo-obligatorio" aria-hidden="true"> *</span>}
      </label>
      <div className="campo-control-envoltura" data-describedby={descripcionIds}>
        {children}
      </div>
      {ayuda && (
        <small id={ayudaId} className="campo-ayuda">
          {ayuda}
        </small>
      )}
      {error && (
        <span id={errorId} role="alert" className="campo-mensaje-error">
          {error}
        </span>
      )}
    </div>
  );
}
