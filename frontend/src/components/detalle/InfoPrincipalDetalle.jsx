// Columna principal de información de reserva y línea de tiempo · Compacta
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
    <article aria-label="Información detallada de la reserva" className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-sm space-y-3.5">
      <div className="space-y-1.5 pb-3 border-b border-borde">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg sm:text-xl font-semibold text-texto tracking-tight">{nombreAmbiente}</h2>
            <TipoAmbienteChip tipo={tipoAmbiente} />
          </div>
          <EstadoBadge estado={reserva.estado} />
        </div>
        <p className="text-xs sm:text-sm font-semibold text-texto-suave cifra-tabular">
          <span>{fechaHorario}</span>
          {duracion && <span className="ml-2 font-normal text-texto-suave">({duracion})</span>}
        </p>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div>
          <dt className="text-xs font-semibold text-texto-suave uppercase tracking-wider">Solicitante</dt>
          <dd className="mt-1 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-primario-suave text-primario font-bold text-xs flex items-center justify-center shrink-0">
              {obtenerIniciales(nombreSolicitante) || 'U'}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-texto leading-snug">{nombreSolicitante || '—'}</p>
              {correoSolicitante && <p className="text-xs text-texto-suave truncate">{correoSolicitante}</p>}
            </div>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-texto-suave uppercase tracking-wider">Fecha y horario</dt>
          <dd className="mt-1 text-sm font-semibold text-texto cifra-tabular leading-snug">{fechaHorario}</dd>
        </div>
        {(cap || ubic) && (
          <div>
            <dt className="text-xs font-semibold text-texto-suave uppercase tracking-wider">Ambiente</dt>
            <dd className="mt-1 text-sm font-semibold text-texto leading-snug">
              {ubic && <span>{ubic}</span>}
              {cap && <span className="text-texto-suave text-xs font-normal">{ubic ? ` · Capacidad: ${cap} personas` : `Capacidad: ${cap} personas`}</span>}
            </dd>
          </div>
        )}
        <div className={(cap || ubic) ? '' : 'sm:col-span-2'}>
          <dt className="text-xs font-semibold text-texto-suave uppercase tracking-wider">Motivo</dt>
          <dd className="mt-1 text-sm font-medium text-texto leading-snug break-words">{reserva.motivo || '—'}</dd>
        </div>
      </dl>

      {reserva.fechaRegistro && (
        <div className="pt-2.5 border-t border-borde flex items-center gap-2 text-xs text-texto-suave">
          <span className="text-[0.6875rem] font-semibold text-texto-suave uppercase tracking-wider">Historial:</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primario shrink-0" aria-hidden="true" />
          <span>Solicitada el {formatearFecha(reserva.fechaRegistro)}</span>
          {nombreSolicitante && <span>por {nombreSolicitante}</span>}
        </div>
      )}
    </article>
  );
}
