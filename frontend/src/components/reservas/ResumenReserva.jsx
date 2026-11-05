// RF-06 · RN-06 · Norman · Datos completos de la reserva, EstadoBadge y línea "Qué sigue" · E-20
import { QUE_SIGUE_POR_ESTADO, ESTADOS_RESERVA } from '../../constants/estados';
import { formatearFecha } from '../../utils/formatearFecha';
import { formatearRangoHorario } from '../../utils/formatearHora';
import EstadoBadge from '../ui/EstadoBadge';
import TipoAmbienteChip from '../ui/TipoAmbienteChip';

export default function ResumenReserva({ reserva, esAdmin = false, acciones = null }) {
  if (!reserva) return null;
  const esPendiente = reserva.estado === ESTADOS_RESERVA.PENDIENTE;
  const textoQueSigue = (esAdmin && esPendiente)
    ? 'Revisa los datos de la solicitud y aprueba o rechaza.'
    : (QUE_SIGUE_POR_ESTADO[reserva.estado] || '');
  const motFinal = reserva.motivoEstadoFinal || reserva.motivoCancelacion || reserva.motivoRechazo;

  return (
    <section aria-label="Información de la solicitud de reserva" className="p-6 rounded-tarjeta border border-borde bg-superficie space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-borde">
        <div>
          <h2 className="text-xl font-semibold text-texto">{reserva.ambiente?.nombre}</h2>
          <div className="mt-1.5"><TipoAmbienteChip tipo={reserva.ambiente?.tipo} /></div>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <EstadoBadge estado={reserva.estado} />
          {acciones && <div className="hidden sm:inline-flex items-center gap-2">{acciones}</div>}
        </div>
      </div>

      <div className="p-4 rounded-control border border-borde bg-superficie-2">
        <p className="text-sm font-semibold text-texto">Qué sigue</p>
        <p className="text-base text-texto-suave mt-0.5">{textoQueSigue}</p>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="p-3.5 rounded-control border border-borde bg-fondo">
          <dt className="font-semibold text-texto-suave">Solicitante</dt>
          <dd className="mt-1 text-base font-semibold text-texto">{reserva.solicitante?.nombreCompleto}</dd>
          <dd className="text-sm text-texto-suave">{reserva.solicitante?.correo}</dd>
        </div>
        <div className="p-3.5 rounded-control border border-borde bg-fondo">
          <dt className="font-semibold text-texto-suave">Fecha y horario</dt>
          <dd className="mt-1 text-base font-semibold text-texto cifra-tabular">{formatearFecha(reserva.fecha)}</dd>
          <dd className="text-sm text-texto-suave cifra-tabular">{formatearRangoHorario(reserva.horaInicio, reserva.horaFin)}</dd>
        </div>
        <div className="sm:col-span-2 p-3.5 rounded-control border border-borde bg-fondo">
          <dt className="font-semibold text-texto-suave">Motivo académico o administrativo</dt>
          <dd className="mt-1 text-base text-texto ancho-lectura">{reserva.motivo}</dd>
        </div>
        {(reserva.estado === ESTADOS_RESERVA.RECHAZADA || reserva.estado === ESTADOS_RESERVA.CANCELADA) && motFinal && (
          <div className="sm:col-span-2 p-3.5 rounded-control border border-borde bg-fondo">
            <dt className="font-semibold text-texto-suave">Motivo</dt>
            <dd className="mt-1 text-base text-texto ancho-lectura">{motFinal}</dd>
            {(reserva.registradoPor || reserva.fechaEstadoFinal) && (
              <dd className="mt-1 text-xs text-texto-suave">
                {reserva.registradoPor ? `Registrado por: ${reserva.registradoPor}` : ''}
                {reserva.registradoPor && reserva.fechaEstadoFinal ? ' · ' : ''}
                {reserva.fechaEstadoFinal ? formatearFecha(reserva.fechaEstadoFinal) : ''}
              </dd>
            )}
          </div>
        )}
      </dl>
    </section>
  );
}
