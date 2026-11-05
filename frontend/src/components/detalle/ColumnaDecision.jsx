// Columna lateral de decisión, conflicto y acciones · Cambio 4
import EstadoBadge from '../ui/EstadoBadge';
import Button from '../ui/Button';
import Icono from '../ui/Icono';
import { ESTADOS_RESERVA } from '../../constants/estados';
import { formatearFecha } from '../../utils/formatearFecha';

export default function ColumnaDecision({
  reserva, puedeAprobar, puedeCancelar, conflicto = null,
  enProceso = false, alAprobar, alRechazar, alCancelar
}) {
  if (!reserva) return null;
  const esPend = reserva.estado === ESTADOS_RESERVA.PENDIENTE; const esAprob = reserva.estado === ESTADOS_RESERVA.APROBADA;
  const esRech = reserva.estado === ESTADOS_RESERVA.RECHAZADA; const esCanc = reserva.estado === ESTADOS_RESERVA.CANCELADA;
  const textoEstado = esPend ? (puedeAprobar ? 'Revisa los datos y aprueba o rechaza.' : 'En espera de revisión administrativa.') : esAprob ? 'Reserva confirmada.' : esRech ? 'Solicitud rechazada.' : esCanc ? 'Reserva cancelada.' : '';
  const motFinal = reserva.motivoEstadoFinal || reserva.motivoCancelacion || reserva.motivoRechazo;

  return (
    <aside aria-label="Decisión sobre la solicitud" className="p-6 rounded-tarjeta border border-borde bg-superficie shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-borde">
        <h3 className="text-lg font-semibold text-texto">Decisión</h3>
        <EstadoBadge estado={reserva.estado} />
      </div>
      <p className="text-sm text-texto-suave leading-relaxed">{textoEstado}</p>
      {esPend && (
        <div>
          {conflicto ? (
            <div className="flex items-start gap-2 text-xs font-semibold text-pendiente-texto bg-pendiente-fondo border border-pendiente-texto p-2.5 rounded-control">
              <Icono nombre="AlertTriangle" className="w-4 h-4 shrink-0 mt-0.5 text-pendiente-texto" />
              <span>{conflicto.mensajeTooltip || 'Se cruza con otra reserva en este ambiente y fecha.'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-aprobada-texto bg-aprobada-fondo border border-aprobada-texto p-2.5 rounded-control">
              <Icono nombre="Check" className="w-4 h-4 shrink-0 text-aprobada-texto" />
              <span>Sin conflictos en este horario</span>
            </div>
          )}
        </div>
      )}
      {esPend && puedeAprobar && (
        <div className="space-y-2.5 pt-1">
          <Button variante="success" disabled={enProceso} icono="Check" className="w-full justify-center" onClick={() => alAprobar(reserva)}>Aprobar</Button>
          <Button variante="danger-outline" disabled={enProceso} icono="X" className="w-full justify-center" onClick={() => alRechazar(reserva)}>Rechazar</Button>
        </div>
      )}
      {esAprob && puedeCancelar && (
        <div className="pt-1">
          <Button variante="danger-outline" disabled={enProceso} icono="Ban" className="w-full justify-center" onClick={() => alCancelar(reserva)}>Cancelar reserva</Button>
        </div>
      )}
      {(esRech || esCanc) && motFinal && (
        <div className="p-3.5 rounded-control border border-borde bg-fondo text-xs space-y-1">
          <p className="font-semibold text-texto-suave">Motivo registrado</p>
          <p className="text-texto leading-relaxed">{motFinal}</p>
          {(reserva.registradoPor || reserva.fechaEstadoFinal) && (
            <p className="text-texto-suave text-[0.6875rem] pt-1">
              {reserva.registradoPor ? `Por: ${reserva.registradoPor}` : ''}
              {reserva.registradoPor && reserva.fechaEstadoFinal ? ' · ' : ''}
              {reserva.fechaEstadoFinal ? formatearFecha(reserva.fechaEstadoFinal) : ''}
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
