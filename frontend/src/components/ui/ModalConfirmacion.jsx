// Nielsen 3 · Norman · WCAG 2.2 AA · Modal de confirmación con resumen y foco seguro · E-19 · E-33
import { useId } from 'react';
import { useTrampaFoco } from '../../hooks/useTrampaFoco';
import Button from './Button';
import { formatearFecha } from '../../utils/formatearFecha';
import { formatearRangoHorario } from '../../utils/formatearHora';

export default function ModalConfirmacion({
  abierto, titulo, descripcion, reserva = null, esIrreversible = false,
  etiquetaConfirmar = 'Confirmar', varianteConfirmar = 'primario',
  enProceso = false, alConfirmar, alCancelar
}) {
  const idTitulo = useId();
  const contenedorRef = useTrampaFoco(abierto, () => {
    if (!enProceso) alCancelar?.();
  }, '[data-foco-seguro="true"]');

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fondo/80">
      <div ref={contenedorRef} role="dialog" aria-modal="true" aria-labelledby={idTitulo} className="w-full max-w-lg p-6 rounded-tarjeta border border-borde bg-superficie text-texto">
        <h2 id={idTitulo} className="text-xl font-semibold text-texto mb-2">{titulo}</h2>
        {descripcion && <p className="text-base text-texto-suave mb-4">{descripcion}</p>}

        {reserva && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 mb-4 rounded-control border border-borde bg-superficie-2 text-sm">
            <div><dt className="font-semibold text-texto-suave">Ambiente</dt><dd className="text-texto font-medium">{reserva.ambiente?.nombre || '—'}</dd></div>
            <div><dt className="font-semibold text-texto-suave">Solicitante</dt><dd className="text-texto font-medium">{reserva.solicitante?.nombreCompleto || '—'}</dd></div>
            <div><dt className="font-semibold text-texto-suave">Fecha</dt><dd className="text-texto cifra-tabular">{formatearFecha(reserva.fecha)}</dd></div>
            <div><dt className="font-semibold text-texto-suave">Horario</dt><dd className="text-texto cifra-tabular">{formatearRangoHorario(reserva.horaInicio, reserva.horaFin)}</dd></div>
          </dl>
        )}

        {esIrreversible && (
          <p className="p-3 mb-4 rounded-control border border-rechazada-texto bg-rechazada-fondo text-rechazada-texto text-sm font-medium">
            Atención: esta acción establece un estado final e irreversible. La reserva no podrá modificarse después.
          </p>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-borde">
          <Button variante="secundario" data-foco-seguro="true" disabled={enProceso} onClick={alCancelar}>Volver</Button>
          <Button variante={varianteConfirmar} enProceso={enProceso} onClick={alConfirmar}>{etiquetaConfirmar}</Button>
        </div>
      </div>
    </div>
  );
}
