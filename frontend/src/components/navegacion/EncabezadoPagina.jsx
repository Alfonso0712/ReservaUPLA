// Nielsen 4 · WCAG 2.2 AA · Plantilla única: h1 enfocado -> descripción -> acción primaria · E-25
import { useEffect } from 'react';
import { useFocoAlMontar } from '../../hooks/useFocoAlMontar';

export default function EncabezadoPagina({
  titulo,
  descripcion = '',
  accionPrimaria = null,
  enfocarAlMontar = true
}) {
  const refTitulo = useFocoAlMontar(enfocarAlMontar, titulo);

  useEffect(() => {
    if (titulo) {
      document.title = 'ReservaUPLA';
    }
  }, [titulo]);

  return (
    <header className="mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            ref={refTitulo}
            tabIndex={-1}
            className="text-[1.75rem] font-bold text-texto outline-none leading-tight"
          >
            {titulo}
          </h1>
          {descripcion && (
            <p className="mt-1 text-[1rem] text-texto-suave ancho-lectura">
              {descripcion}
            </p>
          )}
        </div>
        {accionPrimaria && (
          <div className="shrink-0 flex items-center gap-3">
            {accionPrimaria}
          </div>
        )}
      </div>
    </header>
  );
}
