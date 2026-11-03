import { useState } from 'react';
import Campo from './Campo';

function IconoOjo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconoOjoTachado() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

// ISO 9241-11 · Nielsen 3 · Nielsen 5 · Shneiderman 2
export default function TextInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onKeyDown,
  obligatorio = false,
  ayuda = '',
  error = '',
  placeholder = '',
  autoComplete,
  inputMode,
  readOnly = false,
  autoFocus = false,
  inputRef
}) {
  const [mostrarClave, setMostrarClave] = useState(false);
  const esClave = type === 'password';
  const tipoEfectivo = esClave && mostrarClave ? 'text' : type;

  const ayudaId = ayuda ? `${id}-ayuda` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const descripcionIds = [ayudaId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <Campo id={id} label={label} obligatorio={obligatorio} ayuda={ayuda} error={error}>
      <div className="input-con-accion">
        <input
          ref={inputRef}
          id={id}
          type={tipoEfectivo}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          readOnly={readOnly}
          autoFocus={autoFocus}
          aria-invalid={Boolean(error)}
          aria-describedby={descripcionIds}
          className="control-base"
        />
        {esClave && (
          <button
            type="button"
            className="boton-icono"
            onClick={() => setMostrarClave((prev) => !prev)}
            aria-label={mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            title={mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {mostrarClave ? <IconoOjoTachado /> : <IconoOjo />}
          </button>
        )}
      </div>
    </Campo>
  );
}
