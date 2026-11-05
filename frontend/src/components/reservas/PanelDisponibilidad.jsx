// RF-04 · RN-01 · Shneiderman 8 · Disponibilidad previa por ambiente y fecha sin exponer datos personales · E-17
import { haySolapeHorario } from '../../validation/reglasReserva';
import { MENSAJES } from '../../constants/mensajes';
import Icono from '../ui/Icono';

export default function PanelDisponibilidad({
  ambienteSeleccionado = false,
  fechaSeleccionada = false,
  cargando = false,
  ocupados = [],
  horaInicio = '',
  horaFin = ''
}) {
  if (!ambienteSeleccionado || !fechaSeleccionada) {
    return (
      <div className="p-3.5 rounded-control border border-borde bg-superficie-2 text-sm text-texto-suave">
        Seleccione un ambiente y una fecha para consultar los horarios ocupados.
      </div>
    );
  }

  const existeSolapeLocal = Boolean(horaInicio && horaFin) && ocupados.some(
    (bloque) => haySolapeHorario(horaInicio, horaFin, bloque.horaInicio, bloque.horaFin)
  );

  return (
    <section aria-label="Disponibilidad del ambiente" className="p-3.5 rounded-control border border-borde bg-superficie-2 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-texto">Disponibilidad en la fecha elegida</span>
        {cargando && <span className="text-sm text-texto-suave">Consultando…</span>}
      </div>

      {!cargando && ocupados.length === 0 && (
        <p className="text-sm text-aprobada-texto font-medium inline-flex items-center gap-1.5">
          <Icono nombre="CircleCheck" className="w-4 h-4" />
          <span>Sin reservas aprobadas ese día</span>
        </p>
      )}

      {!cargando && ocupados.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {ocupados.map((b, idx) => (
            <li
              key={b.id || `${b.horaInicio}-${idx}`}
              className="px-2.5 py-1 rounded-pill border border-pendiente-texto bg-pendiente-fondo text-pendiente-texto text-sm font-medium cifra-tabular"
            >
              {`Ocupado: ${b.horaInicio}–${b.horaFin}`}
            </li>
          ))}
        </ul>
      )}

      {existeSolapeLocal && (
        <p role="status" className="text-sm font-semibold text-rechazada-texto inline-flex items-center gap-1.5">
          <Icono nombre="AlertTriangle" className="w-4 h-4" />
          <span>{MENSAJES.RESERVA_SOLAPE_HORARIO}</span>
        </p>
      )}
    </section>
  );
}
