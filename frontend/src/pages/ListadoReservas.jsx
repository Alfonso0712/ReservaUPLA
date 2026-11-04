// RF-05 · Vista de listado de reservas
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';

export default function ListadoReservas() {
  return (
    <div>
      <EncabezadoPagina
        titulo="Reservas"
        descripcion="Consulte, filtre y gestione las solicitudes de reserva de ambientes universitarios."
      />
    </div>
  );
}
