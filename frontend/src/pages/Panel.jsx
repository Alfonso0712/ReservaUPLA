// RF-08 · Rediseño visual y funcional del Panel · Cambio 1 al 8 · E-30..53
import { useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermisos } from '../hooks/usePermisos';
import { useDashboard } from '../hooks/useDashboard';
import { useReservas } from '../hooks/useReservas';
import { useAccionesReserva } from '../hooks/useAccionesReserva';
import { PERMISOS } from '../constants/permisos';
import { ESTADOS_RESERVA } from '../constants/estados';
import { MENSAJES } from '../constants/mensajes';
import EncabezadoPanel from '../components/panel/EncabezadoPanel';
import KpisPanel from '../components/panel/KpisPanel';
import ResumenOcupacion from '../components/panel/ResumenOcupacion';
import RequiereAtencion from '../components/panel/RequiereAtencion';
import GraficaReservasEstado from '../components/panel/GraficaReservasEstado';
import RankingAmbientes from '../components/panel/RankingAmbientes';
import ProximasReservas from '../components/panel/ProximasReservas';
import ModalAccionReserva from '../components/reservas/ModalAccionReserva';
import AlertMessage from '../components/ui/AlertMessage';
import Cargando from '../components/ui/Cargando';
import EstadoVacio from '../components/ui/EstadoVacio';
import Toast from '../components/ui/Toast';
import Button from '../components/ui/Button';

export default function Panel() {
  const { usuario } = useAuth(); const { puede } = usePermisos(); const ctx = useOutletContext() || {};
  const ubicacion = useLocation(); const [toasts, setToasts] = useState([]);
  const { indicadores, cargando: cargandoDash, error: errorDash, recargar: recargarDash } = useDashboard(ctx.versionDatos || 0);
  const { reservas, cargando: cargandoResv, error: errorResv, recargar: recargarResv, cambiarEstado } = useReservas({ versionExterna: ctx.versionDatos || 0 });
  const acciones = useAccionesReserva();
  const cargando = cargandoDash || cargandoResv; const error = errorDash || errorResv;

  const alExito = (resv, nuevoEst) => {
    recargarDash(); recargarResv(); ctx.recargarDatos?.();
    const esApr = nuevoEst === ESTADOS_RESERVA.APROBADA;
    setToasts((p) => [...p.slice(-2), { id: Date.now(), tipo: 'exito', mensaje: esApr ? MENSAJES.RESERVA_APROBADA_EXITO : MENSAJES.RESERVA_RECHAZADA_EXITO, alDeshacer: esApr ? () => cambiarEstado(resv.id, ESTADOS_RESERVA.PENDIENTE).then(() => { recargarDash(); recargarResv(); }) : undefined }]);
  };

  const recargarTodo = () => { recargarDash(); recargarResv(); };

  return (
    <div className="space-y-5 max-w-[1440px] mx-auto w-full">
      <EncabezadoPanel usuario={usuario} pendientes={indicadores?.pendientes ?? 0} puedeReservar={puede(PERMISOS.RESERVAS_CREAR)} puedeCrearAmbiente={puede(PERMISOS.AMBIENTES_CREAR)} alNuevaReserva={() => ctx.abrirModalReserva?.('')} />
      {ubicacion.state?.alertaSinPermiso && <AlertMessage variante="error" rol="alert" mensaje={ubicacion.state.alertaSinPermiso} enfocarAlAparecer />}
      {ctx.mensajeGlobal && <AlertMessage variante="exito" rol="status" mensaje={ctx.mensajeGlobal} enfocarAlAparecer alCerrar={ctx.limpiarMensajeGlobal} />}
      {error && <div className="flex items-center justify-between p-4 rounded-control bg-rechazada-fondo text-rechazada-texto border border-rechazada-texto text-sm"><span>{error}</span><Button variante="secondary" tamano="sm" onClick={recargarTodo}>Reintentar</Button></div>}
      {cargando ? <Cargando /> : (
        <>
          <KpisPanel indicadores={indicadores} />
          <ResumenOcupacion reservas={reservas} />
          {puede(PERMISOS.RESERVAS_APROBAR) && <RequiereAtencion reservas={reservas} todasLasReservas={reservas} puedeAprobar enProceso={acciones.enProceso} alAprobar={acciones.solicitarAprobar} alRechazar={acciones.solicitarRechazar} />}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><GraficaReservasEstado indicadores={indicadores} /><RankingAmbientes reservas={reservas} /></div>
          <ProximasReservas reservas={reservas} />
          {indicadores?.total === 0 && <EstadoVacio titulo="No hay reservas registradas todavía" descripcion="Registre la primera solicitud de reserva para visualizar la actividad académica." />}
        </>
      )}
      <ModalAccionReserva modal={acciones.modal} motivo={acciones.motivo} alCambiarMotivo={acciones.setMotivo} errorMotivo={acciones.errorMotivo} enProceso={acciones.enProceso} alConfirmar={() => acciones.ejecutarAccion(cambiarEstado, alExito)} alCancelar={acciones.cerrarModal} />
      <Toast toasts={toasts} alCerrar={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
}
