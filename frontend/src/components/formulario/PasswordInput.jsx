// Nielsen 3 · Nielsen 5 · WCAG 2.2 AA · Contraseña con mostrar/ocultar dinámico y aviso Bloq Mayús · E-26
import { forwardRef, useState, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';
import { useBloqMayus } from '../../hooks/useBloqMayus';
import Icono from '../ui/Icono';
import { MENSAJES } from '../../constants/mensajes';

const PasswordInput = forwardRef(function PasswordInput(
  {
    id, name, nombre = 'contrasena', etiqueta = 'Contraseña', obligatorio = true,
    ayuda = MENSAJES.AYUDA_CONTRASENA_LOGIN, error = '', value, valor,
    onChange, alCambiar, onBlur, alSalir, readOnly = false, soloLectura = false,
    placeholder = 'Ejemplo: ClaveSegura2026', autoComplete = 'current-password',
    enterKeyHint = 'done', className = '', ...props
  },
  ref
) {
  const [mostrar, setMostrar] = useState(false);
  const { bloqMayusActivo, verificarEvento, limpiarBloqMayus } = useBloqMayus();
  const idGenerado = useId();
  const nombreCampo = name || nombre || 'contrasena';
  const idFinal = id || `clave-${nombreCampo || idGenerado}`;
  const valorActual = valor !== undefined ? valor : (value ?? '');
  const manejarCambio = alCambiar || onChange;
  const manejarSalida = alSalir || onBlur;
  const esSoloLectura = Boolean(soloLectura || readOnly);
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
    <CampoFormulario id={idFinal} etiqueta={etiqueta} obligatorio={obligatorio} ayuda={ayuda} error={error} avisoExtra={avisoMayus} className={className}>
      <div className="relative flex items-center w-full">
        <input
          ref={ref}
          id={idFinal}
          name={nombreCampo}
          type={mostrar ? 'text' : 'password'}
          value={valorActual}
          onChange={esSoloLectura ? undefined : manejarCambio}
          onKeyDown={verificarEvento}
          onKeyUp={verificarEvento}
          onBlur={(e) => { limpiarBloqMayus(); manejarSalida?.(e); }}
          readOnly={esSoloLectura}
          placeholder={placeholder}
          autoComplete={autoComplete}
          enterKeyHint={enterKeyHint}
          aria-invalid={tieneError}
          aria-describedby={describedBy}
          className={`w-full min-h-control pl-3.5 pr-12 py-2 rounded-control border bg-superficie text-texto text-base transition-colors read-only:bg-superficie-2 ${tieneError ? 'border-rechazada-texto' : 'border-borde-control'}`}
          {...props}
        />
        <button type="button" aria-label={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setMostrar((a) => !a)} className="absolute right-1 inline-flex items-center justify-center min-h-control min-w-control rounded-control text-texto-suave hover:text-texto bg-transparent border-0 cursor-pointer">
          <Icono nombre={mostrar ? 'EyeOff' : 'Eye'} className="w-5 h-5" />
        </button>
      </div>
    </CampoFormulario>
  );
});

export default PasswordInput;
