// RF-06 · RF-07 · Rediseño completo de Detalle de reserva en 2 columnas · E-18..21
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermisos } from '../hooks/usePermisos';
import { useAccionesReserva } from '../hooks/useAccionesReserva';
import { useReservas } from '../hooks/useReservas';
import { accionesPermitidas } from '../utils/accionesPermitidas';
import { detectarConflicto } from '../utils/detectarConflicto';
import { obtenerReservaPorIdApi, cambiarEstadoReservaApi } from '../services/reservaService';
import { interpretarRespuesta } from '../validation/interpretarRespuesta';
import { ESTADOS_RESERVA } from '../constants/estados';
import { MENSAJES } from '../constants/mensajes';
import { RUTAS } from '../constants/rutas';
import EncabezadoDetalle from '../components/detalle/EncabezadoDetalle';
import InfoPrincipalDetalle from '../components/detalle/InfoPrincipalDetalle';
import ColumnaDecision from '../components/detalle/ColumnaDecision';
import BarraInferiorMovil from '../components/detalle/BarraInferiorMovil';
import SkeletonDetalle from '../components/detalle/SkeletonDetalle';
import ModalAccionReserva from '../components/reservas/ModalAccionReserva';
import EstadoVacio from '../components/ui/EstadoVacio';
import Button from '../components/ui/Button';

export default function DetalleReserva() {
  const { id } = useParams(); const navegar = useNavigate(); const loc = useLocation(); const ctx = useOutletContext() || {};
  const { usuario } = useAuth(); const { puede } = usePermisos();
  const [reserva, setReserva] = useState(null); const [cargando, setCargando] = useState(true); const [error, setError] = useState('');
  const accHook = useAccionesReserva();
  const { reservas } = useReservas({ versionExterna: ctx.versionDatos || 0 });

  const cargarDetalle = useCallback(async (signal) => {
    setCargando(true); setError('');
    const resp = await obtenerReservaPorIdApi(id, signal);
    if (signal?.aborted) return;
    const res = interpretarRespuesta(resp);
    if (res.ok) setReserva(res.datos); else setError(res.errorGeneral);
    setCargando(false);
  }, [id]);

  useEffect(() => { const c = new AbortController(); cargarDetalle(c.signal); return () => c.abort(); }, [cargarDetalle]);

  const alExitoAccion = (resv, nuevoEst) => {
    ctx.recargarDatos?.();
    const msg = nuevoEst === ESTADOS_RESERVA.APROBADA ? MENSAJES.RESERVA_APROBADA_EXITO : (nuevoEst === ESTADOS_RESERVA.CANCELADA ? MENSAJES.RESERVA_CANCELADA_EXITO : MENSAJES.RESERVA_RECHAZADA_EXITO);
    const search = loc.state?.search || '';
    navegar(`${RUTAS.RESERVAS}${search}`, { replace: true, state: { toastExito: msg, enfocarId: resv.id } });
  };

  const acciones = accionesPermitidas(reserva, usuario, puede);
  const conflicto = detectarConflicto(reserva, reservas);
  const tieneAcciones = acciones.includes('aprobar') || acciones.includes('cancelar');

  return (
    <div className={`space-y-2.5 max-w-[1440px] mx-auto w-full min-h-[calc(100dvh-5.5rem)] flex flex-col ${tieneAcciones ? 'pb-20 sm:pb-0' : ''}`}>
      <EncabezadoDetalle search={loc.state?.search || ''} reservaId={reserva?.id} />
      {error && (
        <div className="flex items-center justify-between p-4 rounded-control bg-rechazada-fondo text-rechazada-texto border border-rechazada-texto text-sm">
          <span>{error}</span>
          <Button variante="secondary" tamano="sm" onClick={() => cargarDetalle()}>Reintentar</Button>
        </div>
      )}
      {cargando ? <SkeletonDetalle /> : !reserva ? (
        <EstadoVacio titulo="Reserva no encontrada" descripcion="La reserva solicitada no existe o fue eliminada." accion={<Button variante="primary" onClick={() => navegar(`${RUTAS.RESERVAS}${loc.state?.search || ''}`)}>Volver a reservas</Button>} />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch flex-1">
          <div className="xl:col-span-2 flex flex-col h-full"><InfoPrincipalDetalle reserva={reserva} /></div>
          <div className="xl:col-span-1 flex flex-col h-full"><ColumnaDecision reserva={reserva} puedeAprobar={acciones.includes('aprobar')} puedeCancelar={acciones.includes('cancelar')} conflicto={conflicto} enProceso={accHook.enProceso} alAprobar={accHook.solicitarAprobar} alRechazar={accHook.solicitarRechazar} alCancelar={accHook.solicitarCancelar} /></div>
          <BarraInferiorMovil reserva={reserva} puedeAprobar={acciones.includes('aprobar')} puedeCancelar={acciones.includes('cancelar')} enProceso={accHook.enProceso} alAprobar={accHook.solicitarAprobar} alRechazar={accHook.solicitarRechazar} alCancelar={accHook.solicitarCancelar} />
        </div>
      )}
      <ModalAccionReserva modal={accHook.modal} motivo={accHook.motivo} alCambiarMotivo={accHook.setMotivo} errorMotivo={accHook.errorMotivo} enProceso={accHook.enProceso} alConfirmar={() => accHook.ejecutarAccion(cambiarEstadoReservaApi, alExitoAccion)} alCancelar={accHook.cerrarModal} />
    </div>
  );
}
