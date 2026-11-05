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
    <div className="flex items-center justify-start gap-2 w-full">
      <Button
        variante="neutral-info"
        tamano="sm"
        iconOnly
        icono={MAPA_ICONOS.VER_DETALLE}
        tooltip="Ver detalle de reserva"
        aria-label="Ver detalle de reserva"
        onClick={() => navegar(RUTAS.crearDetalleReserva(reserva.id), { state: { search: window.location.search, reservaId: reserva.id } })}
      />
      {puedeAprobar ? (
        <Button
          variante="success"
          tamano="sm"
          disabled={enProceso}
          icono="Check"
          tooltip="Aprobar reserva"
          aria-label={`Aprobar reserva de ${solicitante}`}
          className="w-auto px-3 sm:w-9 sm:px-0 sm:rounded-full xl:w-auto xl:px-3 xl:rounded-md"
          onClick={() => alSolicitarAprobar?.(reserva)}
        >
          <span className="inline sm:hidden xl:inline">Aprobar</span>
        </Button>
      ) : (
        <div className="flex-1 hidden sm:inline-flex items-center justify-center text-xs text-texto-suave select-none whitespace-nowrap" aria-hidden="true">
          Sin acciones pendientes
        </div>
      )}
      {puedeRechazar ? (
        <Button
          variante="danger-outline"
          tamano="sm"
          disabled={enProceso}
          icono="X"
          tooltip="Rechazar reserva"
          aria-label={`Rechazar reserva de ${solicitante}`}
          className="w-auto px-3 sm:w-9 sm:px-0 sm:rounded-full xl:w-auto xl:px-3 xl:rounded-md"
          onClick={() => alSolicitarRechazar?.(reserva)}
        >
          <span className="inline sm:hidden xl:inline">Rechazar</span>
        </Button>
      ) : (
        <div className="hidden" aria-hidden="true" />
      )}
    </div>
  );
}
