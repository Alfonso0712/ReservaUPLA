// RF-06 · RF-07 · Detalle de reserva, acciones por estado y sincronización con lista
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation, useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermisos } from '../hooks/usePermisos';
import { useAccionesReserva } from '../hooks/useAccionesReserva';
import { accionesPermitidas } from '../utils/accionesPermitidas';
import { obtenerReservaPorIdApi, cambiarEstadoReservaApi } from '../services/reservaService';
import { interpretarRespuesta } from '../validation/interpretarRespuesta';
import { ESTADOS_RESERVA, ESTADOS_FINALES } from '../constants/estados';
import { PERMISOS } from '../constants/permisos';
import { MENSAJES } from '../constants/mensajes';
import { RUTAS } from '../constants/rutas';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import ResumenReserva from '../components/reservas/ResumenReserva';
import ModalAccionReserva from '../components/reservas/ModalAccionReserva';
import AlertMessage from '../components/ui/AlertMessage';
import Cargando from '../components/ui/Cargando';
import Button from '../components/ui/Button';

export default function DetalleReserva() {
  const { id } = useParams(); const navegar = useNavigate(); const loc = useLocation(); const ctx = useOutletContext() || {};
  const { usuario } = useAuth(); const { puede } = usePermisos();
  const [reserva, setReserva] = useState(null); const [cargando, setCargando] = useState(true); const [error, setError] = useState('');
  const accHook = useAccionesReserva();

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
  const esPend = reserva?.estado === ESTADOS_RESERVA.PENDIENTE;
  const esAprob = reserva?.estado === ESTADOS_RESERVA.APROBADA;
  const esFinal = ESTADOS_FINALES.includes(reserva?.estado);

  const botonesAccion = esPend ? (
    <>
      {acciones.includes('aprobar') && <Button variante="success" icono="Check" onClick={() => accHook.solicitarAprobar(reserva)}>Aprobar</Button>}
      {acciones.includes('rechazar') && <Button variante="danger" icono="X" onClick={() => accHook.solicitarRechazar(reserva)}>Rechazar</Button>}
    </>
  ) : esAprob ? (
    acciones.includes('cancelar') && <Button variante="danger" icono="Ban" onClick={() => accHook.solicitarCancelar(reserva)}>Cancelar reserva</Button>
  ) : null;

  return (
    <div className={`space-y-5 ${botonesAccion ? 'pb-20 sm:pb-0' : ''}`}>
      <EncabezadoPagina titulo="Detalle de reserva" descripcion="Información completa de la solicitud, estado actual y acciones permitidas." accionPrimaria={<Link to={`${RUTAS.RESERVAS}${loc.state?.search || ''}`} className="min-h-control px-4 py-2.5 rounded-control border border-borde bg-superficie-2 text-texto font-semibold inline-flex items-center no-underline">Volver a reservas</Link>} />
      {error && <AlertMessage variante="error" rol="alert" mensaje={error} enfocarAlAparecer />}
      {cargando ? <Cargando /> : reserva && (
        <>
          <ResumenReserva reserva={reserva} esAdmin={puede(PERMISOS.RESERVAS_APROBAR)} acciones={botonesAccion} />
          {esFinal && <p className="text-sm font-medium text-texto-suave">{MENSAJES.TRANSICION_ESTADO_NO_PERMITIDA}</p>}
          {botonesAccion && <aside aria-label="Acciones sobre la reserva" className="sm:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-superficie border-t border-borde shadow-lg flex items-center justify-center gap-3">{botonesAccion}</aside>}
          <ModalAccionReserva modal={accHook.modal} motivo={accHook.motivo} alCambiarMotivo={accHook.setMotivo} errorMotivo={accHook.errorMotivo} enProceso={accHook.enProceso} alConfirmar={() => accHook.ejecutarAccion(cambiarEstadoReservaApi, alExitoAccion)} alCancelar={accHook.cerrarModal} />
        </>
      )}
    </div>
  );
}
