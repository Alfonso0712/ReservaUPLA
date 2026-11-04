// Modal de confirmación compartido para acciones de reserva · RF-07 · RN-05..06
import ModalConfirmacion from '../ui/ModalConfirmacion';
import { ESTADOS_RESERVA } from '../../constants/estados';

export default function ModalAccionReserva({
  modal, motivo, alCambiarMotivo, errorMotivo, enProceso, alConfirmar, alCancelar
}) {
  if (!modal) return null;
  const esApr = modal.nuevoEstado === ESTADOS_RESERVA.APROBADA;
  const esCanc = modal.nuevoEstado === ESTADOS_RESERVA.CANCELADA;
  const solicitante = modal.reserva?.solicitante?.nombreCompleto || 'solicitante';
  const titulo = esApr ? 'Confirmar aprobación' : (esCanc ? `¿Cancelar la reserva de ${solicitante}?` : 'Confirmar rechazo');
  const descripcion = esApr ? '¿Desea aprobar esta solicitud de reserva?' : (esCanc ? 'Revise los datos de la reserva antes de confirmar la cancelación.' : 'Indique el motivo del rechazo:');
  const etiquetaConfirmar = esApr ? 'Aprobar reserva' : (esCanc ? 'Cancelar reserva' : 'Rechazar reserva');
  const varianteConfirmar = esApr ? 'primary' : 'danger';

  return (
    <ModalConfirmacion
      abierto={Boolean(modal)}
      titulo={titulo}
      descripcion={descripcion}
      reserva={modal.reserva}
      esIrreversible={!esApr}
      requiereMotivo={!esApr}
      motivo={motivo}
      alCambiarMotivo={alCambiarMotivo}
      errorMotivo={errorMotivo}
      etiquetaConfirmar={etiquetaConfirmar}
      varianteConfirmar={varianteConfirmar}
      enProceso={enProceso}
      alConfirmar={alConfirmar}
      alCancelar={alCancelar}
    />
  );
}
