// Nielsen 5 · Norman · WCAG 2.2 AA · Selector desplegable accesible · E-26 · E-42
import { forwardRef, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';

const SelectInput = forwardRef(function SelectInput(
  {
    id, name, nombre, etiqueta, obligatorio = true, ayuda = '',
    error = '', value, valor, onChange, alCambiar, onBlur, alSalir, opciones = [],
    placeholder, textoPlaceholder = 'Seleccione una opción', incluirVacio = true,
    readOnly = false, soloLectura = false, className = '', mostrarOpcional = false,
    tamano = 'md', claseSelect = '', ...props
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
  const altura = tamano === 'sm' ? 'h-9 text-xs sm:text-sm' : 'h-10 text-sm sm:text-base';

  return (
    <CampoFormulario id={idFinal} etiqueta={etiqueta} obligatorio={obligatorio} ayuda={ayuda} error={error} className={className} mostrarOpcional={mostrarOpcional}>
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
        className={`w-full ${altura} px-3.5 py-2 rounded-control border bg-superficie text-texto transition-colors ${
          esSoloLectura ? 'bg-superficie-2 pointer-events-none' : ''
        } ${tieneError ? 'border-rechazada-texto focus:border-rechazada-texto focus:ring-2 focus:ring-rechazada-texto/20 focus:outline-none' : 'border-borde hover:border-borde-control focus:border-primario-enlace focus:ring-2 focus:ring-primario/20 focus:outline-none'} ${claseSelect}`.trim()}
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
