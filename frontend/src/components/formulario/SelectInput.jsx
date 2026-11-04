// Nielsen 5 · Norman · WCAG 2.2 AA · E-26
import { forwardRef, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';

const SelectInput = forwardRef(function SelectInput(
  {
    id,
    name,
    etiqueta,
    obligatorio = true,
    ayuda = 'Seleccione una opción de la lista',
    error = '',
    value = '',
    onChange,
    onBlur,
    opciones = [],
    textoPlaceholder = 'Seleccione una opción',
    incluirVacio = true,
    readOnly = false,
    className = '',
    ...props
  },
  ref
) {
  const idGenerado = useId();
  const idFinal = id || `select-${name || idGenerado}`;
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
      <select
        ref={ref}
        id={idFinal}
        name={name}
        value={value}
        onChange={(e) => {
          if (readOnly) return;
          onChange?.(e);
        }}
        onBlur={onBlur}
        aria-readonly={readOnly || undefined}
        aria-invalid={tieneError}
        aria-describedby={describedBy}
        className={`w-full min-h-[2.75rem] px-3.5 py-2 rounded-control border bg-superficie text-texto text-base transition-colors ${
          readOnly ? 'bg-superficie-2 pointer-events-none' : ''
        } ${tieneError ? 'border-rechazada-texto' : 'border-borde-control'}`.trim()}
        {...props}
      >
        {incluirVacio && <option value="">{textoPlaceholder}</option>}
        {opciones.map((op) => {
          const valorOp = typeof op === 'object' ? op.valor : op;
          const etiquetaOp = typeof op === 'object' ? op.etiqueta : op;
          return (
            <option key={valorOp} value={valorOp}>
              {etiquetaOp}
            </option>
          );
        })}
      </select>
    </CampoFormulario>
  );
});

export default SelectInput;
