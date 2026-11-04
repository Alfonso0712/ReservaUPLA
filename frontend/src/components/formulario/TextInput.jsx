// Nielsen 5 · Shneiderman 2 · WCAG 2.2 AA · Campo de texto accesible sobre CampoFormulario · E-26
import { forwardRef, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';

const TextInput = forwardRef(function TextInput(
  {
    id, name, nombre, etiqueta, obligatorio = true, ayuda = '', error = '',
    type, tipo, value, valor, onChange, alCambiar, onBlur, alSalir,
    readOnly = false, soloLectura = false, placeholder = '', autoComplete,
    inputMode, enterKeyHint, maxLength, className = '', ...props
  },
  ref
) {
  const idGenerado = useId();
  const nombreCampo = nombre || name || '';
  const idFinal = id || `campo-${nombreCampo || idGenerado}`;
  const tipoCampo = tipo || type || 'text';
  const valorActual = valor !== undefined ? valor : (value ?? '');
  const manejarCambio = alCambiar || onChange;
  const manejarSalida = alSalir || onBlur;
  const esSoloLectura = Boolean(soloLectura || readOnly);
  const describedBy = construirDescribedBy(idFinal, ayuda, error);
  const tieneError = Boolean(error);

  return (
    <CampoFormulario id={idFinal} etiqueta={etiqueta} obligatorio={obligatorio} ayuda={ayuda} error={error} className={className}>
      <input
        ref={ref}
        id={idFinal}
        name={nombreCampo}
        type={tipoCampo}
        value={valorActual}
        onChange={esSoloLectura ? undefined : manejarCambio}
        onBlur={manejarSalida}
        readOnly={esSoloLectura}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint}
        maxLength={maxLength}
        aria-invalid={tieneError}
        aria-describedby={describedBy}
        className={`w-full min-h-[38px] px-3 py-1.5 rounded-control border bg-superficie text-texto text-sm transition-colors read-only:bg-superficie-2 read-only:cursor-not-allowed ${
          tieneError ? 'border-rechazada-texto' : 'border-borde-control'
        }`}
        {...props}
      />
    </CampoFormulario>
  );
});

export default TextInput;
