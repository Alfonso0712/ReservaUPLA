import Campo from './Campo';

// Nielsen 4 · Nielsen 5 · Shneiderman 2
export default function SelectInput({
  id,
  label,
  value,
  onChange,
  opciones = [],
  obligatorio = false,
  ayuda = '',
  error = '',
  readOnly = false,
  selectRef
}) {
  const ayudaId = ayuda ? `${id}-ayuda` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const descripcionIds = [ayudaId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <Campo id={id} label={label} obligatorio={obligatorio} ayuda={ayuda} error={error}>
      <select
        ref={selectRef}
        id={id}
        value={value}
        onChange={onChange}
        disabled={readOnly}
        aria-invalid={Boolean(error)}
        aria-describedby={descripcionIds}
        className="control-base"
      >
        <option value="">Seleccione una opción</option>
        {opciones.map((op) => (
          <option key={op.valor} value={op.valor}>
            {op.texto}
          </option>
        ))}
      </select>
    </Campo>
  );
}
