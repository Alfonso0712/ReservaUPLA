// RF-07 · RN-05 · RN-06 · ISO 9241-110 · Jerarquía de acciones por fila en reservas
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextoAuth } from '../../hooks/useAuth';
import { usePermisos } from '../../hooks/usePermisos';
import { accionesPermitidas } from '../../utils/accionesPermitidas';
import { RUTAS } from '../../constants/rutas';
import { ESTADOS_RESERVA } from '../../constants/estados';
import { MAPA_ICONOS } from '../../constants/iconos';
import { formatearFecha } from '../../utils/formatearFecha';
import Button from '../ui/Button';
import MenuAccionesFila from '../ui/MenuAccionesFila';

export default function AccionesReserva({
  reserva, usuario: uProp = null, enProceso = false,
  alSolicitarAprobar, alSolicitarRechazar, alSolicitarCancelar
}) {
  const auth = useContext(ContextoAuth);
  const usuario = uProp || auth?.usuario;
  const { puede } = usePermisos();
  const navegar = useNavigate();
  const acciones = accionesPermitidas(reserva, usuario, puede);
  const ctx = `${reserva?.ambiente?.nombre || 'ambiente'} del ${formatearFecha(reserva?.fecha)}`;
  const esPend = reserva?.estado === ESTADOS_RESERVA.PENDIENTE;
  const esAprob = reserva?.estado === ESTADOS_RESERVA.APROBADA;

  const items = [
    { etiqueta: 'Ver detalle', icono: MAPA_ICONOS.VER_DETALLE, onClick: () => navegar(RUTAS.crearDetalleReserva(reserva.id)) }
  ];
  if (esPend && acciones.includes('cancelar')) {
    items.push({ etiqueta: 'Cancelar', icono: MAPA_ICONOS.CANCELAR, peligro: true, onClick: () => alSolicitarCancelar?.(reserva) });
  }

  return (
    <div className="flex items-center gap-2">
      {esPend && acciones.includes('aprobar') && (
        <Button variante="success" tamano="sm" disabled={enProceso} icono={MAPA_ICONOS.APROBAR} aria-label={`Aprobar reserva en ${ctx}`} onClick={() => alSolicitarAprobar?.(reserva)}>
          Aprobar
        </Button>
      )}
      {esPend && acciones.includes('rechazar') && (
        <Button variante="danger-outline" tamano="sm" disabled={enProceso} icono={MAPA_ICONOS.RECHAZAR} aria-label={`Rechazar reserva en ${ctx}`} onClick={() => alSolicitarRechazar?.(reserva)}>
          Rechazar
        </Button>
      )}
      {esAprob && acciones.includes('cancelar') && (
        <Button variante="secondary" tamano="sm" disabled={enProceso} icono={MAPA_ICONOS.CANCELAR} aria-label={`Cancelar reserva en ${ctx}`} onClick={() => alSolicitarCancelar?.(reserva)}>
          Cancelar
        </Button>
      )}
      <MenuAccionesFila items={items} ariaLabel={`Más acciones para reserva en ${ctx}`} />
    </div>
  );
}
