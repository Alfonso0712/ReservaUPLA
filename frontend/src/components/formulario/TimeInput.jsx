// Nielsen 5 · RN-04 · RV-09..11 · E-14 · E-15
import { forwardRef, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';
import { HORA_APERTURA, HORA_CIERRE, PASO_HORA_SEGUNDOS } from '../../constants/reglas';
import { MENSAJES } from '../../constants/mensajes';

const TimeInput = forwardRef(function TimeInput(
  {
    id,
    name,
    etiqueta,
    obligatorio = true,
    ayuda = MENSAJES.AYUDA_HORARIO,
    error = '',
    value = '',
    min = HORA_APERTURA,
    max = HORA_CIERRE,
    step = PASO_HORA_SEGUNDOS,
    onChange,
    onBlur,
    readOnly = false,
    className = '',
    ...props
  },
  ref
) {
  const idGenerado = useId();
  const idFinal = id || `hora-${name || idGenerado}`;
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
        type="time"
        value={value}
        min={min}
        max={max}
        step={step}
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

export default TimeInput;
