// Shneiderman 2 · WCAG 2.2 AA · Un solo marcado semántico tabla→tarjetas · E-27 · E-28
import EstadoVacio from './EstadoVacio';

export default function TableList({
  caption,
  columnas = [],
  datos = [],
  claveFila = 'id',
  mensajeVacio = 'No se encontraron registros.',
  descripcionVacia = 'Intente ajustar los filtros aplicados.',
  accionVacia = null
}) {
  if (!datos || datos.length === 0) {
    return (
      <EstadoVacio
        titulo={mensajeVacio}
        descripcion={descripcionVacia}
        accion={accionVacia}
      />
    );
  }

  return (
    <div className="w-full rounded-tarjeta border border-borde bg-superficie overflow-hidden">
      <table className="w-full border-collapse text-left tabla-responsiva">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-superficie-2 border-b border-borde">
          <tr>
            {columnas.map((col) => (
              <th
                key={col.clave}
                scope="col"
                className={`px-4 py-3 text-sm font-semibold text-texto ${col.claseEncabezado || ''}`.trim()}
              >
                {col.encabezado}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-borde">
          {datos.map((fila, indice) => (
            <tr key={fila[claveFila] ?? indice} className="hover:bg-superficie-2 transition-colors">
              {columnas.map((col) => (
                <td
                  key={col.clave}
                  data-label={col.encabezado}
                  className={`px-4 py-3.5 text-sm text-texto align-middle ${col.claseCelda || ''}`.trim()}
                >
                  {col.render ? col.render(fila) : fila[col.clave]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
