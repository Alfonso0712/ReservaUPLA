// Nielsen 1 · Nielsen 5 · Shneiderman 2 · Shneiderman 3 · E-22
export default function Button({
  children,
  type = 'button',
  onClick,
  variante = 'primario',
  cargando = false,
  deshabilitado = false,
  anchoCompleto = false,
  className = '',
  buttonRef
}) {
  const handleClick = (e) => {
    // Guarda estricta contra doble envio
    if (cargando || deshabilitado) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      disabled={cargando || deshabilitado}
      className={`boton boton-${variante} ${anchoCompleto ? 'boton-ancho-completo' : ''} ${className}`}
      style={{ minHeight: '44px', minWidth: '44px' }}
    >
      {cargando ? (
        <span className="spinner-envoltura" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <span className="sr-only">Procesando solicitud...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
