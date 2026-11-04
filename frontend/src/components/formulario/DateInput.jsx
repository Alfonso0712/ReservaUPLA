// Nielsen 5 · Norman · RV-08 · Control de fecha con restricción min=hoy sobre CampoFormulario · E-16
import { forwardRef, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';
import { MENSAJES } from '../../constants/mensajes';

const DateInput = forwardRef(function DateInput(
  {
    id,
    name,
    nombre,
    etiqueta = 'Fecha',
    obligatorio = true,
    ayuda = MENSAJES.AYUDA_FECHA,
    error = '',
    value,
    valor,
    min,
    max,
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
  const idFinal = id || `fecha-${nombreCampo || idGenerado}`;
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
        type="date"
        value={valorActual}
        min={min}
        max={max}
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

export default DateInput;
