// RF-07 · RN-05 · RN-06 · Acciones sobre reserva derivadas de accionesPermitidas · E-18..20 · E-47
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContextoAuth } from '../../hooks/useAuth';
import { usePermisos } from '../../hooks/usePermisos';
import { accionesPermitidas } from '../../utils/accionesPermitidas';
import { ESTADOS_FINALES } from '../../constants/estados';
import { RUTAS } from '../../constants/rutas';
import { formatearFecha } from '../../utils/formatearFecha';
import Button from '../ui/Button';

export default function AccionesReserva({
  reserva,
  usuario: usuarioProp = null,
  enProceso = false,
  alSolicitarAprobar,
  alSolicitarRechazar,
  alSolicitarCancelar
}) {
  const auth = useContext(ContextoAuth);
  const usuario = usuarioProp || auth?.usuario;
  const { puede } = usePermisos();
  const acciones = accionesPermitidas(reserva, usuario, puede);
  const esEstadoFinal = ESTADOS_FINALES.includes(reserva?.estado);
  const contexto = `${reserva?.ambiente?.nombre || 'ambiente'} del ${formatearFecha(reserva?.fecha)}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center min-w-[18rem]">
      <div className="flex">
        <Link
          to={RUTAS.crearDetalleReserva(reserva.id)}
          aria-label={`Ver detalle de reserva en ${contexto}`}
          className="min-h-control px-3 py-2 rounded-control border border-borde bg-superficie-2 text-texto hover:bg-fondo text-sm font-semibold inline-flex items-center justify-center no-underline w-full"
        >
          Ver detalle
        </Link>
      </div>

      <div className="flex">
        {acciones.includes('aprobar') ? (
          <Button variante="primario" disabled={enProceso} aria-label={`Aprobar reserva en ${contexto}`} onClick={() => alSolicitarAprobar?.(reserva)} className="w-full text-sm px-3">
            Aprobar
          </Button>
        ) : acciones.includes('cancelar') ? (
          <Button variante="secundario" disabled={enProceso} aria-label={`Cancelar reserva en ${contexto}`} onClick={() => alSolicitarCancelar?.(reserva)} className="w-full text-sm px-3">
            Cancelar
          </Button>
        ) : (
          <span className="text-sm text-texto-suave px-2">{esEstadoFinal ? 'Estado final' : '—'}</span>
        )}
      </div>

      <div className="flex">
        {acciones.includes('rechazar') && (
          <Button variante="peligro" disabled={enProceso} aria-label={`Rechazar reserva en ${contexto}`} onClick={() => alSolicitarRechazar?.(reserva)} className="w-full text-sm px-3">
            Rechazar
          </Button>
        )}
      </div>
    </div>
  );
}
