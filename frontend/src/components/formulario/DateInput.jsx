// Nielsen 5 · Norman · RV-08 · E-16
import { forwardRef, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';
import { MENSAJES } from '../../constants/mensajes';

const DateInput = forwardRef(function DateInput(
  {
    id,
    name,
    etiqueta = 'Fecha',
    obligatorio = true,
    ayuda = MENSAJES.AYUDA_FECHA,
    error = '',
    value = '',
    min,
    max,
    onChange,
    onBlur,
    readOnly = false,
    className = '',
    ...props
  },
  ref
) {
  const idGenerado = useId();
  const idFinal = id || `fecha-${name || idGenerado}`;
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
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={readOnly ? undefined : onChange}
        onBlur={onBlur}
        readOnly={readOnly}
        aria-invalid={tieneError}
        aria-describedby={describedBy}
        className={`w-full min-h-[2.75rem] px-3.5 py-2 rounded-control border bg-superficie text-texto text-base cifra-tabular transition-colors read-only:bg-superficie-2 ${
          tieneError ? 'border-rechazada-texto' : 'border-borde-control'
        }`}
        {...props}
      />
    </CampoFormulario>
  );
});

export default DateInput;
