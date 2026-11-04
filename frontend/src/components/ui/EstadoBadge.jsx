// WCAG 2.2 AA · Información no solo por color (ícono distinto + texto) · E-52
import Icono from './Icono';
import { ESTADOS_RESERVA, ICONO_POR_ESTADO, TONOS_ESTADO } from '../../constants/estados';

export default function EstadoBadge({ estado }) {
  const tono = TONOS_ESTADO[estado] || TONOS_ESTADO[ESTADOS_RESERVA.CANCELADA];
  const clases = tono?.badge || `${tono?.fondo} ${tono?.texto} ${tono?.borde}`;
  const nombreIcono = ICONO_POR_ESTADO[estado] || 'Info';

  return (
    <span className={`inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-control border text-sm font-semibold leading-tight ${clases}`}>
      <Icono nombre={nombreIcono} className="w-4 h-4 shrink-0" />
      <span>{estado}</span>
    </span>
  );
}
