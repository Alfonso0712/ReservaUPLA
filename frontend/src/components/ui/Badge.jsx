// WCAG 2.2 AA · ISO 9241-110 · Componente único de Badge para estados
import Icono from './Icono';
import {
  ESTADOS_RESERVA, ESTADOS_AMBIENTE,
  ICONO_POR_ESTADO, ICONO_POR_ESTADO_AMBIENTE
} from '../../constants/estados';

const ESTILOS_POR_VARIANTE = {
  aprobada: 'bg-aprobada-fondo text-aprobada-texto border border-aprobada-texto/20',
  pendiente: 'bg-pendiente-fondo text-pendiente-texto border border-pendiente-texto/20',
  rechazada: 'bg-rechazada-fondo text-rechazada-texto border border-rechazada-texto/20',
  cancelada: 'bg-cancelada-fondo text-cancelada-texto border border-cancelada-texto/20'
};

const VARIANTE_POR_ESTADO = {
  [ESTADOS_RESERVA.APROBADA]: 'aprobada',
  [ESTADOS_RESERVA.PENDIENTE]: 'pendiente',
  [ESTADOS_RESERVA.RECHAZADA]: 'rechazada',
  [ESTADOS_RESERVA.CANCELADA]: 'cancelada',
  [ESTADOS_AMBIENTE.DISPONIBLE]: 'aprobada',
  [ESTADOS_AMBIENTE.MANTENIMIENTO]: 'pendiente',
  [ESTADOS_AMBIENTE.LIMPIEZA]: 'pendiente',
  [ESTADOS_AMBIENTE.REMODELACION]: 'pendiente',
  [ESTADOS_AMBIENTE.FUERA_DE_SERVICIO]: 'cancelada'
};

export default function Badge({ estado, variante: vProp, icono: iProp, children }) {
  const etiqueta = children || estado || '';
  const variante = vProp || VARIANTE_POR_ESTADO[estado] || 'cancelada';
  const nombreIcono = iProp || ICONO_POR_ESTADO[estado] || ICONO_POR_ESTADO_AMBIENTE[estado] || 'Info';
  const clases = ESTILOS_POR_VARIANTE[variante] || ESTILOS_POR_VARIANTE.cancelada;

  return (
    <span className={`inline-flex items-center gap-1.5 h-[1.625rem] px-2.5 rounded-full text-xs font-semibold leading-none whitespace-nowrap ${clases}`}>
      <Icono nombre={nombreIcono} className="w-3.5 h-3.5 shrink-0" />
      <span>{etiqueta}</span>
    </span>
  );
}
