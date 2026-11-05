// Fila individual de reserva pendiente con aviso de conflicto · Cambio 4
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Icono from '../ui/Icono';
import { RUTAS } from '../../constants/rutas';
import { formatearFecha } from '../../utils/formatearFecha';
import { formatearRangoHorario } from '../../utils/formatearHora';
import { obtenerIniciales } from '../../utils/obtenerIniciales';

export default function FilaAtencionPendiente({ r, conflicto, puedeAprobar, enProceso, alAprobar, alRechazar }) {
  const rutaDetalle = RUTAS.crearDetalleReserva(r.id);
  const fechaHorario = `${formatearFecha(r.fecha)} · ${formatearRangoHorario(r.horaInicio, r.horaFin)}`;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 rounded-control border border-borde bg-superficie hover:bg-superficie-2 transition-colors">
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <span className="w-9 h-9 rounded-full bg-primario-suave text-primario font-bold text-xs flex items-center justify-center shrink-0">
          {obtenerIniciales(r.solicitante?.nombreCompleto) || 'U'}
        </span>
        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={rutaDetalle} className="font-semibold text-sm text-texto hover:text-primario-enlace hover:underline truncate">
              {r.solicitante?.nombreCompleto}
            </Link>
            <span className="text-xs text-texto-suave">• {r.ambiente?.nombre}</span>
            {conflicto && (
              <span title={conflicto.mensajeTooltip} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-xs font-semibold bg-pendiente-fondo text-pendiente-texto border border-pendiente-texto cursor-help">
                <Icono nombre="AlertTriangle" className="w-3.5 h-3.5 shrink-0" />
                <span>Se cruza con otra reserva</span>
              </span>
            )}
          </div>
          <p className="text-xs text-texto-suave cifra-tabular">{fechaHorario}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-borde">
        <Link to={rutaDetalle} className="min-h-control px-2.5 py-1 inline-flex items-center gap-1 rounded-control text-xs font-semibold text-texto-suave hover:text-texto hover:bg-superficie">
          <Icono nombre="Eye" className="w-3.5 h-3.5 shrink-0" />
          <span>Detalle</span>
        </Link>
        {puedeAprobar && (
          <>
            <Button variante="success" tamano="sm" icono="CircleCheck" disabled={enProceso} onClick={() => alAprobar(r)}>Aprobar</Button>
            <Button variante="danger-outline" tamano="sm" icono="CircleX" disabled={enProceso} onClick={() => alRechazar(r)}>Rechazar</Button>
          </>
        )}
      </div>
    </div>
  );
}
