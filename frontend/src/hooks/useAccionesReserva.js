// Hook compartido de acciones de reserva (aprobar, rechazar, cancelar) · RF-07 · RN-05..06
import { useState, useCallback } from 'react';
import { ESTADOS_RESERVA } from '../constants/estados';

export function useAccionesReserva() {
  const [modal, setModal] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [errorMotivo, setErrorMotivo] = useState('');
  const [enProceso, setEnProceso] = useState(false);

  const solicitarAprobar = useCallback((reserva) => {
    setModal({ reserva, nuevoEstado: ESTADOS_RESERVA.APROBADA });
    setMotivo('');
    setErrorMotivo('');
  }, []);

  const solicitarRechazar = useCallback((reserva) => {
    setModal({ reserva, nuevoEstado: ESTADOS_RESERVA.RECHAZADA });
    setMotivo('');
    setErrorMotivo('');
  }, []);

  const solicitarCancelar = useCallback((reserva) => {
    setModal({ reserva, nuevoEstado: ESTADOS_RESERVA.CANCELADA });
    setMotivo('');
    setErrorMotivo('');
  }, []);

  const cerrarModal = useCallback(() => {
    setModal(null);
    setMotivo('');
    setErrorMotivo('');
  }, []);

  const ejecutarAccion = useCallback(async (cambiarEstadoFn, onExito) => {
    if (!modal) return;
    const esApr = modal.nuevoEstado === ESTADOS_RESERVA.APROBADA;
    if (!esApr && !motivo.trim()) {
      setErrorMotivo('Debe indicar un motivo.');
      return;
    }
    setEnProceso(true);
    const res = await cambiarEstadoFn(modal.reserva.id, modal.nuevoEstado, motivo);
    setEnProceso(false);
    if (res?.ok) {
      const { reserva, nuevoEstado } = modal;
      cerrarModal();
      onExito?.(reserva, nuevoEstado, res);
    } else {
      setErrorMotivo(res?.errorGeneral || 'Error al procesar la acción.');
    }
  }, [modal, motivo, cerrarModal]);

  return {
    modal,
    motivo,
    setMotivo,
    errorMotivo,
    setErrorMotivo,
    enProceso,
    solicitarAprobar,
    solicitarRechazar,
    solicitarCancelar,
    cerrarModal,
    ejecutarAccion
  };
}
