// Shneiderman 2 · WCAG 2.2 AA · ISO 9241-110 · Tabla semántica accesible con ordenación
import { useState, useEffect, useMemo } from 'react';
import EstadoVacio from './EstadoVacio';
import PaginacionTabla from './PaginacionTabla';
import Icono from './Icono';
import { ordenarDatos } from '../../utils/ordenarDatos';

export default function TableList({
  caption, columnas = [], datos = [], claveFila = 'id',
  mensajeVacio = 'No se encontraron registros.',
  descripcionVacia = 'Intente ajustar los filtros aplicados.',
  accionVacia = null, paginacion = true, tamanoPagina = 10
}) {
  const [paginaActual, setPaginaActual] = useState(1);
  const [orden, setOrden] = useState({ clave: null, dir: 'asc' });

  useEffect(() => { setPaginaActual(1); }, [datos.length]);

  const datosOrdenados = useMemo(() => ordenarDatos(datos, orden.clave, orden.dir), [datos, orden]);

  if (!datos || datos.length === 0) {
    return <EstadoVacio titulo={mensajeVacio} descripcion={descripcionVacia} accion={accionVacia} />;
  }

  const alternar = (k) => {
    setOrden((p) => (p.clave === k ? (p.dir === 'asc' ? { clave: k, dir: 'desc' } : { clave: null, dir: 'asc' }) : { clave: k, dir: 'asc' }));
  };

  const totalPaginas = Math.max(1, Math.ceil(datos.length / tamanoPagina));
  const paginaSegura = Math.min(Math.max(1, paginaActual), totalPaginas);
  const datosVisibles = paginacion ? datosOrdenados.slice((paginaSegura - 1) * tamanoPagina, paginaSegura * tamanoPagina) : datosOrdenados;

  return (
    <div className="w-full rounded-tarjeta border border-borde bg-superficie overflow-hidden shadow-sm">
      <div className="overflow-x-auto max-h-[72vh]">
        <table className="w-full border-collapse text-left tabla-responsiva">
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 z-10 bg-superficie-2 border-b border-borde">
            <tr>
              {columnas.map((col) => {
                const activo = orden.clave === col.clave;
                const ariaSort = col.ordenable ? (activo ? (orden.dir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined;
                return (
                  <th key={col.clave} scope="col" aria-sort={ariaSort} className={`px-4 py-3 text-[0.8125rem] font-semibold text-texto-suave align-middle ${col.claseEncabezado || ''}`.trim()}>
                    {col.ordenable ? (
                      <button type="button" onClick={() => alternar(col.clave)} className="inline-flex items-center gap-1.5 font-semibold text-texto-suave hover:text-texto focus:outline-none focus:underline" aria-label={`Ordenar por ${col.encabezado}`}>
                        <span>{col.encabezado}</span>
                        {activo && <Icono nombre={orden.dir === 'asc' ? 'ArrowUp' : 'ArrowDown'} className="w-3.5 h-3.5 text-primario shrink-0" />}
                      </button>
                    ) : col.encabezado}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-borde/70">
            {datosVisibles.map((fila, indice) => (
              <tr key={fila[claveFila] ?? indice} className="h-14 sm:h-16 hover:bg-superficie-2/70 transition-colors">
                {columnas.map((col) => (
                  <td key={col.clave} data-label={col.encabezado} className={`px-4 py-3 text-[0.9375rem] text-texto align-middle ${col.claseCelda || ''}`.trim()}>
                    {col.render ? col.render(fila) : fila[col.clave]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginacion && <PaginacionTabla paginaActual={paginaSegura} totalPaginas={totalPaginas} totalRegistros={datos.length} tamanoPagina={tamanoPagina} alCambiarPagina={setPaginaActual} />}
    </div>
  );
}
