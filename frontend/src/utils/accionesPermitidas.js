// Función pura para determinar acciones sobre una reserva · RN-05 · RN-06 · E-47
import { PERMISOS } from '../constants/permisos';
import { ESTADOS_RESERVA } from '../constants/estados';

export function accionesPermitidas(reserva, usuario, puede) {
  if (!reserva || typeof puede !== 'function') return [];

  const estado = reserva.estado;
  if (estado === ESTADOS_RESERVA.RECHAZADA || estado === ESTADOS_RESERVA.CANCELADA) {
    return [];
  }

  const acciones = [];

  if (estado === ESTADOS_RESERVA.PENDIENTE) {
    if (puede(PERMISOS.RESERVAS_APROBAR)) acciones.push('aprobar');
    if (puede(PERMISOS.RESERVAS_RECHAZAR)) acciones.push('rechazar');
  }

  const esCancelable = estado === ESTADOS_RESERVA.PENDIENTE || estado === ESTADOS_RESERVA.APROBADA;
  if (esCancelable) {
    const puedeCualquiera = puede(PERMISOS.RESERVAS_CANCELAR_CUALQUIERA);
    const puedePropias = puede(PERMISOS.RESERVAS_CANCELAR_PROPIAS);
    const esPropia = Boolean(
      usuario?.id && (reserva.solicitante?.id === usuario.id || reserva.solicitanteId === usuario.id)
    );

    if (puedeCualquiera || (puedePropias && esPropia)) {
      acciones.push('cancelar');
    }
  }

  return acciones;
}
