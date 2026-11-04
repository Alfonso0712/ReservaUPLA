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
        variante="secondary"
        tamano="sm"
        iconOnly
        icono={MAPA_ICONOS.VER_DETALLE}
        tooltip={`Ver detalle de la reserva de ${solicitante}`}
        aria-label={`Ver detalle de la reserva de ${solicitante}`}
        onClick={() => navegar(RUTAS.crearDetalleReserva(reserva.id))}
      />
      {puedeAprobar ? (
        <Button
          variante="secondary"
          tamano="sm"
          iconOnly
          disabled={enProceso}
          icono="Check"
          tooltip="Aprobar reserva"
          aria-label={`Aprobar reserva de ${solicitante}`}
          className="text-aprobada-texto hover:bg-aprobada-fondo border-aprobada-texto/30"
          onClick={() => alSolicitarAprobar?.(reserva)}
        />
      ) : (
        <div className="w-9 h-9 shrink-0 hidden sm:block" aria-hidden="true" />
      )}
      {puedeRechazar ? (
        <Button
          variante="secondary"
          tamano="sm"
          iconOnly
          disabled={enProceso}
          icono="X"
          tooltip="Rechazar reserva"
          aria-label={`Rechazar reserva de ${solicitante}`}
          className="text-rechazada-texto hover:bg-rechazada-fondo border-rechazada-texto/30"
          onClick={() => alSolicitarRechazar?.(reserva)}
        />
      ) : (
        <div className="w-9 h-9 shrink-0 hidden sm:block" aria-hidden="true" />
      )}
    </div>
  );
}
