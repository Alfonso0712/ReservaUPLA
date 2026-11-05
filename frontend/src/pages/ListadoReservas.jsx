// RF-05 · RF-07 · Listado de reservas con jerarquía, anchos definidos y filtros compactos
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useOutletContext, useLocation, Link } from 'react-router-dom';
import { usePermisos } from '../hooks/usePermisos'; import { useReservas } from '../hooks/useReservas'; import { useDashboard } from '../hooks/useDashboard';
import { useDebounce } from '../hooks/useDebounce'; import { useAccionesReserva } from '../hooks/useAccionesReserva';
import { PERMISOS } from '../constants/permisos'; import { RUTAS } from '../constants/rutas'; import { ESTADOS_RESERVA } from '../constants/estados'; import { MENSAJES } from '../constants/mensajes';
import { formatearFecha } from '../utils/formatearFecha'; import { formatearRangoHorario } from '../utils/formatearHora'; import { obtenerIniciales } from '../utils/obtenerIniciales'; import { normalizarTexto } from '../utils/normalizarTexto';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina'; import FiltrosReservas from '../components/reservas/FiltrosReservas';
import PestanasEstado from '../components/reservas/PestanasEstado'; import AccionesReserva from '../components/reservas/AccionesReserva';
import ModalAccionReserva from '../components/reservas/ModalAccionReserva'; import TableList from '../components/ui/TableList';
import Badge from '../components/ui/Badge'; import Toast from '../components/ui/Toast'; import Button from '../components/ui/Button';

