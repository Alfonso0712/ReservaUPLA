import { useState } from 'react';
import Campo from './Campo';

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
          >
            {mostrarClave ? '👁️' : '🔒'}
          </button>
        )}
      </div>
    </Campo>
  );
}
