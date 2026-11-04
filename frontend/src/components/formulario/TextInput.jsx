// Nielsen 5 · Shneiderman 2 · WCAG 2.2 AA · E-26
import { forwardRef, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';

const TextInput = forwardRef(function TextInput(
  {
    id,
    name,
    etiqueta,
    obligatorio = true,
    ayuda = 'Ingrese el dato solicitado',
    error = '',
    type = 'text',
    value = '',
    onChange,
    onBlur,
    readOnly = false,
    placeholder = '',
    autoComplete,
    inputMode,
    enterKeyHint,
    maxLength,
    className = '',
    ...props
  },
  ref
) {
  const idGenerado = useId();
  const idFinal = id || `campo-${name || idGenerado}`;
  const describedBy = construirDescribedBy(idFinal, ayuda, error);
  const tieneError = Boolean(error);

  return (
    <CampoFormulario
      id={idFinal}
      etiqueta={etiqueta}
      obligatorio={obligatorio}
      ayuda={ayuda}
      error={error}
      className={className}
    >
      <input
        ref={ref}
        id={idFinal}
        name={name}
        type={type}
        value={value}
        onChange={readOnly ? undefined : onChange}
        onBlur={onBlur}
        readOnly={readOnly}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint}
        maxLength={maxLength}
        aria-invalid={tieneError}
        aria-describedby={describedBy}
        className={`w-full min-h-[2.75rem] px-3.5 py-2 rounded-control border bg-superficie text-texto text-base transition-colors read-only:bg-superficie-2 read-only:cursor-not-allowed ${
          tieneError ? 'border-rechazada-texto' : 'border-borde-control'
        }`}
        {...props}
      />
    </CampoFormulario>
  );
});

export default TextInput;