const limpiarTexto = (t) => normalizarTexto(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function ListadoReservas() {
  const { puede } = usePermisos(); const ctx = useOutletContext() || {};
  const [params, setParams] = useSearchParams(); const loc = useLocation();
  const [busquedaTexto, setBusquedaTexto] = useState(() => params.get('texto') || '');
  const [fechaDesde, setFechaDesde] = useState(() => params.get('desde') || ''); const [fechaHasta, setFechaHasta] = useState(() => params.get('hasta') || '');
  const [toasts, setToasts] = useState([]); const acciones = useAccionesReserva();
  const { indicadores } = useDashboard(ctx.versionDatos || 0);
  const estadoFiltro = params.has('estado') ? (params.get('estado') || '') : ((indicadores && (indicadores.pendientes || 0) === 0) ? '' : ESTADOS_RESERVA.PENDIENTE);
  const textoDebounce = useDebounce(busquedaTexto);
  const { reservas, cargando, enProcesoAccion, cambiarEstado } = useReservas({ estado: estadoFiltro, versionExterna: ctx.versionDatos || 0 });

  const actualizarParametro = useCallback((clave, valor) => {
    const nuevosParams = new URLSearchParams(params);
    if (clave === 'estado') nuevosParams.set(clave, valor || ''); else if (valor) nuevosParams.set(clave, valor); else nuevosParams.delete(clave);
    setParams(nuevosParams, { replace: true });
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

  const ordenadas = useMemo(() => {
    const q = limpiarTexto(textoDebounce);
    return reservas.filter((r) => {
      const f = r.fecha?.slice(0, 10);
      if (fechaDesde && (!f || f < fechaDesde)) return false;
      if (fechaHasta && (!f || f > fechaHasta)) return false;
      if (!q) return true;
      const s = limpiarTexto(`${r.solicitante?.nombreCompleto || r.nombreSolicitante || ''} ${r.solicitante?.correo || ''}`);
      const a = limpiarTexto(`${r.ambiente?.nombre || r.nombreAmbiente || ''} ${r.ambiente?.tipo || r.tipoAmbiente || ''}`);
      return s.includes(q) || a.includes(q) || limpiarTexto(r.motivo).includes(q);
    }).sort((a, b) => {
      const pA = a.estado === ESTADOS_RESERVA.PENDIENTE ? 0 : 1; const pB = b.estado === ESTADOS_RESERVA.PENDIENTE ? 0 : 1;
      return pA !== pB ? pA - pB : `${a.fecha || ''} ${a.horaInicio || ''}`.localeCompare(`${b.fecha || ''} ${b.horaInicio || ''}`);
    });
  }, [reservas, textoDebounce, fechaDesde, fechaHasta]);

  const columnas = [
    { clave: 'solicitante', encabezado: 'Solicitante', ordenable: true, claseEncabezado: 'min-w-[14rem] px-3', claseCelda: 'min-w-[14rem] px-3', render: (r) => { const n = r.solicitante?.nombreCompleto || r.nombreSolicitante || 'Usuario'; const c = r.solicitante?.correo || 'correo no disponible'; return (<div className="flex items-center gap-2.5 min-w-0"><span className="w-8 h-8 rounded-full bg-primario-suave text-primario dark:text-primario-enlace font-bold text-xs flex items-center justify-center shrink-0">{obtenerIniciales(n) || 'U'}</span><div className="min-w-0 flex-1"><Link to={RUTAS.crearDetalleReserva(r.id)} state={{ search: loc.search, reservaId: r.id }} data-reserva-id={r.id} title={n} className="font-semibold text-texto hover:text-primario-enlace hover:underline line-clamp-2 leading-snug break-words block text-sm">{n}</Link><p title={c} className="text-xs text-texto-suave truncate mt-0.5 leading-snug">{c}</p></div></div>); } },
    { clave: 'ambiente', encabezado: 'Ambiente', claseEncabezado: 'min-w-[12rem] px-3', claseCelda: 'min-w-[12rem] px-3', render: (r) => { const a = r.ambiente?.nombre || r.nombreAmbiente; const t = r.ambiente?.tipo || r.tipoAmbiente; return (<div className="min-w-0"><p title={a} className="font-semibold text-texto line-clamp-2 leading-snug break-words block text-sm">{a}</p>{t && <p title={t} className="text-xs text-texto-suave mt-0.5 truncate leading-snug">{t}</p>}</div>); } },
    { clave: 'fecha', encabezado: 'Fecha y horario', ordenable: true, claseEncabezado: 'w-[1%] whitespace-nowrap px-3', claseCelda: 'w-[1%] whitespace-nowrap px-3', render: (r) => <div className="min-w-0 cifra-tabular"><span className="font-semibold text-texto block text-sm leading-snug">{formatearFecha(r.fecha)}</span><span className="text-xs text-texto-suave mt-0.5 block leading-snug">{formatearRangoHorario(r.horaInicio, r.horaFin)}</span></div> },
    { clave: 'estado', encabezado: 'Estado', claseEncabezado: 'w-[1%] whitespace-nowrap px-3', claseCelda: 'w-[1%] whitespace-nowrap px-3', render: (r) => <Badge estado={r.estado} /> },
    { clave: 'acciones', encabezado: 'Acciones', claseEncabezado: 'w-[1%] whitespace-nowrap text-center pl-3 pr-2', claseCelda: 'w-[1%] whitespace-nowrap text-right pl-3 pr-2', render: (r) => <AccionesReserva reserva={r} enProceso={enProcesoAccion || acciones.enProceso} alSolicitarAprobar={acciones.solicitarAprobar} alSolicitarRechazar={acciones.solicitarRechazar} /> }
  ];

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto w-full">
      <EncabezadoPagina titulo="Reservas" descripcion="Consulte, filtre y gestione las solicitudes de reserva de ambientes universitarios." accionPrimaria={puede(PERMISOS.RESERVAS_CREAR) ? <Button variante="primary" icono="CalendarPlus" onClick={() => ctx.abrirModalReserva?.('')}>Nueva reserva</Button> : null} />
      <FiltrosReservas texto={busquedaTexto} estado={estadoFiltro} fechaDesde={fechaDesde} fechaHasta={fechaHasta} totalResultados={ordenadas.length} alCambiarTexto={setBusquedaTexto} alCambiarFechaDesde={(v) => { setFechaDesde(v); actualizarParametro('desde', v); }} alCambiarFechaHasta={(v) => { setFechaHasta(v); actualizarParametro('hasta', v); }} alLimpiar={() => { setBusquedaTexto(''); setFechaDesde(''); setFechaHasta(''); setParams({ estado: '' }, { replace: true }); }} />
      <PestanasEstado estadoActivo={estadoFiltro} conteos={indicadores} alSeleccionar={(e) => actualizarParametro('estado', e)} />
      <TableList caption="Listado de solicitudes de reserva de ambientes" columnas={columnas} datos={ordenadas} cargando={cargando} esFiltroActivo={Boolean(busquedaTexto.trim() || estadoFiltro || fechaDesde || fechaHasta)} alLimpiarFiltros={() => { setBusquedaTexto(''); setFechaDesde(''); setFechaHasta(''); setParams({ estado: '' }, { replace: true }); }} mensajeVacio="No hay reservas registradas aún" descripcionVacia="Puede registrar una nueva solicitud de reserva con el botón superior." />
      <ModalAccionReserva modal={acciones.modal} motivo={acciones.motivo} alCambiarMotivo={acciones.setMotivo} errorMotivo={acciones.errorMotivo} enProceso={acciones.enProceso} alConfirmar={() => acciones.ejecutarAccion(cambiarEstado, alExito)} alCancelar={acciones.cerrarModal} />
      <Toast toasts={toasts} alCerrar={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
}
