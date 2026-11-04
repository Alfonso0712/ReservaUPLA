// Nielsen 3 · Nielsen 5 · WCAG 2.2 AA · E-26
import { forwardRef, useState, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';
import { useBloqMayus } from '../../hooks/useBloqMayus';
import Icono from '../ui/Icono';
import { MENSAJES } from '../../constants/mensajes';

const PasswordInput = forwardRef(function PasswordInput(
  {
    id,
    name = 'contrasena',
    etiqueta = 'Contraseña',
    obligatorio = true,
    ayuda = MENSAJES.AYUDA_CONTRASENA_LOGIN,
    error = '',
    value = '',
    onChange,
    onBlur,
    readOnly = false,
    placeholder = 'Ejemplo: ClaveSegura2026',
    autoComplete = 'current-password',
    enterKeyHint = 'done',
    className = '',
    ...props
  },
  ref
) {
  const [mostrar, setMostrar] = useState(false);
  const { bloqMayusActivo, verificarEvento, limpiarBloqMayus } = useBloqMayus();
  const idGenerado = useId();
  const idFinal = id || `clave-${name || idGenerado}`;
  const idAvisoMayus = bloqMayusActivo ? `${idFinal}-mayus` : '';
  const describedBy = construirDescribedBy(idFinal, ayuda, error, idAvisoMayus);
  const tieneError = Boolean(error);

  const avisoMayus = bloqMayusActivo ? (
    <p id={idAvisoMayus} role="status" className="flex items-center gap-1.5 text-sm font-medium text-pendiente-texto m-0">
      <Icono nombre="AlertTriangle" className="w-4 h-4 shrink-0" />
      <span>{MENSAJES.BLOQ_MAYUS_ACTIVO}</span>
    </p>
  ) : null;

  return (
    <CampoFormulario
      id={idFinal}
      etiqueta={etiqueta}
      obligatorio={obligatorio}
      ayuda={ayuda}
      error={error}
      avisoExtra={avisoMayus}
      className={className}
    >
      <div className="relative flex items-center w-full">
        <input
          ref={ref}
          id={idFinal}
          name={name}
          type={mostrar ? 'text' : 'password'}
          value={value}
          onChange={readOnly ? undefined : onChange}
          onKeyDown={verificarEvento}
          onKeyUp={verificarEvento}
          onBlur={(e) => {
            limpiarBloqMayus();
            onBlur?.(e);
          }}
          readOnly={readOnly}
          placeholder={placeholder}
          autoComplete={autoComplete}
          enterKeyHint={enterKeyHint}
          aria-invalid={tieneError}
          aria-describedby={describedBy}
          className={`w-full min-h-[2.75rem] pl-3.5 pr-12 py-2 rounded-control border bg-superficie text-texto text-base transition-colors read-only:bg-superficie-2 ${
            tieneError ? 'border-rechazada-texto' : 'border-borde-control'
          }`}
          {...props}
        />
        <button
          type="button"
          aria-label={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          onClick={() => setMostrar((actual) => !actual)}
          className="absolute right-1 inline-flex items-center justify-center min-h-[2.75rem] min-w-[2.75rem] rounded-control text-texto-suave hover:text-texto bg-transparent border-0 cursor-pointer"
        >
          <Icono nombre={mostrar ? 'EyeOff' : 'Eye'} className="w-5 h-5" />
        </button>
      </div>
    </CampoFormulario>
  );
});

export default PasswordInput;
