// Nielsen 5 · Shneiderman 2 · WCAG 2.2 AA · Campo de texto accesible · E-26
import { forwardRef, useId } from 'react';
import CampoFormulario, { construirDescribedBy } from './CampoFormulario';
import Icono from '../ui/Icono';

const TextInput = forwardRef(function TextInput(
  {
    id, name, nombre, etiqueta, obligatorio = true, ayuda = '', error = '',
    type, tipo, value, valor, onChange, alCambiar, onBlur, alSalir,
    readOnly = false, soloLectura = false, placeholder = '', autoComplete,
    inputMode, enterKeyHint, maxLength, className = '', icono,
    mostrarOpcional = false, tamano = 'md', claseInput = '', ...props
  },
  ref
) {
  const idGenerado = useId();
  const nombreCampo = nombre || name || '';
  const idFinal = id || `campo-${nombreCampo || idGenerado}`;
  const tipoCampo = tipo || type || 'text';
  const valorActual = valor !== undefined ? valor : (value ?? '');
  const manejarCambio = alCambiar || onChange;
  const manejarSalida = alSalir || onBlur;
  const esSoloLectura = Boolean(soloLectura || readOnly);
  const describedBy = construirDescribedBy(idFinal, ayuda, error);
  const tieneError = Boolean(error);
  const iconoVisible = icono || (tipoCampo === 'search' ? 'Search' : null);
  const altura = tamano === 'sm' ? 'h-9 text-xs sm:text-sm' : 'h-10 text-sm sm:text-base';

  return (
    <CampoFormulario id={idFinal} etiqueta={etiqueta} obligatorio={obligatorio} ayuda={ayuda} error={error} className={className} mostrarOpcional={mostrarOpcional}>
      <div className="relative flex items-center w-full">
        {iconoVisible && (
          <Icono nombre={iconoVisible} className="w-4 h-4 text-texto-suave absolute left-3 pointer-events-none" />
        )}
        <input
          ref={ref}
          id={idFinal}
          name={nombreCampo}
          type={tipoCampo}
          value={valorActual}
          onChange={esSoloLectura ? undefined : manejarCambio}
          onBlur={manejarSalida}
          readOnly={esSoloLectura}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
          maxLength={maxLength}
          aria-invalid={tieneError}
          aria-describedby={describedBy}
          className={`w-full ${altura} ${iconoVisible ? 'pl-9 pr-3.5' : 'px-3.5'} py-2 rounded-control border transition-colors duration-150 read-only:bg-superficie-2 read-only:cursor-not-allowed ${
            tieneError
              ? 'border-rechazada-texto bg-superficie text-texto focus:border-rechazada-texto focus:ring-2 focus:ring-rechazada-texto/20 focus:outline-none'
              : 'border-borde bg-superficie text-texto hover:border-borde-control focus:bg-superficie focus:border-primario-enlace focus:ring-2 focus:ring-primario/20 focus:outline-none'
          } ${claseInput}`.trim()}
          {...props}
        />
      </div>
    </CampoFormulario>
  );
});

export default TextInput;
