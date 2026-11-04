// Nielsen 5 · RV-12 · Área de texto con contador "n / 500 (mínimo 10)" · E-05 · E-26
import { forwardRef, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';
import { MIN_LONGITUD_MOTIVO, MAX_LONGITUD_MOTIVO } from '../../constants/reglas';
import { MENSAJES } from '../../constants/mensajes';

const TextAreaInput = forwardRef(function TextAreaInput(
  {
    id,
    name,
    nombre,
    etiqueta = 'Motivo',
    obligatorio = true,
    ayuda = MENSAJES.AYUDA_MOTIVO,
    error = '',
    value,
    valor,
    rows,
    filas = 3,
    minLength = MIN_LONGITUD_MOTIVO,
    maxLength = MAX_LONGITUD_MOTIVO,
    onChange,
    alCambiar,
    onBlur,
    alSalir,
    readOnly = false,
    soloLectura = false,
    placeholder = 'Ejemplo: Práctica calificada del curso Construcción de Software',
    className = '',
    ...props
  },
  ref
) {
  const idGenerado = useId();
  const nombreCampo = nombre || name || '';
  const idFinal = id || `textarea-${nombreCampo || idGenerado}`;
  const valorActual = valor !== undefined ? valor : (value ?? '');
  const manejarCambio = alCambiar || onChange;
  const manejarSalida = alSalir || onBlur;
  const esSoloLectura = Boolean(soloLectura || readOnly);
  const filasFinal = rows || filas || 3;
  const describedBy = construirDescribedBy(idFinal, ayuda, error);
  const tieneError = Boolean(error);
  const longitudActual = typeof valorActual === 'string' ? valorActual.trim().length : 0;
  const textoContador = `${longitudActual} / ${maxLength} (mínimo ${minLength})`;

  return (
    <CampoFormulario id={idFinal} etiqueta={etiqueta} obligatorio={obligatorio} ayuda={ayuda} error={error} contador={textoContador} className={className}>
      <textarea
        ref={ref}
        id={idFinal}
        name={nombreCampo}
        rows={filasFinal}
        value={valorActual}
        maxLength={maxLength}
        onChange={esSoloLectura ? undefined : manejarCambio}
        onBlur={manejarSalida}
        readOnly={esSoloLectura}
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
