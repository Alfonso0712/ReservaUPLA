// Shneiderman 2 · WCAG 2.2 AA · ISO 9241-110 · Tabla accesible con paginación, skeleton y orden
import { useState, useEffect, useMemo } from 'react';
import EstadoVacio from './EstadoVacio';
import PaginacionTabla from './PaginacionTabla';
import Button from './Button';
import Icono from './Icono';
import { ordenarDatos } from '../../utils/ordenarDatos';

export default function TableList({
  caption, columnas = [], datos = [], claveFila = 'id', cargando = false,
  mensajeVacio = 'No se encontraron registros.', descripcionVacia = '',
  accionVacia = null, paginacion = true, tamanoPaginaInicial = 10,
  esFiltroActivo = false, alLimpiarFiltros = null
}) {
  const [paginaActual, setPaginaActual] = useState(1);
  const [tamano, setTamano] = useState(tamanoPaginaInicial);
  const [orden, setOrden] = useState({ clave: null, dir: 'asc' });

  useEffect(() => { setPaginaActual(1); }, [datos.length]);

  const datosOrdenados = useMemo(() => ordenarDatos(datos, orden.clave, orden.dir), [datos, orden]);

  if (!cargando && (!datos || datos.length === 0)) {
    if (esFiltroActivo && alLimpiarFiltros) {
      return <EstadoVacio icono="SearchX" titulo="No se encontraron resultados para los filtros aplicados" descripcion="Pruebe modificando los términos de búsqueda o limpie los filtros activos." accion={<Button variante="ghost" icono="RotateCcw" onClick={alLimpiarFiltros}>Limpiar filtros</Button>} />;
    }
    return <EstadoVacio titulo={mensajeVacio} descripcion={descripcionVacia} accion={accionVacia} />;
  }

  const alternar = (k) => setOrden((p) => (p.clave === k ? (p.dir === 'asc' ? { clave: k, dir: 'desc' } : { clave: null, dir: 'asc' }) : { clave: k, dir: 'asc' }));
  const totalPaginas = Math.max(1, Math.ceil(datos.length / tamano));
  const paginaSegura = Math.min(Math.max(1, paginaActual), totalPaginas);
  const datosVisibles = paginacion ? datosOrdenados.slice((paginaSegura - 1) * tamano, paginaSegura * tamano) : datosOrdenados;

  return (
    <div className="w-full rounded-tarjeta border border-borde bg-superficie overflow-hidden shadow-sm">
      <table className="w-full border-collapse text-left tabla-responsiva">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-superficie-2 border-b border-borde">
          <tr>
            {columnas.map((col) => {
              const activo = orden.clave === col.clave;
              const ariaSort = col.ordenable ? (activo ? (orden.dir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined;
              return (
                <th key={col.clave} scope="col" aria-sort={ariaSort} className={`px-4 py-3 text-[0.8125rem] font-semibold text-texto-suave align-middle ${col.claseEncabezado || ''}`.trim()}>
                  {col.ordenable ? (
                    <button type="button" onClick={() => alternar(col.clave)} className="inline-flex items-center gap-1.5 font-semibold text-texto-suave hover:text-texto focus:outline-none focus:underline" aria-label={`Ordenar por ${col.encabezado}`}>
                      <span>{col.encabezado}</span>{activo && <Icono nombre={orden.dir === 'asc' ? 'ArrowUp' : 'ArrowDown'} className="w-3.5 h-3.5 text-primario shrink-0" />}
                    </button>
                  ) : col.encabezado}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-borde">
          {cargando ? Array.from({ length: 5 }).map((_, i) => (
            <tr key={`skel-${i}`} className="h-14 animate-pulse">{columnas.map((c, ci) => <td key={c.clave || ci} className="px-4 py-3"><div className="h-4 bg-superficie-2 rounded w-4/5" /></td>)}</tr>
          )) : datosVisibles.map((fila, indice) => (
            <tr key={fila[claveFila] ?? indice} className="h-14 sm:h-16 hover:bg-superficie-2 transition-colors">
              {columnas.map((col) => <td key={col.clave} data-label={col.encabezado} className={`px-4 py-3 text-[0.9375rem] text-texto align-middle ${col.claseCelda || ''}`.trim()}>{col.render ? col.render(fila) : fila[col.clave]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {paginacion && !cargando && <PaginacionTabla paginaActual={paginaSegura} totalPaginas={totalPaginas} totalRegistros={datos.length} tamanoPagina={tamano} alCambiarPagina={setPaginaActual} alCambiarTamanoPagina={(t) => { setTamano(t); setPaginaActual(1); }} />}
    </div>
  );
}
