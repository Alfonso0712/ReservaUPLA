import TableList from '../components/TableList';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import SelectInput from '../components/SelectInput';
import DateInput from '../components/DateInput';
import { useReservas } from '../hooks/useReservas';

const OPCIONES_ESTADO = [
  { valor: 'Pendiente', texto: 'Pendiente' },
  { valor: 'Aprobada', texto: 'Aprobada' },
  { valor: 'Rechazada', texto: 'Rechazada' },
  { valor: 'Cancelada', texto: 'Cancelada' }
];

// RF-05 · E-32
export default function ListadoReservasPage({ alVerDetalle }) {
  const {
    reservas, total, pagina, setPagina,
    estadoFiltro, setEstadoFiltro,
    fechaFiltro, setFechaFiltro,
    cargando, error
  } = useReservas();

  return (
    <div className="pagina-listado-reservas">
      <h1 className="pagina-titulo">Listado de Reservas</h1>
      <AlertMessage tipo="error" mensaje={error} />
      <div className="barra-filtros">
        <SelectInput id="filtro-estado" label="Estado" value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} opciones={OPCIONES_ESTADO} />
        <DateInput id="filtro-fecha" label="Fecha" value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)} />
      </div>

      <TableList
        titulo="Reservas registradas"
        columnas={[{ id: 'fec', titulo: 'Fecha' }, { id: 'hor', titulo: 'Horario' }, { id: 'amb', titulo: 'Ambiente' }, { id: 'sol', titulo: 'Solicitante' }, { id: 'est', titulo: 'Estado' }, { id: 'acc', titulo: 'Acciones' }]}
        filas={reservas}
        renderFila={(r) => (
          <tr key={r.id}>
            <td>{r.fecha}</td>
            <td>{r.horaInicio} - {r.horaFin}</td>
            <td><strong>{r.nombreAmbiente}</strong></td>
            <td>{r.nombreSolicitante}</td>
            <td><span className={`badge-estado badge-${r.estado.toLowerCase()}`}>{r.estado}</span></td>
            <td><Button variante="secundario" onClick={() => alVerDetalle(r.id)}>Ver detalle</Button></td>
          </tr>
        )}
      />

      <div className="paginacion-controles">
        <Button variante="secundario" onClick={() => setPagina((p) => Math.max(1, p - 1))} deshabilitado={pagina === 1 || cargando}>Anterior</Button>
        <span>Página {pagina} (Total: {total})</span>
        <Button variante="secundario" onClick={() => setPagina((p) => p + 1)} deshabilitado={reservas.length < 10 || cargando}>Siguiente</Button>
      </div>
    </div>
  );
}
