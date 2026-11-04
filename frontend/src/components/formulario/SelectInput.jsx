// Nielsen 5 · Norman · WCAG 2.2 AA · Selector desplegable accesible sobre CampoFormulario · E-26 · E-42
import { forwardRef, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';

const SelectInput = forwardRef(function SelectInput(
  {
    id, name, nombre, etiqueta, obligatorio = true, ayuda = 'Seleccione una opción de la lista',
    error = '', value, valor, onChange, alCambiar, onBlur, alSalir, opciones = [],
    placeholder, textoPlaceholder = 'Seleccione una opción', incluirVacio = true,
    readOnly = false, soloLectura = false, className = '', ...props
  },
  ref
) {
  const idGenerado = useId();
  const nombreCampo = nombre || name || '';
  const idFinal = id || `select-${nombreCampo || idGenerado}`;
  const valorActual = valor !== undefined ? valor : (value ?? '');
  const manejarCambio = alCambiar || onChange;
  const manejarSalida = alSalir || onBlur;
  const esSoloLectura = Boolean(soloLectura || readOnly);
  const textoVacio = placeholder || textoPlaceholder;
  const describedBy = construirDescribedBy(idFinal, ayuda, error);
  const tieneError = Boolean(error);

  return (
    <CampoFormulario id={idFinal} etiqueta={etiqueta} obligatorio={obligatorio} ayuda={ayuda} error={error} className={className}>
      <select
        ref={ref}
        id={idFinal}
        name={nombreCampo}
        value={valorActual}
        onChange={(e) => { if (!esSoloLectura) manejarCambio?.(e); }}
        onBlur={manejarSalida}
        aria-readonly={esSoloLectura || undefined}
        aria-invalid={tieneError}
        aria-describedby={describedBy}
        className={`w-full min-h-control px-3.5 py-2 rounded-control border bg-superficie text-texto text-base transition-colors ${
          esSoloLectura ? 'bg-superficie-2 pointer-events-none' : ''
        } ${tieneError ? 'border-rechazada-texto' : 'border-borde-control'}`.trim()}
        {...props}
      >
        {incluirVacio && <option value="">{textoVacio}</option>}
        {opciones.map((op) => {
          const v = typeof op === 'object' ? op.valor : op;
          const et = typeof op === 'object' ? op.etiqueta : op;
          const des = typeof op === 'object' ? Boolean(op.deshabilitada) : false;
          return <option key={v} value={v} disabled={des}>{et}</option>;
        })}
      </select>
    </CampoFormulario>
  );
});

export default SelectInput;
