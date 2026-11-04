// RF-07 · RN-05 · RN-06 · ISO 9241-110 · Botones icon-only en posiciones fijas [Detalle][Aprobar][Rechazar]
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextoAuth } from '../../hooks/useAuth';
import { usePermisos } from '../../hooks/usePermisos';
import { accionesPermitidas } from '../../utils/accionesPermitidas';
import { RUTAS } from '../../constants/rutas';
import { ESTADOS_RESERVA } from '../../constants/estados';
import { MAPA_ICONOS } from '../../constants/iconos';
import Button from '../ui/Button';

export default function AccionesReserva({
  reserva, usuario: uProp = null, enProceso = false,
  alSolicitarAprobar, alSolicitarRechazar
}) {
  const auth = useContext(ContextoAuth);
  const usuario = uProp || auth?.usuario;
  const { puede } = usePermisos();
  const navegar = useNavigate();
  const acciones = accionesPermitidas(reserva, usuario, puede);
  const esPend = reserva?.estado === ESTADOS_RESERVA.PENDIENTE;
  const solicitante = reserva?.solicitante?.nombreCompleto || 'solicitante';
  const puedeAprobar = esPend && acciones.includes('aprobar');
  const puedeRechazar = esPend && acciones.includes('rechazar');

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Button
        variante="neutral-info"
        tamano="sm"
        icono={MAPA_ICONOS.VER_DETALLE}
        tooltip={`Ver detalle de la reserva de ${solicitante}`}
        aria-label={`Ver detalle de la reserva de ${solicitante}`}
        className="w-auto px-2.5 sm:w-9 sm:px-0"
        onClick={() => navegar(RUTAS.crearDetalleReserva(reserva.id), { state: { search: window.location.search, reservaId: reserva.id } })}
      >
        <span className="inline sm:hidden">Detalle</span>
      </Button>
      {puedeAprobar ? (
        <Button
          variante="success"
          tamano="sm"
          disabled={enProceso}
          icono="Check"
          tooltip="Aprobar reserva"
          aria-label={`Aprobar reserva de ${solicitante}`}
          className="w-auto px-2.5 sm:w-9 sm:px-0 xl:w-auto xl:px-3"
          onClick={() => alSolicitarAprobar?.(reserva)}
        >
          <span className="inline sm:hidden xl:inline">Aprobar</span>
        </Button>
      ) : (
        <div className="w-9 xl:w-[94px] h-9 shrink-0 hidden sm:block" aria-hidden="true" />
      )}
      {puedeRechazar ? (
        <Button
          variante="danger"
          tamano="sm"
          disabled={enProceso}
          icono="X"
          tooltip="Rechazar reserva"
          aria-label={`Rechazar reserva de ${solicitante}`}
          className="w-auto px-2.5 sm:w-9 sm:px-0 xl:w-auto xl:px-3"
          onClick={() => alSolicitarRechazar?.(reserva)}
        >
          <span className="inline sm:hidden xl:inline">Rechazar</span>
        </Button>
      ) : (
        <div className="w-9 xl:w-[96px] h-9 shrink-0 hidden sm:block" aria-hidden="true" />
      )}
    </div>
  );
}
