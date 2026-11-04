// RF-05 · RF-07 · Listado de reservas con jerarquía, anchos definidos y filtros compactos
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useOutletContext, useLocation, Link } from 'react-router-dom';
import { usePermisos } from '../hooks/usePermisos';
import { useReservas } from '../hooks/useReservas';
import { useDashboard } from '../hooks/useDashboard';
import { useDebounce } from '../hooks/useDebounce';
import { PERMISOS } from '../constants/permisos';
import { RUTAS } from '../constants/rutas';
import { ESTADOS_RESERVA } from '../constants/estados';
import { MENSAJES } from '../constants/mensajes';
import { formatearFecha, obtenerTextoRelativoFecha } from '../utils/formatearFecha';
import { formatearRangoHorario } from '../utils/formatearHora';
import { obtenerIniciales } from '../utils/obtenerIniciales';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import FiltrosReservas from '../components/reservas/FiltrosReservas';
import PestanasEstado from '../components/reservas/PestanasEstado';
import AccionesReserva from '../components/reservas/AccionesReserva';
import TableList from '../components/ui/TableList';
import Badge from '../components/ui/Badge';
import ModalConfirmacion from '../components/ui/ModalConfirmacion';
import Toast from '../components/ui/Toast';
import Button from '../components/ui/Button';

