// RF-06 · RF-07 · RN-05 · RN-06 · Detalle de reserva con acciones permitidas · E-19..21 · E-47
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const MAPA_MENSAJE = { [ESTADOS_RESERVA.APROBADA]: MENSAJES.RESERVA_APROBADA_EXITO, [ESTADOS_RESERVA.RECHAZADA]: MENSAJES.RESERVA_RECHAZADA_EXITO, [ESTADOS_RESERVA.CANCELADA]: MENSAJES.RESERVA_CANCELADA_EXITO };
const MAPA_VERBO = { [ESTADOS_RESERVA.APROBADA]: 'Aprobar reserva', [ESTADOS_RESERVA.RECHAZADA]: 'Rechazar reserva', [ESTADOS_RESERVA.CANCELADA]: 'Cancelar reserva' };

export default function DetalleReserva() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const { puede } = usePermisos();
  const [reserva, setReserva] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [alerta, setAlerta] = useState(null);
  const [estadoModal, setEstadoModal] = useState('');
  const [enProceso, setEnProceso] = useState(false);

  const cargarDetalle = useCallback(async (signal) => {
    setCargando(true); setError('');
    const resp = await obtenerReservaPorIdApi(id, signal);
    if (signal?.aborted) return;
    const res = interpretarRespuesta(resp);
    if (res.ok) setReserva(res.datos); else setError(res.errorGeneral);
    setCargando(false);
  }, [id]);

  useEffect(() => {
    const ctrl = new AbortController();
    cargarDetalle(ctrl.signal);
    return () => ctrl.abort();
  }, [cargarDetalle]);

  const confirmarTransicion = async () => {
    if (!reserva || !estadoModal || enProceso) return;
    setEnProceso(true);
    const aplicado = estadoModal;
    const res = interpretarRespuesta(await cambiarEstadoReservaApi(reserva.id, aplicado));
    setEnProceso(false); setEstadoModal('');
    if (res.ok) { setReserva(res.datos); setAlerta({ tipo: 'exito', texto: MAPA_MENSAJE[aplicado] || 'Estado actualizado.' }); }
    else setAlerta({ tipo: 'error', texto: res.errorGeneral || MENSAJES.TRANSICION_ESTADO_NO_PERMITIDA });
  };

  const acciones = accionesPermitidas(reserva, usuario, puede);
  return (
    <div className="space-y-5">
      <EncabezadoPagina titulo="Detalle de reserva" descripcion="Información completa de la solicitud, estado actual y acciones permitidas." accionPrimaria={<Link to={RUTAS.RESERVAS} className="min-h-control px-4 py-2.5 rounded-control border border-borde bg-superficie-2 text-texto font-semibold inline-flex items-center no-underline">Volver a reservas</Link>} />
      {alerta && <AlertMessage variante={alerta.tipo} rol={alerta.tipo === 'error' ? 'alert' : 'status'} mensaje={alerta.texto} enfocarAlAparecer alCerrar={() => setAlerta(null)} />}
      {error && <AlertMessage variante="error" rol="alert" mensaje={error} enfocarAlAparecer />}
      {cargando && <Cargando />}
      {!cargando && reserva && (
        <>
          <ResumenReserva reserva={reserva} />
          <section aria-label="Acciones sobre la reserva" className="p-5 rounded-tarjeta border border-borde bg-superficie flex flex-wrap items-center justify-between gap-4">
            {ESTADOS_FINALES.includes(reserva.estado) ? <p className="text-sm font-medium text-texto-suave">{MENSAJES.TRANSICION_ESTADO_NO_PERMITIDA}</p> : <div className="flex flex-wrap items-center gap-3">{acciones.includes('aprobar') && <Button variante="primario" onClick={() => setEstadoModal(ESTADOS_RESERVA.APROBADA)}>Aprobar reserva</Button>}{acciones.includes('rechazar') && <Button variante="peligro" onClick={() => setEstadoModal(ESTADOS_RESERVA.RECHAZADA)}>Rechazar reserva</Button>}{acciones.includes('cancelar') && <Button variante="secundario" onClick={() => setEstadoModal(ESTADOS_RESERVA.CANCELADA)}>Cancelar reserva</Button>}</div>}
          </section>
          <ModalConfirmacion abierto={Boolean(estadoModal)} titulo={`Confirmar: ${MAPA_VERBO[estadoModal] || ''}`} descripcion="Revise los datos antes de confirmar el cambio de estado de la solicitud." reserva={reserva} esIrreversible={estadoModal !== ESTADOS_RESERVA.APROBADA} etiquetaConfirmar={MAPA_VERBO[estadoModal] || 'Confirmar'} varianteConfirmar={estadoModal === ESTADOS_RESERVA.APROBADA ? 'primario' : 'peligro'} enProceso={enProceso} alConfirmar={confirmarTransicion} alCancelar={() => setEstadoModal('')} />
        </>
      )}
    </div>
  );
}
