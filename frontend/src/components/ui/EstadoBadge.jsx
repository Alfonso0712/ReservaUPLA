// WCAG 2.2 AA · Información no solo por color (ícono distinto + texto)
import Icono from './Icono';
import { ESTADOS_RESERVA, ICONO_POR_ESTADO } from '../../constants/estados';

const CLASES_POR_ESTADO = {
  [ESTADOS_RESERVA.PENDIENTE]: 'bg-pendiente-fondo text-pendiente-texto border-pendiente-texto',
  [ESTADOS_RESERVA.APROBADA]: 'bg-aprobada-fondo text-aprobada-texto border-aprobada-texto',
  [ESTADOS_RESERVA.RECHAZADA]: 'bg-rechazada-fondo text-rechazada-texto border-rechazada-texto',
  [ESTADOS_RESERVA.CANCELADA]: 'bg-cancelada-fondo text-cancelada-texto border-cancelada-texto'
};

export default function EstadoBadge({ estado }) {
  const clases = CLASES_POR_ESTADO[estado] || CLASES_POR_ESTADO[ESTADOS_RESERVA.CANCELADA];
  const nombreIcono = ICONO_POR_ESTADO[estado] || 'Info';

  return (
    <span className={`inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-control border text-sm font-semibold leading-tight ${clases}`}>
      <Icono nombre={nombreIcono} className="w-4 h-4 shrink-0" />
      <span>{estado}</span>
    </span>
  );
}
