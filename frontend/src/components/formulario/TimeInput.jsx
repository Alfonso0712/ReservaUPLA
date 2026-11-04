// Nielsen 5 · RN-04 · RV-09..11 · Control de hora con límites 07:00..22:00 y paso 900 s · E-14 · E-15
import { forwardRef, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';
import { HORA_APERTURA, HORA_CIERRE, PASO_HORA_SEGUNDOS } from '../../constants/reglas';
import { MENSAJES } from '../../constants/mensajes';

const TimeInput = forwardRef(function TimeInput(
  {
    id,
    name,
    nombre,
    etiqueta,
    obligatorio = true,
    ayuda = MENSAJES.AYUDA_HORARIO,
    error = '',
    value,
    valor,
    min = HORA_APERTURA,
    max = HORA_CIERRE,
    step = PASO_HORA_SEGUNDOS,
    onChange,
    alCambiar,
    onBlur,
    alSalir,
    readOnly = false,
    soloLectura = false,
    className = '',
    ...props
  },
  ref
) {
  const idGenerado = useId();
  const nombreCampo = nombre || name || '';
  const idFinal = id || `hora-${nombreCampo || idGenerado}`;
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
        type="time"
        value={valorActual}
        min={min}
        max={max}
        step={step}
        onChange={esSoloLectura ? undefined : manejarCambio}
        onBlur={manejarSalida}
        readOnly={esSoloLectura}
        aria-invalid={tieneError}
        aria-describedby={describedBy}
        className={`w-full min-h-control px-3.5 py-2 rounded-control border bg-superficie text-texto text-base cifra-tabular transition-colors read-only:bg-superficie-2 ${
          tieneError ? 'border-rechazada-texto' : 'border-borde-control'
        }`}
        {...props}
      />
    </CampoFormulario>
  );
});

export default TimeInput;
