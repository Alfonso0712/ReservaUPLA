// Nielsen 5 · RV-12 · Contador de caracteres n / 500 (mínimo 10)
import { forwardRef, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';
import { MIN_LONGITUD_MOTIVO, MAX_LONGITUD_MOTIVO } from '../../constants/reglas';
import { MENSAJES } from '../../constants/mensajes';

const TextAreaInput = forwardRef(function TextAreaInput(
  {
    id,
    name,
    etiqueta = 'Motivo',
    obligatorio = true,
    ayuda = MENSAJES.AYUDA_MOTIVO,
    error = '',
    value = '',
    rows = 3,
    minLength = MIN_LONGITUD_MOTIVO,
    maxLength = MAX_LONGITUD_MOTIVO,
    onChange,
    onBlur,
    readOnly = false,
    placeholder = 'Ejemplo: Práctica calificada del curso Construcción de Software',
    className = '',
    ...props
  },
  ref
) {
  const idGenerado = useId();
  const idFinal = id || `textarea-${name || idGenerado}`;
  const describedBy = construirDescribedBy(idFinal, ayuda, error);
  const tieneError = Boolean(error);
  const longitudActual = typeof value === 'string' ? value.trim().length : 0;
  const textoContador = `${longitudActual} / ${maxLength} (mínimo ${minLength})`;

  return (
    <CampoFormulario
      id={idFinal}
      etiqueta={etiqueta}
      obligatorio={obligatorio}
      ayuda={ayuda}
      error={error}
      contador={textoContador}
      className={className}
    >
      <textarea
        ref={ref}
        id={idFinal}
        name={name}
        rows={rows}
        value={value}
        maxLength={maxLength}
        onChange={readOnly ? undefined : onChange}
        onBlur={onBlur}
        readOnly={readOnly}
        placeholder={placeholder}
        aria-invalid={tieneError}
        aria-describedby={describedBy}
        className={`w-full p-3.5 rounded-control border bg-superficie text-texto text-base transition-colors read-only:bg-superficie-2 ${
          tieneError ? 'border-rechazada-texto' : 'border-borde-control'
        }`}
        {...props}
      />
    </CampoFormulario>
  );
});

export default TextAreaInput;
