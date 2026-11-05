// RF-07 · RN-05 · RN-06 · ISO 9241-110 · Botones agrupados a la derecha [Detalle][Aprobar][Rechazar]
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextoAuth } from '../../hooks/useAuth';
import { usePermisos } from '../../hooks/usePermisos';
import { useTamanoFuente } from '../../hooks/useTamanoFuente';
import { accionesPermitidas } from '../../utils/accionesPermitidas';
import { RUTAS } from '../../constants/rutas';
import { ESTADOS_RESERVA } from '../../constants/estados';
import { MAPA_ICONOS } from '../../constants/iconos';
import Button from '../ui/Button';

export default function AccionesReserva({
  reserva, usuario: uProp = null, enProceso = false, alSolicitarAprobar, alSolicitarRechazar
}) {
  const auth = useContext(ContextoAuth); const usuario = uProp || auth?.usuario;
  const { puede } = usePermisos(); const { tamanoFuente } = useTamanoFuente(); const navegar = useNavigate();
  const esExtra = tamanoFuente === '125%'; const acciones = accionesPermitidas(reserva, usuario, puede);
  const esPend = reserva?.estado === ESTADOS_RESERVA.PENDIENTE;
  const solicitante = reserva?.solicitante?.nombreCompleto || 'solicitante';
  const puedeAprobar = esPend && acciones.includes('aprobar'); const puedeRechazar = esPend && acciones.includes('rechazar');
  const tieneAcciones = puedeAprobar || puedeRechazar;

  return (
    <div className="inline-flex items-center justify-end gap-2 whitespace-nowrap">
      <Button
        variante="neutral-info"
        tamano="sm"
        iconOnly
        icono={MAPA_ICONOS.VER_DETALLE}
        tooltip="Ver detalle de reserva"
        aria-label="Ver detalle de reserva"
        onClick={() => navegar(RUTAS.crearDetalleReserva(reserva.id), { state: { search: window.location.search, reservaId: reserva.id } })}
      />
      {tieneAcciones ? (
        <>
          {puedeAprobar && (
            <Button
              variante="success"
              tamano="sm"
              iconOnly={esExtra}
              disabled={enProceso}
              icono="Check"
              tooltip="Aprobar reserva"
              aria-label={`Aprobar reserva de ${solicitante}`}
              className={esExtra ? '' : 'px-2 xl:px-3'}
              onClick={() => alSolicitarAprobar?.(reserva)}
            >
              <span className={esExtra ? 'hidden' : 'hidden xl:inline'}>Aprobar</span>
            </Button>
          )}
          {puedeRechazar && (
            <Button
              variante="danger-outline"
              tamano="sm"
              iconOnly={esExtra}
              disabled={enProceso}
              icono="X"
              tooltip="Rechazar reserva"
              alineacionTooltip="derecha"
              aria-label={`Rechazar reserva de ${solicitante}`}
              className={esExtra ? '' : 'px-2 xl:px-3'}
              onClick={() => alSolicitarRechazar?.(reserva)}
            >
              <span className={esExtra ? 'hidden' : 'hidden xl:inline'}>Rechazar</span>
            </Button>
          )}
        </>
      ) : (
        <div className={`hidden sm:block ${esExtra ? 'w-20' : 'w-20 xl:w-[11.5rem]'}`} aria-hidden="true" />
      )}
    </div>
  );
}