export default function ListadoReservas() {
  const { puede } = usePermisos(); const ctx = useOutletContext() || {};
  const [params, setParams] = useSearchParams(); const loc = useLocation();
  const [txtIn, setTxtIn] = useState(() => params.get('texto') || '');
  const debTxt = useDebounce(txtIn);
  const estadoFiltro = params.get('estado') || '';
  const [fDesde, setFDesde] = useState(() => params.get('desde') || '');
  const [fHasta, setFHasta] = useState(() => params.get('hasta') || '');
  const [conf, setConf] = useState(null); const [toasts, setToasts] = useState([]);
  const [motivo, setMotivo] = useState(''); const [errMot, setErrMot] = useState('');
  const { reservas, cargando, enProcesoAccion, cambiarEstado } = useReservas({ estado: estadoFiltro, texto: debTxt, versionExterna: ctx.versionDatos || 0 });
  const { indicadores } = useDashboard(ctx.versionDatos || 0);

  useEffect(() => {
    if (loc.state?.toastExito) { setToasts((p) => [...p.slice(-2), { id: Date.now(), tipo: 'exito', mensaje: loc.state.toastExito }]); window.history.replaceState({}, document.title); }
  }, [loc.state]);

  const actParam = (k, v) => { const p = new URLSearchParams(params); if (v) p.set(k, v); else p.delete(k); setParams(p, { replace: true }); };
  const ejecutarAccion = async () => {
    if (!conf) return;
    if (conf.nuevoEstado === ESTADOS_RESERVA.RECHAZADA && !motivo.trim()) { setErrMot('Debe indicar un motivo.'); return; }
    const res = await cambiarEstado(conf.reserva.id, conf.nuevoEstado, motivo);
    setConf(null); setMotivo(''); setErrMot('');
    if (res.ok) {
      if (conf.nuevoEstado === ESTADOS_RESERVA.APROBADA) {
        const idR = conf.reserva.id;
        setToasts((p) => [...p.slice(-2), { id: Date.now(), tipo: 'exito', mensaje: MENSAJES.RESERVA_APROBADA_EXITO, alDeshacer: () => cambiarEstado(idR, ESTADOS_RESERVA.PENDIENTE) }]);
      } else setToasts((p) => [...p.slice(-2), { id: Date.now(), tipo: 'exito', mensaje: MENSAJES.RESERVA_RECHAZADA_EXITO }]);
    } else if (res.errorGeneral) setToasts((p) => [...p.slice(-2), { id: Date.now(), tipo: 'error', mensaje: res.errorGeneral }]);
  };
  const ordenadas = useMemo(() => [...reservas].filter((r) => (!fDesde || r.fecha >= fDesde) && (!fHasta || r.fecha <= fHasta)).sort((a, b) => {
    const pA = a.estado === ESTADOS_RESERVA.PENDIENTE ? 0 : 1; const pB = b.estado === ESTADOS_RESERVA.PENDIENTE ? 0 : 1;
    if (pA !== pB) return pA - pB;
    return `${a.fecha || ''} ${a.horaInicio || ''}`.localeCompare(`${b.fecha || ''} ${b.horaInicio || ''}`);
  }), [reservas, fDesde, fHasta]);
  const columnas = [
    { clave: 'solicitante', encabezado: 'Solicitante', ordenable: true, claseEncabezado: 'w-[24%]', render: (r) => <div className="flex items-center gap-2.5 min-w-0"><span className="w-8 h-8 rounded-full bg-primario-suave text-primario dark:text-primario-enlace font-bold text-xs flex items-center justify-center shrink-0">{obtenerIniciales(r.solicitante?.nombreCompleto) || 'U'}</span><div className="min-w-0"><Link to={RUTAS.crearDetalleReserva(r.id)} className="font-semibold text-texto hover:text-primario-enlace hover:underline truncate block">{r.solicitante?.nombreCompleto}</Link><p className="text-xs text-texto-suave truncate">{r.solicitante?.correo}</p></div></div> },
    { clave: 'ambiente', encabezado: 'Ambiente', claseEncabezado: 'w-[28%]', render: (r) => <div className="min-w-0"><p className="font-semibold text-texto truncate">{r.ambiente?.nombre}</p>{r.ambiente?.tipo && <p className="text-xs text-texto-suave mt-0.5 truncate">{r.ambiente.tipo}</p>}{r.motivo && <p className="text-xs text-texto-suave/80 italic mt-0.5 truncate max-w-xs">{r.motivo}</p>}</div> },
    { clave: 'fecha', encabezado: 'Fecha y horario', ordenable: true, claseEncabezado: 'w-[18%]', claseCelda: 'whitespace-nowrap', render: (r) => <div><span className="font-semibold text-texto cifra-tabular block">{formatearFecha(r.fecha)}</span><span className="text-xs text-texto-suave cifra-tabular block mt-0.5">{formatearRangoHorario(r.horaInicio, r.horaFin)}</span>{obtenerTextoRelativoFecha(r.fecha) && <span className="text-[0.75rem] text-texto-suave/80 block mt-0.5">{obtenerTextoRelativoFecha(r.fecha)}</span>}</div> },
    { clave: 'estado', encabezado: 'Estado', claseEncabezado: 'w-[14%]', render: (r) => <Badge estado={r.estado} /> },
    { clave: 'acciones', encabezado: 'Acciones', claseEncabezado: 'w-[16%] text-right', claseCelda: 'text-right whitespace-nowrap', render: (r) => <AccionesReserva reserva={r} enProceso={enProcesoAccion} alSolicitarAprobar={(i) => setConf({ reserva: i, nuevoEstado: ESTADOS_RESERVA.APROBADA })} alSolicitarRechazar={(i) => setConf({ reserva: i, nuevoEstado: ESTADOS_RESERVA.RECHAZADA })} /> }
  ];
  const esApr = conf?.nuevoEstado === ESTADOS_RESERVA.APROBADA;
  return (
    <div className="space-y-4 max-w-[1440px] mx-auto w-full">
      <EncabezadoPagina titulo="Reservas" descripcion="Consulte, filtre y gestione las solicitudes de reserva de ambientes universitarios." accionPrimaria={puede(PERMISOS.RESERVAS_CREAR) ? <Button variante="primary" icono="CalendarPlus" onClick={() => ctx.abrirModalReserva?.('')}>Nueva reserva</Button> : null} />
      <FiltrosReservas texto={txtIn} estado={estadoFiltro} fechaDesde={fDesde} fechaHasta={fHasta} totalResultados={ordenadas.length} alCambiarTexto={setTxtIn} alCambiarFechaDesde={(v) => { setFDesde(v); actParam('desde', v); }} alCambiarFechaHasta={(v) => { setFHasta(v); actParam('hasta', v); }} alLimpiar={() => { setTxtIn(''); setFDesde(''); setFHasta(''); setParams({}, { replace: true }); }} />
      <PestanasEstado estadoActivo={estadoFiltro} conteos={indicadores} alSeleccionar={(e) => actParam('estado', e)} />
      <TableList caption="Listado de solicitudes de reserva de ambientes" columnas={columnas} datos={ordenadas} cargando={cargando} esFiltroActivo={Boolean(txtIn.trim() || estadoFiltro || fDesde || fHasta)} alLimpiarFiltros={() => { setTxtIn(''); setFDesde(''); setFHasta(''); setParams({}, { replace: true }); }} mensajeVacio="No hay reservas registradas aún" descripcionVacia="Puede registrar una nueva solicitud de reserva con el botón superior." obtenerClaseFila={(r) => r.estado === ESTADOS_RESERVA.PENDIENTE ? 'border-l-4 border-l-[var(--btn-warning-fg)] bg-[var(--btn-warning-bg)]/40' : ''} />
      <ModalConfirmacion abierto={Boolean(conf)} titulo={esApr ? 'Confirmar aprobación' : 'Confirmar rechazo'} descripcion={esApr ? '¿Desea aprobar esta solicitud de reserva?' : 'Indique el motivo del rechazo:'} reserva={conf?.reserva} esIrreversible={!esApr} requiereMotivo={conf?.nuevoEstado === ESTADOS_RESERVA.RECHAZADA} motivo={motivo} alCambiarMotivo={(v) => { setMotivo(v); if (errMot) setErrMot(''); }} errorMotivo={errMot} etiquetaConfirmar={esApr ? 'Aprobar reserva' : 'Rechazar reserva'} varianteConfirmar={esApr ? 'primary' : 'danger'} enProceso={enProcesoAccion} alConfirmar={ejecutarAccion} alCancelar={() => { setConf(null); setMotivo(''); setErrMot(''); }} />
      <Toast toasts={toasts} alCerrar={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
}
