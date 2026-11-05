// Nielsen 5 · Shneiderman 6 · WCAG 2.2 AA · Campo de contraseña con revelación y aviso de Bloq Mayús
import { forwardRef, useState, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';
import Icono from '../ui/Icono';
import { MENSAJES } from '../../constants/mensajes';

const PasswordInput = forwardRef(function PasswordInput(
  {
    id, name, nombre, etiqueta, obligatorio = true, ayuda = '', error = '',
    value, valor, onChange, alCambiar, onBlur, alSalir,
    readOnly = false, soloLectura = false, placeholder = '••••••••', autoComplete = 'current-password',
    enterKeyHint, className = '', ...props
  },
  ref
) {
  const [mostrar, setMostrar] = useState(false);
  const [bloqMayusActivo, setBloqMayusActivo] = useState(false);
  const idGenerado = useId();
  const idAvisoMayus = `${idGenerado}-bloqmayus`;
  const nombreCampo = nombre || name || 'contrasena';
  const idFinal = id || `password-${nombreCampo}`;
  const valorActual = valor !== undefined ? valor : (value ?? '');
  const manejarCambio = alCambiar || onChange;
  const manejarSalida = alSalir || onBlur;
  const esSoloLectura = Boolean(soloLectura || readOnly);
  const describedByBase = construirDescribedBy(idFinal, ayuda, error);
  const describedBy = bloqMayusActivo ? `${describedByBase} ${idAvisoMayus}`.trim() : describedByBase;
  const tieneError = Boolean(error);

  const verificarBloqMayus = (e) => {
    if (typeof e.getModifierState === 'function') setBloqMayusActivo(e.getModifierState('CapsLock'));
  };
  const limpiarBloqMayus = () => setBloqMayusActivo(false);

  const avisoBloqMayus = bloqMayusActivo ? (
    <p id={idAvisoMayus} role="status" className="flex items-center gap-1.5 text-xs font-medium text-pendiente-texto m-0">
      <Icono nombre="AlertTriangle" className="w-3.5 h-3.5" />
      <span>{MENSAJES.BLOQ_MAYUS_ACTIVO}</span>
    </p>
  ) : null;

  return (
    <CampoFormulario id={idFinal} etiqueta={etiqueta} obligatorio={obligatorio} ayuda={ayuda} error={error} className={className} extraAyuda={avisoBloqMayus}>
      <div className="relative flex items-center w-full">
        <input
          ref={ref}
          id={idFinal}
          name={nombreCampo}
          type={mostrar ? 'text' : 'password'}
          value={valorActual}
          onChange={esSoloLectura ? undefined : manejarCambio}
          onKeyDown={verificarBloqMayus}
          onKeyUp={verificarBloqMayus}
          onBlur={(e) => { limpiarBloqMayus(); manejarSalida?.(e); }}
          readOnly={esSoloLectura}
          placeholder={placeholder}
          autoComplete={autoComplete}
          enterKeyHint={enterKeyHint}
          aria-invalid={tieneError}
          aria-describedby={describedBy}
          className={`w-full min-h-[42px] pl-3.5 pr-11 py-2 rounded-control border text-sm sm:text-base transition-all duration-200 ease-in-out read-only:bg-superficie-2 ${
            tieneError
              ? 'border-rechazada-texto bg-superficie text-texto focus:border-rechazada-texto focus:ring-4 focus:ring-rechazada-texto/15 focus:outline-none'
              : 'border-borde-control/40 bg-[#F8FAFC] dark:bg-superficie-2 text-texto focus:bg-superficie focus:border-primario-enlace focus:ring-4 focus:ring-primario/15 focus:outline-none'
          }`}
          {...props}
        />
        <button type="button" aria-label={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setMostrar((a) => !a)} className="absolute right-1.5 inline-flex items-center justify-center h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] rounded-full text-texto-suave hover:text-texto bg-transparent border-0 cursor-pointer">
          <Icono nombre={mostrar ? 'EyeOff' : 'Eye'} className="w-4 h-4" />
        </button>
      </div>
    </CampoFormulario>
  );
});

export default PasswordInput;
