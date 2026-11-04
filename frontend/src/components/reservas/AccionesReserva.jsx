// RF-07 · RN-05 · RN-06 · Acciones sobre reserva con íconos de color y tamaño armonizado · E-18..20 · E-47
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContextoAuth } from '../../hooks/useAuth';
import { usePermisos } from '../../hooks/usePermisos';
import { accionesPermitidas } from '../../utils/accionesPermitidas';
import { ESTADOS_FINALES } from '../../constants/estados';
import { RUTAS } from '../../constants/rutas';
import { formatearFecha } from '../../utils/formatearFecha';
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
    <div className="flex flex-wrap items-center gap-1.5 min-w-[16rem]">
      <Link
        to={RUTAS.crearDetalleReserva(reserva.id)}
        aria-label={`Ver detalle de reserva en ${contexto}`}
        className="min-h-[32px] h-8 px-2.5 py-1 rounded-control border border-borde bg-superficie text-texto hover:bg-superficie-2 hover:border-borde-control text-xs font-semibold inline-flex items-center gap-1.5 no-underline transition-all"
      >
        <Icono nombre="Eye" className="w-3.5 h-3.5 text-primario" />
        <span>Ver detalle</span>
      </Link>

      {acciones.includes('aprobar') && (
        <Button variante="secundario" tamano="sm" disabled={enProceso} aria-label={`Aprobar reserva en ${contexto}`} onClick={() => alSolicitarAprobar?.(reserva)} className="border-aprobada-texto text-aprobada-texto hover:bg-aprobada-fondo">
          <Icono nombre="CircleCheck" className="w-3.5 h-3.5 text-aprobada-texto" />
          <span>Aprobar</span>
        </Button>
      )}

      {acciones.includes('rechazar') && (
        <Button variante="secundario" tamano="sm" disabled={enProceso} aria-label={`Rechazar reserva en ${contexto}`} onClick={() => alSolicitarRechazar?.(reserva)} className="border-rechazada-texto text-rechazada-texto hover:bg-rechazada-fondo">
          <Icono nombre="CircleX" className="w-3.5 h-3.5 text-rechazada-texto" />
          <span>Rechazar</span>
        </Button>
      )}

      {acciones.includes('cancelar') && (
        <Button variante="secundario" tamano="sm" disabled={enProceso} aria-label={`Cancelar reserva en ${contexto}`} onClick={() => alSolicitarCancelar?.(reserva)} className="border-borde text-texto hover:border-rechazada-texto hover:text-rechazada-texto hover:bg-rechazada-fondo/20">
          <Icono nombre="Ban" className="w-3.5 h-3.5 text-rechazada-texto" />
          <span>Cancelar</span>
        </Button>
      )}

      {!acciones.length && (
        <span className="text-xs text-texto-suave px-1.5 italic">{esEstadoFinal ? 'Estado final' : '—'}</span>
      )}
    </div>
  );
}
