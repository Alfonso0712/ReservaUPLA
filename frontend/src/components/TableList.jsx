// Shneiderman 2 · E-27 · E-28 · Tabla accesible con caption y scope
export default function TableList({
  titulo = 'Listado de elementos',
  columnas = [],
  filas = [],
  mensajeVacio = 'No se encontraron registros.',
  renderFila
}) {
  if (!filas || filas.length === 0) {
    return <div className="tabla-vacia" role="status">{mensajeVacio}</div>;
  }

  return (
    <div className="tabla-contenedor" role="region" aria-label={titulo} tabIndex={0}>
      <table className="tabla-accesible">
        <caption className="sr-only">{titulo}</caption>
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={col.id} scope="col">
                {col.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((item, index) => renderFila ? renderFila(item, index) : null)}
        </tbody>
      </table>
    </div>
  );
}
