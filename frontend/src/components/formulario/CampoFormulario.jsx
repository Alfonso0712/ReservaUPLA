// Nielsen 4 · Nielsen 6 · Nielsen 9 · WCAG 2.2 AA · E-26
export function construirDescribedBy(id, ayuda, error, extraId = '') {
  const ids = [];
  if (ayuda) ids.push(`${id}-ayuda`);
  if (error) ids.push(`${id}-error`);
  if (extraId) ids.push(extraId);
  return ids.length > 0 ? ids.join(' ') : undefined;
}

export default function CampoFormulario({
  id, etiqueta, obligatorio = true, ayuda = '', error = '',
  contador = null, avisoExtra = null, children, className = '', mostrarOpcional = false
}) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`.trim()}>
      {etiqueta && (
        <label htmlFor={id} className="text-sm font-semibold text-texto">
          <span>{etiqueta}</span>
          {obligatorio ? (
            <span className="ml-1 text-xs font-normal text-texto-suave" title="Campo obligatorio">(*)</span>
          ) : mostrarOpcional ? (
            <span className="ml-1 text-xs font-normal text-texto-suave" title="Campo opcional">(opcional)</span>
          ) : null}
        </label>
      )}
      {children}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        {ayuda && <span id={`${id}-ayuda`} className="text-xs text-texto-suave">{ayuda}</span>}
        {contador && <span className="text-xs text-texto-suave cifra-tabular ml-auto">{contador}</span>}
      </div>
      {avisoExtra}
      {error && <p id={`${id}-error`} role="alert" className="text-xs font-semibold text-rechazada-texto m-0">{error}</p>}
    </div>
  );
}
