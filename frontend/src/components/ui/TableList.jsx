// Shneiderman 2 · WCAG 2.2 AA · Un solo marcado semántico tabla con paginación integrada · E-27 · E-28
import { useState, useEffect } from 'react';
import EstadoVacio from './EstadoVacio';
import PaginacionTabla from './PaginacionTabla';

export default function TableList({
  caption, columnas = [], datos = [], claveFila = 'id',
  mensajeVacio = 'No se encontraron registros.',
  descripcionVacia = 'Intente ajustar los filtros aplicados.',
  accionVacia = null, paginacion = true, tamanoPagina = 10
}) {
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    setPaginaActual(1);
  }, [datos.length]);

  if (!datos || datos.length === 0) {
    return <EstadoVacio titulo={mensajeVacio} descripcion={descripcionVacia} accion={accionVacia} />;
  }

  const totalPaginas = Math.max(1, Math.ceil(datos.length / tamanoPagina));
  const paginaSegura = Math.min(Math.max(1, paginaActual), totalPaginas);
  const datosVisibles = paginacion ? datos.slice((paginaSegura - 1) * tamanoPagina, paginaSegura * tamanoPagina) : datos;

  return (
    <div className="w-full rounded-tarjeta border border-borde bg-superficie overflow-hidden">
      <table className="w-full border-collapse text-left tabla-responsiva">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-superficie-2 border-b border-borde">
          <tr>
            {columnas.map((col) => (
              <th key={col.clave} scope="col" className={`px-4 py-3 text-sm font-semibold text-texto ${col.claseEncabezado || ''}`.trim()}>
                {col.encabezado}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-borde">
          {datosVisibles.map((fila, indice) => (
            <tr key={fila[claveFila] ?? indice} className="hover:bg-superficie-2 transition-colors">
              {columnas.map((col) => (
                <td key={col.clave} data-label={col.encabezado} className={`px-4 py-3.5 text-sm text-texto align-middle ${col.claseCelda || ''}`.trim()}>
                  {col.render ? col.render(fila) : fila[col.clave]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {paginacion && (
        <PaginacionTabla
          paginaActual={paginaSegura}
          totalPaginas={totalPaginas}
          totalRegistros={datos.length}
          tamanoPagina={tamanoPagina}
          alCambiarPagina={setPaginaActual}
        />
      )}
    </div>
  );
}
