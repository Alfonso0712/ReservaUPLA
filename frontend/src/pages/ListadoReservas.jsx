// RF-05 · RF-07 · Listado de reservas con filtros, tabla, menú y confirmación · E-18..20
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useOutletContext, Link } from 'react-router-dom';
import { usePermisos } from '../hooks/usePermisos';
import { useReservas } from '../hooks/useReservas';
import { useDashboard } from '../hooks/useDashboard';
import { useDebounce } from '../hooks/useDebounce';
import { PERMISOS } from '../constants/permisos';
import { RUTAS } from '../constants/rutas';
import { ESTADOS_RESERVA } from '../constants/estados';
import { MENSAJES } from '../constants/mensajes';
import { formatearFecha } from '../utils/formatearFecha';
import { formatearRangoHorario } from '../utils/formatearHora';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import FiltrosReservas from '../components/reservas/FiltrosReservas';
import PestanasEstado from '../components/reservas/PestanasEstado';
import AccionesReserva from '../components/reservas/AccionesReserva';
import TableList from '../components/ui/TableList';
import Badge from '../components/ui/Badge';
import ModalConfirmacion from '../components/ui/ModalConfirmacion';
import Toast from '../components/ui/Toast';
import Cargando from '../components/ui/Cargando';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';

export default function ListadoReservas() {
  const { puede } = usePermisos();
  const ctx = useOutletContext() || {};
  const [params, setParams] = useSearchParams();
  const [txtIn, setTxtIn] = useState(() => params.get('texto') || '');
  const debTxt = useDebounce(txtIn);
  const estadoFiltro = params.get('estado') || ''; const tipoFiltro = params.get('tipo') || '';
  const [conf, setConf] = useState(null); const [toasts, setToasts] = useState([]);
  const [motivo, setMotivo] = useState(''); const [errMot, setErrMot] = useState('');
  const { reservas, cargando, enProcesoAccion, cambiarEstado } = useReservas({ estado: estadoFiltro, tipo: tipoFiltro, texto: debTxt, versionExterna: ctx.versionDatos || 0 });
  const { indicadores } = useDashboard(ctx.versionDatos || 0);

  useEffect(() => {
    const p = new URLSearchParams(params);
    if (debTxt.trim()) p.set('texto', debTxt.trim()); else p.delete('texto');
    if (p.toString() !== params.toString()) setParams(p, { replace: true });
  }, [debTxt, params, setParams]);

  const actParam = (k, v) => { const p = new URLSearchParams(params); if (v) p.set(k, v); else p.delete(k); setParams(p, { replace: true }); };
  const ejecutarAccion = async () => {
    if (!conf) return;
    if (conf.nuevoEstado === ESTADOS_RESERVA.RECHAZADA && !motivo.trim()) { setErrMot('Debe indicar un motivo.'); return; }
    const res = await cambiarEstado(conf.reserva.id, conf.nuevoEstado, motivo);
    setConf(null); setMotivo(''); setErrMot('');
    if (res.ok) {
      const msg = conf.nuevoEstado === ESTADOS_RESERVA.APROBADA ? MENSAJES.RESERVA_APROBADA_EXITO : (conf.nuevoEstado === ESTADOS_RESERVA.CANCELADA ? MENSAJES.RESERVA_CANCELADA_EXITO : MENSAJES.RESERVA_RECHAZADA_EXITO);
      setToasts((prev) => [...prev.slice(-2), { id: Date.now(), tipo: 'exito', mensaje: msg }]);
    } else if (res.errorGeneral) setToasts((prev) => [...prev.slice(-2), { id: Date.now(), tipo: 'error', mensaje: res.errorGeneral }]);
  };
  const ordenadas = useMemo(() => [...reservas].sort((a, b) => {
    const pA = a.estado === ESTADOS_RESERVA.PENDIENTE ? 0 : 1; const pB = b.estado === ESTADOS_RESERVA.PENDIENTE ? 0 : 1;
    if (pA !== pB) return pA - pB;
    return `${a.fecha || ''} ${a.horaInicio || ''}`.localeCompare(`${b.fecha || ''} ${b.horaInicio || ''}`);
  }), [reservas]);
  const columnas = [
    { clave: 'solicitante', encabezado: 'Solicitante', ordenable: true, render: (r) => <div><Link to={RUTAS.crearDetalleReserva(r.id)} className="font-semibold text-texto hover:text-primario-enlace hover:underline">{r.solicitante?.nombreCompleto}</Link><p className="text-sm text-texto-suave">{r.solicitante?.correo}</p></div> },
    { clave: 'ambiente', encabezado: 'Ambiente', render: (r) => <div><p className="font-semibold text-texto">{r.ambiente?.nombre}</p>{r.ambiente?.tipo && <p className="text-xs text-texto-suave mt-0.5">{r.ambiente.tipo}</p>}</div> },
    { clave: 'fecha', encabezado: 'Fecha y horario', ordenable: true, claseCelda: 'whitespace-nowrap', render: (r) => <div><span className="font-semibold text-texto cifra-tabular block">{formatearFecha(r.fecha)}</span><span className="text-xs text-texto-suave cifra-tabular block mt-0.5">{formatearRangoHorario(r.horaInicio, r.horaFin)}</span></div> },
    { clave: 'estado', encabezado: 'Estado', render: (r) => <Badge estado={r.estado} /> },
    { clave: 'acciones', encabezado: 'Acciones', render: (r) => <AccionesReserva reserva={r} enProceso={enProcesoAccion} alSolicitarAprobar={(item) => setConf({ reserva: item, nuevoEstado: ESTADOS_RESERVA.APROBADA })} alSolicitarRechazar={(item) => setConf({ reserva: item, nuevoEstado: ESTADOS_RESERVA.RECHAZADA })} alSolicitarCancelar={(item) => setConf({ reserva: item, nuevoEstado: ESTADOS_RESERVA.CANCELADA })} /> }
  ];
  const esApr = conf?.nuevoEstado === ESTADOS_RESERVA.APROBADA; const esCanc = conf?.nuevoEstado === ESTADOS_RESERVA.CANCELADA;
  return (
    <div className="space-y-4">
      <EncabezadoPagina titulo="Reservas" descripcion="Consulte, filtre y gestione las solicitudes de reserva de ambientes universitarios." accionPrimaria={puede(PERMISOS.RESERVAS_CREAR) ? <Button variante="primario" onClick={() => ctx.abrirModalReserva?.('')}><Icono nombre="CalendarPlus" className="w-5 h-5" /><span>Nueva reserva</span></Button> : null} />
      <FiltrosReservas texto={txtIn} estado={estadoFiltro} tipo={tipoFiltro} totalResultados={reservas.length} alCambiarTexto={setTxtIn} alCambiarEstado={(v) => actParam('estado', v)} alCambiarTipo={(v) => actParam('tipo', v)} alLimpiar={() => { setTxtIn(''); setParams({}, { replace: true }); }} />
      <PestanasEstado estadoActivo={estadoFiltro} conteos={indicadores} alSeleccionar={(e) => actParam('estado', e)} />
      {cargando ? <Cargando /> : <TableList caption="Listado de solicitudes de reserva de ambientes" columnas={columnas} datos={ordenadas} mensajeVacio="No se encontraron reservas con los criterios seleccionados" descripcionVacia="Puede limpiar los filtros activos o registrar una nueva solicitud." />}
      <ModalConfirmacion abierto={Boolean(conf)} titulo={esApr ? 'Confirmar aprobación' : (esCanc ? 'Confirmar cancelación' : 'Confirmar rechazo')} descripcion={esApr ? '¿Desea aprobar esta solicitud de reserva?' : (esCanc ? '¿Desea cancelar esta solicitud de reserva?' : 'Indique el motivo del rechazo:')} reserva={conf?.reserva} esIrreversible={!esApr} requiereMotivo={conf?.nuevoEstado === ESTADOS_RESERVA.RECHAZADA} motivo={motivo} alCambiarMotivo={(v) => { setMotivo(v); if (errMot) setErrMot(''); }} errorMotivo={errMot} etiquetaConfirmar={esApr ? 'Aprobar reserva' : (esCanc ? 'Cancelar reserva' : 'Rechazar reserva')} varianteConfirmar={esApr ? 'primary' : 'danger-outline'} enProceso={enProcesoAccion} alConfirmar={ejecutarAccion} alCancelar={() => { setConf(null); setMotivo(''); setErrMot(''); }} />
      <Toast toasts={toasts} alCerrar={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
