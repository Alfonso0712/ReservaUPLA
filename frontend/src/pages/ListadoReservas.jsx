// RF-05 · RF-07 · Listado de reservas con jerarquía, anchos definidos y filtros compactos
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useOutletContext, useLocation, Link } from 'react-router-dom';
import { usePermisos } from '../hooks/usePermisos';
import { useReservas } from '../hooks/useReservas';
import { useDashboard } from '../hooks/useDashboard';
import { useDebounce } from '../hooks/useDebounce';
import { useAccionesReserva } from '../hooks/useAccionesReserva';
import { PERMISOS } from '../constants/permisos';
import { RUTAS } from '../constants/rutas';
import { ESTADOS_RESERVA } from '../constants/estados';
import { MENSAJES } from '../constants/mensajes';
import { formatearFecha } from '../utils/formatearFecha';
import { formatearRangoHorario } from '../utils/formatearHora';
import { obtenerIniciales } from '../utils/obtenerIniciales';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import FiltrosReservas from '../components/reservas/FiltrosReservas';
import PestanasEstado from '../components/reservas/PestanasEstado';
import AccionesReserva from '../components/reservas/AccionesReserva';
import ModalAccionReserva from '../components/reservas/ModalAccionReserva';
import TableList from '../components/ui/TableList';
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';
import Button from '../components/ui/Button';

