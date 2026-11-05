// Utilidad pura para detectar solapamiento de horario entre reservas · RF-07
import { ESTADOS_RESERVA } from '../constants/estados';
import { haySolapeHorario } from '../validation/reglasReserva';
import { formatearRangoHorario } from './formatearHora';

export function detectarConflicto(reserva, listaReservas = []) {
  if (!reserva || !listaReservas?.length) return null;
  const ambId = reserva.ambiente?.id || reserva.ambienteId;
  const estadosSolape = [ESTADOS_RESERVA.PENDIENTE, ESTADOS_RESERVA.APROBADA];

  const conflicto = listaReservas.find((otra) => {
    if (!otra || otra.id === reserva.id) return false;
    if (!estadosSolape.includes(otra.estado)) return false;
    const otraAmbId = otra.ambiente?.id || otra.ambienteId;
    if (otraAmbId !== ambId) return false;
    if (otra.fecha !== reserva.fecha) return false;
    return haySolapeHorario(reserva.horaInicio, reserva.horaFin, otra.horaInicio, otra.horaFin);
  });

  if (!conflicto) return null;

  const solicitante = conflicto.solicitante?.nombreCompleto || 'otra reserva';
  const horario = formatearRangoHorario(conflicto.horaInicio, conflicto.horaFin);
  return {
    conflictoCon: conflicto,
    mensajeTooltip: `Se cruza con la reserva de ${solicitante} (${horario})`
  };
}
