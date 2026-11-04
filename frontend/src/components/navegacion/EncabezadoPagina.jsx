// Nielsen 4 · WCAG 2.2 AA · Plantilla única: migas -> h1 enfocado -> descripción -> acción primaria · E-25
import { useEffect } from 'react';
import { useFocoAlMontar } from '../../hooks/useFocoAlMontar';
import MigasDePan from './MigasDePan';

export default function EncabezadoPagina({
  migas = null,
  titulo,
  descripcion = '',
  accionPrimaria = null,
  enfocarAlMontar = true
}) {
  const refTitulo = useFocoAlMontar(enfocarAlMontar, titulo);

  useEffect(() => {
    if (titulo) {
      document.title = `${titulo} | ReservaUPLA`;
    }
  }, [titulo]);

  return (
    <header className="mb-6 pb-4 border-b border-borde">
      <div className="mb-2">
        <MigasDePan items={migas} />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            ref={refTitulo}
            tabIndex={-1}
            className="text-2xl font-bold text-texto outline-none"
          >
            {titulo}
          </h1>
          {descripcion && (
            <p className="mt-1 text-base text-texto-suave ancho-lectura">
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