export default function ListadoReservas() {
  const { puede } = usePermisos(); const ctx = useOutletContext() || {};
  const [params, setParams] = useSearchParams(); const loc = useLocation();
  const [txtIn, setTxtIn] = useState(() => params.get('texto') || '');
  const [fDesde, setFDesde] = useState(() => params.get('desde') || ''); const [fHasta, setFHasta] = useState(() => params.get('hasta') || '');
  const [toasts, setToasts] = useState([]); const acc = useAccionesReserva();
  const { indicadores } = useDashboard(ctx.versionDatos || 0);
  const estadoFiltro = params.has('estado') ? (params.get('estado') || '') : ((indicadores && (indicadores.pendientes || 0) === 0) ? '' : ESTADOS_RESERVA.PENDIENTE);
  const debTxt = useDebounce(txtIn);
  const { reservas, cargando, enProcesoAccion, cambiarEstado } = useReservas({ estado: estadoFiltro, texto: debTxt, versionExterna: ctx.versionDatos || 0 });

  const actParam = useCallback((k, v) => {
    const p = new URLSearchParams(params);
    if (k === 'estado') p.set(k, v || ''); else if (v) p.set(k, v); else p.delete(k);
    setParams(p, { replace: true });
  }, [params, setParams]);

  useEffect(() => {
    if (loc.state?.toastExito) setToasts((p) => [...p.slice(-2), { id: Date.now(), tipo: 'exito', mensaje: loc.state.toastExito }]);
    if (loc.state?.enfocarId && typeof window !== 'undefined') window.requestAnimationFrame(() => document.querySelector(`[data-reserva-id="${loc.state.enfocarId}"]`)?.focus());
    if (loc.state) window.history.replaceState({}, document.title);
  }, [loc.state]);

  const alExito = (resv, nuevoEst) => {
    if (nuevoEst === ESTADOS_RESERVA.APROBADA) setToasts((p) => [...p.slice(-2), { id: Date.now(), tipo: 'exito', mensaje: MENSAJES.RESERVA_APROBADA_EXITO, alDeshacer: () => cambiarEstado(resv.id, ESTADOS_RESERVA.PENDIENTE) }]);
    else setToasts((p) => [...p.slice(-2), { id: Date.now(), tipo: 'exito', mensaje: MENSAJES.RESERVA_RECHAZADA_EXITO }]);
  };

  const ordenadas = useMemo(() => [...reservas].filter((r) => (!fDesde || r.fecha >= fDesde) && (!fHasta || r.fecha <= fHasta)).sort((a, b) => {
    const pA = a.estado === ESTADOS_RESERVA.PENDIENTE ? 0 : 1; const pB = b.estado === ESTADOS_RESERVA.PENDIENTE ? 0 : 1;
    return pA !== pB ? pA - pB : `${a.fecha || ''} ${a.horaInicio || ''}`.localeCompare(`${b.fecha || ''} ${b.horaInicio || ''}`);
  }), [reservas, fDesde, fHasta]);

  const columnas = [
    { clave: 'solicitante', encabezado: 'Solicitante', ordenable: true, claseEncabezado: 'w-[17%]', claseCelda: 'max-w-[10.5rem]', render: (r) => <div className="flex items-center gap-2 min-w-0 max-w-[10.5rem]"><span className="w-8 h-8 rounded-full bg-primario-suave text-primario dark:text-primario-enlace font-bold text-xs flex items-center justify-center shrink-0">{obtenerIniciales(r.solicitante?.nombreCompleto) || 'U'}</span><div className="min-w-0"><Link to={RUTAS.crearDetalleReserva(r.id)} state={{ search: loc.search, reservaId: r.id }} data-reserva-id={r.id} className="font-semibold text-texto hover:text-primario-enlace hover:underline truncate block text-sm leading-snug">{r.solicitante?.nombreCompleto}</Link><p className="text-xs text-texto-suave truncate mt-0.5 leading-snug">{r.solicitante?.correo}</p></div></div> },
    { clave: 'ambiente', encabezado: 'Ambiente', claseEncabezado: 'w-[20%] max-w-[12.5rem]', claseCelda: 'max-w-[12.5rem]', render: (r) => { const esP = r.estado === ESTADOS_RESERVA.PENDIENTE; const mF = (r.estado === ESTADOS_RESERVA.RECHAZADA || r.estado === ESTADOS_RESERVA.CANCELADA) ? (r.motivoEstadoFinal || r.motivoCancelacion || r.motivoRechazo) : null; const m = esP ? r.motivo : (mF ? `Motivo: ${mF}` : null); return <div className="min-w-0 max-w-[12.5rem]"><p className="font-semibold text-texto truncate block text-sm leading-snug">{r.ambiente?.nombre}</p>{r.ambiente?.tipo && <p className="text-xs text-texto-suave mt-0.5 truncate leading-snug">{r.ambiente.tipo}</p>}{m && <p title={m} className="text-xs text-texto-suave mt-0.5 truncate leading-snug">{m}</p>}</div>; } },
    { clave: 'fecha', encabezado: 'Fecha y horario', ordenable: true, claseEncabezado: 'w-[25%] whitespace-nowrap', claseCelda: 'whitespace-nowrap', render: (r) => <div className="flex flex-wrap sm:flex-nowrap items-center gap-x-1.5 gap-y-0.5 cifra-tabular text-sm whitespace-nowrap w-full sm:w-max"><span className="font-semibold text-texto whitespace-nowrap leading-snug">{formatearFecha(r.fecha)}</span><span className="text-texto-suave select-none" aria-hidden="true">·</span><span className="text-texto-suave whitespace-nowrap leading-snug">{formatearRangoHorario(r.horaInicio, r.horaFin)}</span></div> },
    { clave: 'estado', encabezado: 'Estado', claseEncabezado: 'w-[10%]', claseCelda: 'whitespace-nowrap', render: (r) => <Badge estado={r.estado} /> },
    { clave: 'acciones', encabezado: 'Acciones', claseEncabezado: 'w-[28%] text-right', claseCelda: 'text-right whitespace-nowrap', render: (r) => <AccionesReserva reserva={r} enProceso={enProcesoAccion || acc.enProceso} alSolicitarAprobar={acc.solicitarAprobar} alSolicitarRechazar={acc.solicitarRechazar} /> }
  ];

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto w-full">
      <EncabezadoPagina titulo="Reservas" descripcion="Consulte, filtre y gestione las solicitudes de reserva de ambientes universitarios." accionPrimaria={puede(PERMISOS.RESERVAS_CREAR) ? <Button variante="primary" icono="CalendarPlus" onClick={() => ctx.abrirModalReserva?.('')}>Nueva reserva</Button> : null} />
      <FiltrosReservas texto={txtIn} estado={estadoFiltro} fechaDesde={fDesde} fechaHasta={fHasta} totalResultados={ordenadas.length} alCambiarTexto={setTxtIn} alCambiarFechaDesde={(v) => { setFDesde(v); actParam('desde', v); }} alCambiarFechaHasta={(v) => { setFHasta(v); actParam('hasta', v); }} alLimpiar={() => { setTxtIn(''); setFDesde(''); setFHasta(''); setParams({ estado: '' }, { replace: true }); }} />
      <PestanasEstado estadoActivo={estadoFiltro} conteos={indicadores} alSeleccionar={(e) => actParam('estado', e)} />
      <TableList caption="Listado de solicitudes de reserva de ambientes" columnas={columnas} datos={ordenadas} cargando={cargando} esFiltroActivo={Boolean(txtIn.trim() || estadoFiltro || fDesde || fHasta)} alLimpiarFiltros={() => { setTxtIn(''); setFDesde(''); setFHasta(''); setParams({ estado: '' }, { replace: true }); }} mensajeVacio="No hay reservas registradas aún" descripcionVacia="Puede registrar una nueva solicitud de reserva con el botón superior." obtenerClaseFila={(r) => r.estado === ESTADOS_RESERVA.PENDIENTE ? 'border-l-4 border-l-[var(--btn-warning-fg)] bg-[var(--btn-warning-bg)]/40' : 'border-l-4 border-l-transparent'} />
      <ModalAccionReserva modal={acc.modal} motivo={acc.motivo} alCambiarMotivo={acc.setMotivo} errorMotivo={acc.errorMotivo} enProceso={acc.enProceso} alConfirmar={() => acc.ejecutarAccion(cambiarEstado, alExito)} alCancelar={acc.cerrarModal} />
      <Toast toasts={toasts} alCerrar={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
}
