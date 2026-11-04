// RF-07 · RN-05 · RN-06 · Norman · Acciones en columnas fijas reservadas y enlaces con contexto · E-18..20
import { Link } from 'react-router-dom';
import { ROLES } from '../../constants/roles';
import { ESTADOS_RESERVA, ESTADOS_FINALES } from '../../constants/estados';
import { RUTAS } from '../../constants/rutas';
import { formatearFecha } from '../../utils/formatearFecha';
import Button from '../ui/Button';

export default function AccionesReserva({
  reserva,
  rolUsuario,
  enProceso = false,
  alSolicitarAprobar,
  alSolicitarRechazar
}) {
  const esAdmin = rolUsuario === ROLES.ADMINISTRADOR;
  const esPendiente = reserva.estado === ESTADOS_RESERVA.PENDIENTE;
  const esEstadoFinal = ESTADOS_FINALES.includes(reserva.estado);
  const contextoAccesible = `${reserva.ambiente?.nombre || 'ambiente'} del ${formatearFecha(reserva.fecha)}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center min-w-[18rem]">
      <div className="flex">
        <Link
          to={RUTAS.crearDetalleReserva(reserva.id)}
          aria-label={`Ver detalle de reserva en ${contextoAccesible}`}
          className="min-h-control px-3 py-2 rounded-control border border-borde bg-superficie-2 text-texto hover:bg-fondo text-sm font-semibold inline-flex items-center justify-center no-underline w-full"
        >
          Ver detalle
        </Link>
      </div>

      <div className="flex">
        {esAdmin && esPendiente ? (
          <Button
            variante="primario"
            disabled={enProceso}
            aria-label={`Aprobar reserva en ${contextoAccesible}`}
            onClick={() => alSolicitarAprobar?.(reserva)}
            className="w-full text-sm px-3"
          >
            Aprobar
          </Button>
        ) : (
          <span className="text-sm text-texto-suave px-2">
            {esEstadoFinal ? 'Estado final' : '—'}
          </span>
        )}
      </div>

      <div className="flex">
        {esAdmin && esPendiente ? (
          <Button
            variante="peligro"
            disabled={enProceso}
            aria-label={`Rechazar reserva en ${contextoAccesible}`}
            onClick={() => alSolicitarRechazar?.(reserva)}
            className="w-full text-sm px-3"
          >
            Rechazar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
