// RF-06 · Tarjeta de información principal de reserva · Compacta y sin duplicados
import { useState, useRef, useEffect } from 'react';
import EstadoBadge from '../ui/EstadoBadge';
import TipoAmbienteChip from '../ui/TipoAmbienteChip';
import { formatearFecha } from '../../utils/formatearFecha';
import { formatearRangoHorario, calcularDuracionHoras } from '../../utils/formatearHora';
import { obtenerIniciales } from '../../utils/obtenerIniciales';

export default function InfoPrincipalDetalle({ reserva }) {
  const [expandido, setExpandido] = useState(false); const [puedeExpandir, setPuedeExpandir] = useState(false);
  const motivoRef = useRef(null);

  useEffect(() => {
    const el = motivoRef.current;
    if (el) setPuedeExpandir(el.scrollHeight > el.clientHeight + 1);
  }, [reserva?.motivo]);

  if (!reserva) return null;
  const duracion = calcularDuracionHoras(reserva.horaInicio, reserva.horaFin);
  const fechaHorario = `${formatearFecha(reserva.fecha)} · ${formatearRangoHorario(reserva.horaInicio, reserva.horaFin)}${duracion ? ` · ${duracion}` : ''}`;
  const nomAmb = reserva.ambiente?.nombre || reserva.nombreAmbiente; const tipoAmb = reserva.ambiente?.tipo || reserva.tipoAmbiente;
  const cap = reserva.ambiente?.capacidad || reserva.capacidadAmbiente || reserva.capacidad;
  const ubic = reserva.ambiente?.ubicacion || reserva.ubicacionAmbiente || reserva.ubicacion;
  const nomSol = reserva.solicitante?.nombreCompleto || reserva.nombreSolicitante; const corSol = reserva.solicitante?.correo || reserva.correoSolicitante;

  return (
    <article aria-label="Información detallada de la reserva" className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-sm flex flex-col justify-between h-full space-y-3">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-borde">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg sm:text-xl font-semibold text-texto tracking-tight">{nomAmb}</h2>
            <TipoAmbienteChip tipo={tipoAmb} />
          </div>
          <EstadoBadge estado={reserva.estado} />
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-[0.8125rem] text-texto-suave">Solicitante</dt>
            <dd className="mt-1 flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-full bg-primario-suave text-primario font-bold text-xs flex items-center justify-center shrink-0">{obtenerIniciales(nomSol) || 'U'}</span>
              <div className="min-w-0"><p className="text-[1rem] font-medium text-texto leading-snug truncate">{nomSol || '—'}</p>{corSol && <p className="text-xs text-texto-suave truncate">{corSol}</p>}</div>
            </dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-texto-suave">Fecha y horario</dt>
            <dd className="mt-1 text-[1rem] font-medium text-texto cifra-tabular leading-snug">{fechaHorario}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-texto-suave">Ubicación</dt>
            <dd className="mt-1 text-[1rem] font-medium text-texto leading-snug">{ubic || '—'}</dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-texto-suave">Capacidad</dt>
            <dd className="mt-1 text-[1rem] font-medium text-texto leading-snug cifra-tabular">{cap ? `${cap} personas` : '—'}</dd>
          </div>
        </dl>
        <div className="pt-1">
          <p className="text-[0.8125rem] text-texto-suave">Motivo</p>
          <div className="mt-1">
            <p ref={motivoRef} className={`text-[1rem] font-medium text-texto leading-snug break-words ${expandido ? '' : 'line-clamp-3'}`}>{reserva.motivo || '—'}</p>
            {puedeExpandir && <button type="button" onClick={() => setExpandido((v) => !v)} className="mt-1 text-xs font-semibold text-primario hover:underline focus:outline-none">{expandido ? 'Ver menos' : 'Ver más'}</button>}
          </div>
        </div>
      </div>
      {reserva.fechaRegistro && (
        <div className="pt-2.5 border-t border-borde mt-auto">
          <p className="text-[0.8125rem] text-texto-suave mb-1">Historial</p>
          <div className="flex items-start gap-2 text-[0.875rem] text-texto">
            <span className="w-2 h-2 rounded-full bg-primario mt-1.5 shrink-0" aria-hidden="true" />
            <p className="leading-snug"><span className="font-medium text-texto">Solicitud creada</span>{nomSol ? <span> por <span className="font-medium text-texto">{nomSol}</span></span> : ''}<span className="text-texto-suave cifra-tabular"> · {formatearFecha(reserva.fechaRegistro)}</span></p>
          </div>
        </div>
      )}
    </article>
  );
}
