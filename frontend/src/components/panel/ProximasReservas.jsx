// Próximas reservas aprobadas desde la fecha de hoy · Cambio 7
import { Link } from 'react-router-dom';
import { RUTAS } from '../../constants/rutas';
import { ESTADOS_RESERVA } from '../../constants/estados';
import { formatearFecha } from '../../utils/formatearFecha';
import { formatearRangoHorario } from '../../utils/formatearHora';
import { obtenerRangoSemanaPeru } from '../../utils/horarioPeru';

export default function ProximasReservas({ reservas = [] }) {
  const { hoy } = obtenerRangoSemanaPeru();
  const proximas = reservas.filter((r) => r.estado === ESTADOS_RESERVA.APROBADA && r.fecha >= hoy).sort((a, b) => `${a.fecha || ''} ${a.horaInicio || ''}`.localeCompare(`${b.fecha || ''} ${b.horaInicio || ''}`)).slice(0, 5);

  return (
    <section aria-labelledby="titulo-proximas-reservas" className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-borde">
        <h2 id="titulo-proximas-reservas" className="text-base sm:text-lg font-bold text-texto">Próximas reservas aprobadas</h2>
        <Link to={`${RUTAS.RESERVAS}?estado=Aprobada`} className="text-xs sm:text-sm font-semibold text-primario-enlace hover:underline">Ver todas →</Link>
      </div>

      {proximas.length === 0 ? (
        <p className="py-4 text-center text-sm text-texto-suave">No hay próximas reservas programadas</p>
      ) : (
        <div className="divide-y divide-borde/60">
          {proximas.map((r) => {
            const fechaHorario = `${formatearFecha(r.fecha)} · ${formatearRangoHorario(r.horaInicio, r.horaFin)}`;
            return (
              <Link key={r.id} to={RUTAS.crearDetalleReserva(r.id)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2.5 hover:bg-superficie-2 px-2 -mx-2 rounded-md transition-colors group">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-texto group-hover:text-primario-enlace transition-colors truncate">{r.ambiente?.nombre}</p>
                  <p className="text-xs text-texto-suave truncate">{r.solicitante?.nombreCompleto || 'Solicitante'}</p>
                </div>
                <span className="text-xs font-medium text-texto-suave cifra-tabular shrink-0">{fechaHorario}</span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
