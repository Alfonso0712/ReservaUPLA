// RF-07 · RN-05 · RN-06 · ISO 9241-110 · Acciones sobre reserva unificadas
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContextoAuth } from '../../hooks/useAuth';
import { usePermisos } from '../../hooks/usePermisos';
import { accionesPermitidas } from '../../utils/accionesPermitidas';
import { ESTADOS_FINALES } from '../../constants/estados';
import { RUTAS } from '../../constants/rutas';
import { formatearFecha } from '../../utils/formatearFecha';
import { MAPA_ICONOS } from '../../constants/iconos';
import Button from '../ui/Button';
import Icono from '../ui/Icono';

export default function AccionesReserva({
  reserva, usuario: usuarioProp = null, enProceso = false,
  alSolicitarAprobar, alSolicitarRechazar, alSolicitarCancelar
}) {
  const auth = useContext(ContextoAuth);
  const usuario = usuarioProp || auth?.usuario;
  const { puede } = usePermisos();
  const acciones = accionesPermitidas(reserva, usuario, puede);
  const esEstadoFinal = ESTADOS_FINALES.includes(reserva?.estado);
  const contexto = `${reserva?.ambiente?.nombre || 'ambiente'} del ${formatearFecha(reserva?.fecha)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        to={RUTAS.crearDetalleReserva(reserva.id)}
        aria-label={`Ver detalle de reserva en ${contexto}`}
        className="h-9 min-h-[2.25rem] px-3 rounded-control border border-borde bg-superficie text-texto hover:bg-superficie-2 hover:border-borde-control text-sm font-medium inline-flex items-center gap-2 no-underline transition-colors focus-visible:ring-2 focus-visible:ring-anillo-foco outline-none"
      >
        <Icono nombre={MAPA_ICONOS.VER_DETALLE} className="w-4 h-4 text-primario" />
        <span>Ver detalle</span>
      </Link>

      {acciones.includes('aprobar') && (
        <Button
          variante="success"
          tamano="sm"
          disabled={enProceso}
          icono={MAPA_ICONOS.APROBAR}
          aria-label={`Aprobar reserva en ${contexto}`}
          onClick={() => alSolicitarAprobar?.(reserva)}
        >
          Aprobar
        </Button>
      )}

      {acciones.includes('rechazar') && (
        <Button
          variante="danger-outline"
          tamano="sm"
          disabled={enProceso}
          icono={MAPA_ICONOS.RECHAZAR}
          aria-label={`Rechazar reserva en ${contexto}`}
          onClick={() => alSolicitarRechazar?.(reserva)}
        >
          Rechazar
        </Button>
      )}

      {acciones.includes('cancelar') && (
        <Button
          variante="secondary"
          tamano="sm"
          disabled={enProceso}
          icono={MAPA_ICONOS.CANCELAR}
          aria-label={`Cancelar reserva en ${contexto}`}
          onClick={() => alSolicitarCancelar?.(reserva)}
        >
          Cancelar
        </Button>
      )}

      {!acciones.length && (
        <span className="text-xs text-texto-suave px-1.5 italic">{esEstadoFinal ? 'Estado final' : '—'}</span>
      )}
    </div>
  );
}
