// WCAG 2.2 AA · Estado de ambiente con tokens existentes e íconos específicos · E-39..44
import Icono from './Icono';
import {
  ESTADOS_AMBIENTE,
  ICONO_POR_ESTADO_AMBIENTE,
  VARIANTE_POR_ESTADO_AMBIENTE
} from '../../constants/estados';

const CLASES_POR_VARIANTE = {
  aprobada: 'bg-aprobada-fondo text-aprobada-texto border-aprobada-texto',
  pendiente: 'bg-pendiente-fondo text-pendiente-texto border-pendiente-texto',
  cancelada: 'bg-cancelada-fondo text-cancelada-texto border-cancelada-texto'
};

export default function EstadoAmbienteBadge({ estado }) {
  const estadoSeguro = estado || ESTADOS_AMBIENTE.DISPONIBLE;
  const variante = VARIANTE_POR_ESTADO_AMBIENTE[estadoSeguro] || 'cancelada';
  const clases = CLASES_POR_VARIANTE[variante];
  const nombreIcono = ICONO_POR_ESTADO_AMBIENTE[estadoSeguro] || 'Info';

  return (
    <span className={`inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-control border text-sm font-semibold leading-tight ${clases}`}>
      <Icono nombre={nombreIcono} className="w-4 h-4 shrink-0" />
      <span>{estadoSeguro}</span>
    </span>
  );
}
