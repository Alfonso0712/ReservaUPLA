// Nielsen 3 · Norman · WCAG 2.2 AA · Modal de confirmación con resumen y motivo opcional
import { useId } from 'react';
import { createPortal } from 'react-dom';
import { useTrampaFoco } from '../../hooks/useTrampaFoco';
import Button from './Button';
import Icono from './Icono';
import { formatearFecha } from '../../utils/formatearFecha';
import { formatearRangoHorario } from '../../utils/formatearHora';

export default function ModalConfirmacion({
  abierto, titulo, descripcion, reserva = null, resumen = null, esIrreversible = false,
  requiereMotivo = false, motivo = '', alCambiarMotivo, errorMotivo = '',
  etiquetaConfirmar = 'Confirmar', varianteConfirmar = 'primario',
  etiquetaCancelar = 'Volver', varianteCancelar = 'secondary',
  deshabilitarConfirmar = false, mostrarBotonCerrar = false, sinBotones = false,
  enProceso = false, alConfirmar, alCancelar, children = null
}) {
  const idTitulo = useId();
  const idMotivo = useId();
  const idError = useId();
  const contenedorRef = useTrampaFoco(abierto, () => {
    if (!enProceso) alCancelar?.();
  }, '[data-foco-seguro="true"], select, button, input');

  if (!abierto) return null;
  const ambNombre = reserva?.ambiente?.nombre || reserva?.nombreAmbiente || '—';
  const solNombre = reserva?.solicitante?.nombreCompleto || reserva?.nombreSolicitante || '—';

  const modalElement = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fondo-modal">
      <div ref={contenedorRef} role="dialog" aria-modal="true" aria-labelledby={idTitulo} className="w-full max-w-lg p-6 rounded-tarjeta border border-borde bg-superficie text-texto">
        <div className={`flex items-center justify-between gap-3 ${mostrarBotonCerrar ? 'pb-3 mb-4 border-b border-borde' : 'mb-2'}`}>
          <h2 id={idTitulo} className="text-xl font-semibold text-texto">{titulo}</h2>
          {mostrarBotonCerrar && (
            <button type="button" onClick={alCancelar} disabled={enProceso} aria-label={`Cerrar ventana de ${titulo.toLowerCase()}`} className="h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] p-2 inline-flex items-center justify-center rounded-full text-texto-suave hover:bg-superficie-2"><Icono nombre="X" className="w-5 h-5" /></button>
          )}
        </div>
        {descripcion && <p className="text-base text-texto-suave mb-4">{descripcion}</p>}
        {resumen}
        {!resumen && reserva && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 mb-4 rounded-control border border-borde bg-superficie-2 text-sm">
            <div><dt className="font-semibold text-texto-suave">Ambiente</dt><dd className="text-texto font-medium">{ambNombre}</dd></div>
            <div><dt className="font-semibold text-texto-suave">Solicitante</dt><dd className="text-texto font-medium">{solNombre}</dd></div>
            <div><dt className="font-semibold text-texto-suave">Fecha</dt><dd className="text-texto cifra-tabular">{formatearFecha(reserva.fecha)}</dd></div>
            <div><dt className="font-semibold text-texto-suave">Horario</dt><dd className="text-texto cifra-tabular">{formatearRangoHorario(reserva.horaInicio, reserva.horaFin)}</dd></div>
          </dl>
        )}
        {requiereMotivo && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor={idMotivo} className="block text-sm font-semibold text-texto">
                Motivo <span className="text-rechazada-texto" aria-hidden="true">*</span>
              </label>
              <span className="text-xs text-texto-suave">{motivo.length}/200</span>
            </div>
            <textarea id={idMotivo} required rows={3} maxLength={200} value={motivo} onChange={(e) => alCambiarMotivo?.(e.target.value)} aria-describedby={errorMotivo ? idError : undefined} placeholder="Indique el motivo detallado de esta acción" className={`w-full p-2.5 rounded-control border ${errorMotivo ? 'border-rechazada-texto' : 'border-borde-control'} bg-fondo text-texto text-sm outline-none focus:ring-2 focus:ring-anillo-foco`} />
            {errorMotivo && <p id={idError} className="mt-1 text-xs text-rechazada-texto">{errorMotivo}</p>}
          </div>
        )}
        {esIrreversible && (
          <p className="p-3 mb-4 rounded-control border border-rechazada-texto bg-rechazada-fondo text-rechazada-texto text-sm font-medium">
            Esta acción es irreversible y afectará el flujo regular de la reserva.
          </p>
        )}
        {children}
        {!sinBotones && (
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-borde">
            <Button variante={varianteCancelar} disabled={enProceso} onClick={alCancelar}>{etiquetaCancelar}</Button>
            <Button variante={varianteConfirmar} disabled={deshabilitarConfirmar} enProceso={enProceso} onClick={alConfirmar}>{etiquetaConfirmar}</Button>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalElement, document.body) : modalElement;
}
