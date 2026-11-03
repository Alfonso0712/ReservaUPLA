import Campo from './Campo';

// RV-09 · RV-10 · RV-11 · RN-03 · RN-04 · E-14 · E-15
export default function TimeInput({
  id,
  label,
  value,
  onChange,
  min = '07:00',
  max = '22:00',
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
        type="time"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step="900"
        readOnly={readOnly}
        aria-invalid={Boolean(error)}
        aria-describedby={descripcionIds}
        className="control-base"
      />
    </Campo>
  );
}
