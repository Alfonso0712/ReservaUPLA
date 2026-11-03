import Campo from './Campo';

// RV-08 · E-16 · Nielsen 5 · ISO 9241-11 Eficiencia
export default function DateInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  obligatorio = false,
  ayuda = '',
  error = '',
  readOnly = false,
  inputRef
}) {
  const ayudaId = ayuda ? `${id}-ayuda` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const descripcionIds = [ayudaId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <Campo id={id} label={label} obligatorio={obligatorio} ayuda={ayuda} error={error}>
      <input
        ref={inputRef}
        id={id}
        type="date"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        readOnly={readOnly}
        aria-invalid={Boolean(error)}
        aria-describedby={descripcionIds}
        className="control-base"
      />
    </Campo>
  );
}
