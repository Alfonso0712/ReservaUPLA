// RF-06 · RF-07 · Detalle de reserva, confirmación y cancelación obligatoria con motivo
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermisos } from '../hooks/usePermisos';
import { accionesPermitidas } from '../utils/accionesPermitidas';
import { obtenerReservaPorIdApi, cambiarEstadoReservaApi } from '../services/reservaService';
import { interpretarRespuesta } from '../validation/interpretarRespuesta';
import { ESTADOS_RESERVA, ESTADOS_FINALES } from '../constants/estados';
import { MENSAJES } from '../constants/mensajes';
import { RUTAS } from '../constants/rutas';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import ResumenReserva from '../components/reservas/ResumenReserva';
import ModalConfirmacion from '../components/ui/ModalConfirmacion';
import AlertMessage from '../components/ui/AlertMessage';
import Cargando from '../components/ui/Cargando';
import Button from '../components/ui/Button';

export default function DetalleReserva() {
  const { id } = useParams();
  const navegar = useNavigate();
  const ctx = useOutletContext() || {};
  const { usuario } = useAuth(); const { puede } = usePermisos();
  const [reserva, setReserva] = useState(null); const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(''); const [alerta, setAlerta] = useState(null);
  const [modalCanc, setModalCanc] = useState(false); const [motivoCanc, setMotivoCanc] = useState('');
  const [errMot, setErrMot] = useState(''); const [enProceso, setEnProceso] = useState(false);

  const cargarDetalle = useCallback(async (signal) => {
    setCargando(true); setError('');
    const resp = await obtenerReservaPorIdApi(id, signal);
    if (signal?.aborted) return;
    const res = interpretarRespuesta(resp);
    if (res.ok) setReserva(res.datos); else setError(res.errorGeneral);
    setCargando(false);
  }, [id]);

  useEffect(() => { const c = new AbortController(); cargarDetalle(c.signal); return () => c.abort(); }, [cargarDetalle]);

  const ejecutarCancelar = async () => {
    if (!motivoCanc.trim()) { setErrMot('El motivo de la cancelación es obligatorio.'); return; }
    setEnProceso(true);
    const res = interpretarRespuesta(await cambiarEstadoReservaApi(reserva.id, ESTADOS_RESERVA.CANCELADA, motivoCanc));
    setEnProceso(false);
    if (res.ok) {
      setModalCanc(false); ctx.recargarDatos?.();
      navegar(RUTAS.RESERVAS, { replace: true, state: { toastExito: MENSAJES.RESERVA_CANCELADA_EXITO } });
    } else setErrMot(res.errorGeneral || 'Error al cancelar la reserva.');
  };

  const acciones = accionesPermitidas(reserva, usuario, puede);
  const puedeCancelar = reserva && [ESTADOS_RESERVA.PENDIENTE, ESTADOS_RESERVA.APROBADA].includes(reserva.estado);

  return (
    <div className="space-y-5">
      <EncabezadoPagina titulo="Detalle de reserva" descripcion="Información completa de la solicitud, estado actual y acciones permitidas." accionPrimaria={<Link to={RUTAS.RESERVAS} className="min-h-control px-4 py-2.5 rounded-control border border-borde bg-superficie-2 text-texto font-semibold inline-flex items-center no-underline">Volver a reservas</Link>} />
      {alerta && <AlertMessage variante={alerta.tipo} rol="status" mensaje={alerta.texto} enfocarAlAparecer alCerrar={() => setAlerta(null)} />}
      {error && <AlertMessage variante="error" rol="alert" mensaje={error} enfocarAlAparecer />}
      {cargando ? <Cargando /> : reserva && (
        <>
          <ResumenReserva reserva={reserva} />
          <section aria-label="Acciones sobre la reserva" className="p-5 rounded-tarjeta border border-borde bg-superficie flex flex-wrap items-center justify-between gap-4">
            {ESTADOS_FINALES.includes(reserva.estado) && !puedeCancelar ? <p className="text-sm font-medium text-texto-suave">{MENSAJES.TRANSICION_ESTADO_NO_PERMITIDA}</p> : (
              <div className="flex flex-wrap items-center gap-3">
                {acciones.includes('aprobar') && <Button variante="primario" onClick={async () => { const r = interpretarRespuesta(await cambiarEstadoReservaApi(reserva.id, ESTADOS_RESERVA.APROBADA)); if (r.ok) { setReserva(r.datos); setAlerta({ tipo: 'exito', texto: MENSAJES.RESERVA_APROBADA_EXITO }); } }}>Aprobar reserva</Button>}
                {puedeCancelar && <Button variante="danger-outline" icono="Ban" onClick={() => setModalCanc(true)}>Cancelar reserva</Button>}
              </div>
            )}
          </section>
          <ModalConfirmacion abierto={modalCanc} titulo={`¿Cancelar la reserva de ${reserva.solicitante?.nombreCompleto || 'solicitante'}?`} descripcion="Revise los datos de la reserva antes de confirmar la cancelación." reserva={reserva} requiereMotivo motivo={motivoCanc} alCambiarMotivo={(v) => { setMotivoCanc(v); if (errMot) setErrMot(''); }} errorMotivo={errMot} esIrreversible etiquetaConfirmar="Cancelar reserva" varianteConfirmar="danger-outline" enProceso={enProceso} alConfirmar={ejecutarCancelar} alCancelar={() => { setModalCanc(false); setMotivoCanc(''); setErrMot(''); }} />
        </>
      )}
    </div>
  );
}
