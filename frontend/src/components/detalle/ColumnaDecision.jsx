// Columna lateral de decisión, conflicto y acciones alineadas al final
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
    <aside aria-label="Decisión sobre la solicitud" className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-sm flex flex-col justify-between h-full space-y-3">
      <div className="space-y-3">
        <div className="pb-2 border-b border-borde">
          <h3 className="text-base sm:text-lg font-semibold text-texto">Decisión</h3>
        </div>
        <p className="text-xs sm:text-sm text-texto-suave leading-snug">{textoEstado}</p>
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
        {(esRech || esCanc) && motFinal && (
          <div className="p-3 rounded-control border border-borde bg-fondo text-xs space-y-1">
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
      </div>
      {(esPend && puedeAprobar) || (esAprob && puedeCancelar) ? (
        <div className="mt-auto pt-3 space-y-2">
          {esPend && puedeAprobar && (
            <>
              <Button variante="success" disabled={enProceso} icono="Check" className="w-full justify-center" onClick={() => alAprobar(reserva)}>Aprobar</Button>
              <Button variante="danger-outline" disabled={enProceso} icono="X" className="w-full justify-center" onClick={() => alRechazar(reserva)}>Rechazar</Button>
            </>
          )}
          {esAprob && puedeCancelar && (
            <Button variante="danger-outline" disabled={enProceso} icono="Ban" className="w-full justify-center" onClick={() => alCancelar(reserva)}>Cancelar reserva</Button>
          )}
        </div>
      ) : null}
    </aside>
  );
}
