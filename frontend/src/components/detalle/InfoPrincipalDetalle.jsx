// Columna principal de información de reserva y línea de tiempo · Cambio 3 y 5
import EstadoBadge from '../ui/EstadoBadge';
import TipoAmbienteChip from '../ui/TipoAmbienteChip';
import { formatearFecha } from '../../utils/formatearFecha';
import { formatearRangoHorario, calcularDuracionHoras } from '../../utils/formatearHora';
import { obtenerIniciales } from '../../utils/obtenerIniciales';

export default function InfoPrincipalDetalle({ reserva }) {
  if (!reserva) return null;
  const fechaHorario = `${formatearFecha(reserva.fecha)} · ${formatearRangoHorario(reserva.horaInicio, reserva.horaFin)}`;
  const duracion = calcularDuracionHoras(reserva.horaInicio, reserva.horaFin);
  const nombreAmbiente = reserva.ambiente?.nombre || reserva.nombreAmbiente;
  const tipoAmbiente = reserva.ambiente?.tipo || reserva.tipoAmbiente;
  const cap = reserva.ambiente?.capacidad || reserva.capacidadAmbiente || reserva.capacidad;
  const ubic = reserva.ambiente?.ubicacion || reserva.ubicacionAmbiente || reserva.ubicacion;
  const nombreSolicitante = reserva.solicitante?.nombreCompleto || reserva.nombreSolicitante;
  const correoSolicitante = reserva.solicitante?.correo || reserva.correoSolicitante;

  return (
    <article aria-label="Información detallada de la reserva" className="p-6 rounded-tarjeta border border-borde bg-superficie shadow-sm space-y-6">
      <div className="space-y-3 pb-5 border-b border-borde">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-texto tracking-tight">{nombreAmbiente}</h2>
          <EstadoBadge estado={reserva.estado} />
        </div>
        <div><TipoAmbienteChip tipo={tipoAmbiente} /></div>
        <p className="text-sm font-semibold text-texto-suave cifra-tabular">
          <span>{fechaHorario}</span>
          {duracion && <span className="ml-2 font-normal text-texto-suave">({duracion})</span>}
        </p>
      </div>

      <dl className="divide-y divide-borde text-sm">
        <div className="py-3.5 first:pt-0">
          <dt className="text-[0.8125rem] text-texto-suave">Solicitante</dt>
          <dd className="mt-1 flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-primario-suave text-primario font-bold text-xs flex items-center justify-center shrink-0">
              {obtenerIniciales(nombreSolicitante) || 'U'}
            </span>
            <div className="min-w-0">
              <p className="text-[1rem] font-medium text-texto leading-snug">{nombreSolicitante || '—'}</p>
              {correoSolicitante && <p className="text-xs text-texto-suave">{correoSolicitante}</p>}
            </div>
          </dd>
        </div>
        <div className="py-3.5">
          <dt className="text-[0.8125rem] text-texto-suave">Fecha y horario</dt>
          <dd className="mt-1 text-[1rem] font-medium text-texto cifra-tabular">{fechaHorario}</dd>
        </div>
        {(cap || ubic) && (
          <div className="py-3.5">
            <dt className="text-[0.8125rem] text-texto-suave">Ambiente</dt>
            <dd className="mt-1 text-[1rem] font-medium text-texto">
              {ubic && <span>{ubic}</span>}
              {cap && <span className="text-texto-suave text-sm">{ubic ? ` · Capacidad: ${cap} personas` : `Capacidad: ${cap} personas`}</span>}
            </dd>
          </div>
        )}
        <div className="py-3.5 last:pb-0">
          <dt className="text-[0.8125rem] text-texto-suave">Motivo</dt>
          <dd className="mt-1 text-[1rem] font-medium text-texto leading-relaxed break-words">{reserva.motivo || '—'}</dd>
        </div>
      </dl>

      {reserva.fechaRegistro && (
        <div className="pt-4 border-t border-borde space-y-2">
          <p className="text-[0.8125rem] font-semibold text-texto-suave uppercase tracking-wider">Historial</p>
          <div className="flex items-center gap-2 text-xs text-texto-suave">
            <span className="w-2 h-2 rounded-full bg-primario shrink-0" aria-hidden="true" />
            <span>Solicitada el {formatearFecha(reserva.fechaRegistro)}</span>
            {nombreSolicitante && <span>por {nombreSolicitante}</span>}
          </div>
        </div>
      )}
    </article>
  );
}
