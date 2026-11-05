// Tarjeta de ancho completo con reservas pendientes de resolución · Cambio 4
import { Link } from 'react-router-dom';
import Icono from '../ui/Icono';
import FilaAtencionPendiente from './FilaAtencionPendiente';
import { RUTAS } from '../../constants/rutas';
import { ESTADOS_RESERVA } from '../../constants/estados';
import { detectarConflicto } from '../../utils/detectarConflicto';

export default function RequiereAtencion({ reservas = [], todasLasReservas = [], puedeAprobar = false, enProceso = false, alAprobar, alRechazar }) {
  const pendientes = reservas.filter((r) => r.estado === ESTADOS_RESERVA.PENDIENTE).sort((a, b) => `${a.fecha || ''} ${a.horaInicio || ''}`.localeCompare(`${b.fecha || ''} ${b.horaInicio || ''}`));
  const visibles = pendientes.slice(0, 5);
  const totalPendientes = pendientes.length;

  return (
    <section aria-labelledby="titulo-requiere-atencion" className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-borde">
        <div className="flex items-center gap-2.5">
          <h2 id="titulo-requiere-atencion" className="text-base sm:text-lg font-bold text-texto">Requiere tu atención</h2>
          {totalPendientes > 0 && (
            <span className="px-2 py-0.5 rounded-pill text-xs font-bold bg-pendiente-fondo text-pendiente-texto border border-pendiente-texto cifra-tabular">
              {totalPendientes}
            </span>
          )}
        </div>
        {totalPendientes > 5 && (
          <Link to={`${RUTAS.RESERVAS}?estado=Pendiente`} className="text-xs sm:text-sm font-semibold text-primario-enlace hover:underline">
            {`Ver todas (${totalPendientes}) →`}
          </Link>
        )}
      </div>

      {totalPendientes === 0 ? (
        <div className="flex items-center gap-3 p-4 rounded-control bg-aprobada-fondo text-aprobada-texto border border-aprobada-texto">
          <Icono nombre="CircleCheck" className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">No hay reservas pendientes. Todo al día.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {visibles.map((r) => (
            <FilaAtencionPendiente
              key={r.id}
              r={r}
              conflicto={detectarConflicto(r, todasLasReservas)}
              puedeAprobar={puedeAprobar}
              enProceso={enProceso}
              alAprobar={alAprobar}
              alRechazar={alRechazar}
            />
          ))}
        </div>
      )}
    </section>
  );
}
