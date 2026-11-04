// RF-05 · RF-07 · Listado de reservas con filtros en URL, tabla responsiva y confirmación modal · E-18..20 · E-27 · E-28
import { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useReservas } from '../hooks/useReservas';
import { useDebounce } from '../hooks/useDebounce';
import { ROLES } from '../constants/roles';
import { ESTADOS_RESERVA } from '../constants/estados';
import { MENSAJES } from '../constants/mensajes';
import { RUTAS } from '../constants/rutas';
import { formatearFecha } from '../utils/formatearFecha';
import { formatearRangoHorario } from '../utils/formatearHora';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import FiltrosReservas from '../components/reservas/FiltrosReservas';
import AccionesReserva from '../components/reservas/AccionesReserva';
import TableList from '../components/ui/TableList';
import EstadoBadge from '../components/ui/EstadoBadge';
import TipoAmbienteChip from '../components/ui/TipoAmbienteChip';
import ModalConfirmacion from '../components/ui/ModalConfirmacion';
import AlertMessage from '../components/ui/AlertMessage';
import Cargando from '../components/ui/Cargando';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';

export default function ListadoReservas() {
  const { usuario } = useAuth();
  const ctx = useOutletContext() || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const [textoInput, setTextoInput] = useState(() => searchParams.get('texto') || '');
  const textoDebounced = useDebounce(textoInput);
  const estadoFiltro = searchParams.get('estado') || '';
  const tipoFiltro = searchParams.get('tipo') || '';
  const [confirmacion, setConfirmacion] = useState(null);
  const [alertaAccion, setAlertaAccion] = useState(null);
  const { reservas, cargando, error, enProcesoAccion, cambiarEstado } = useReservas({
    estado: estadoFiltro, tipo: tipoFiltro, texto: textoDebounced, versionExterna: ctx.versionDatos || 0
  });
  useEffect(() => {
    const prox = new URLSearchParams(searchParams);
    if (textoDebounced.trim()) prox.set('texto', textoDebounced.trim()); else prox.delete('texto');
    if (prox.toString() !== searchParams.toString()) setSearchParams(prox, { replace: true });
  }, [textoDebounced, searchParams, setSearchParams]);
  const actualizarParametro = (clave, valor) => {
    const prox = new URLSearchParams(searchParams);
    if (valor) prox.set(clave, valor); else prox.delete(clave);
    setSearchParams(prox, { replace: true });
  };
  const ejecutarCambioEstado = async () => {
    if (!confirmacion) return;
    const { reserva, nuevoEstado } = confirmacion;
    const res = await cambiarEstado(reserva.id, nuevoEstado);
    setConfirmacion(null);
    if (res.ok) setAlertaAccion({ tipo: 'exito', texto: nuevoEstado === ESTADOS_RESERVA.APROBADA ? MENSAJES.RESERVA_APROBADA_EXITO : MENSAJES.RESERVA_RECHAZADA_EXITO });
    else if (res.errorGeneral) setAlertaAccion({ tipo: 'error', texto: res.errorGeneral });
  };
  const columnas = [
    { clave: 'solicitante', encabezado: 'Solicitante', render: (r) => <div><p className="font-semibold text-texto">{r.solicitante?.nombreCompleto}</p><p className="text-sm text-texto-suave">{r.solicitante?.correo}</p></div> },
    { clave: 'ambiente', encabezado: 'Ambiente', render: (r) => <div className="space-y-1"><p className="font-semibold text-texto">{r.ambiente?.nombre}</p><TipoAmbienteChip tipo={r.ambiente?.tipo} /></div> },
    { clave: 'fecha', encabezado: 'Fecha', claseCelda: 'whitespace-nowrap cifra-tabular', render: (r) => formatearFecha(r.fecha) },
    { clave: 'horario', encabezado: 'Horario', claseCelda: 'whitespace-nowrap cifra-tabular', render: (r) => formatearRangoHorario(r.horaInicio, r.horaFin) },
    { clave: 'estado', encabezado: 'Estado', render: (r) => <EstadoBadge estado={r.estado} /> },
    { clave: 'acciones', encabezado: 'Acciones', render: (r) => <AccionesReserva reserva={r} rolUsuario={usuario?.rol} enProceso={enProcesoAccion} alSolicitarAprobar={(item) => setConfirmacion({ reserva: item, nuevoEstado: ESTADOS_RESERVA.APROBADA })} alSolicitarRechazar={(item) => setConfirmacion({ reserva: item, nuevoEstado: ESTADOS_RESERVA.RECHAZADA })} /> }
  ];
  const puedeReservar = usuario?.rol === ROLES.ADMINISTRADOR || usuario?.rol === ROLES.SOLICITANTE;
  const esAprobar = confirmacion?.nuevoEstado === ESTADOS_RESERVA.APROBADA;
  return (
    <div className="space-y-5">
      <EncabezadoPagina migas={[{ etiqueta: 'Inicio', ruta: RUTAS.PANEL }, { etiqueta: 'Reservas' }]} titulo="Reservas" descripcion="Consulte, filtre y gestione las solicitudes de reserva de ambientes universitarios." accionPrimaria={puedeReservar ? <Button variante="primario" onClick={() => ctx.abrirModalReserva?.('')}><Icono nombre="CalendarPlus" className="w-5 h-5" /><span>Nueva reserva</span></Button> : null} />
      {ctx.mensajeGlobal && <AlertMessage variante="exito" rol="status" mensaje={ctx.mensajeGlobal} enfocarAlAparecer alCerrar={ctx.limpiarMensajeGlobal} />}
      {alertaAccion && <AlertMessage variante={alertaAccion.tipo} rol={alertaAccion.tipo === 'error' ? 'alert' : 'status'} mensaje={alertaAccion.texto} enfocarAlAparecer alCerrar={() => setAlertaAccion(null)} />}
      {error && <AlertMessage variante="error" rol="alert" mensaje={error} enfocarAlAparecer />}
      <FiltrosReservas texto={textoInput} estado={estadoFiltro} tipo={tipoFiltro} totalResultados={reservas.length} alCambiarTexto={setTextoInput} alCambiarEstado={(v) => actualizarParametro('estado', v)} alCambiarTipo={(v) => actualizarParametro('tipo', v)} alLimpiar={() => { setTextoInput(''); setSearchParams({}, { replace: true }); }} />
      {cargando ? <Cargando /> : <TableList caption="Listado de solicitudes de reserva de ambientes" columnas={columnas} datos={reservas} mensajeVacio="No se encontraron reservas con los criterios seleccionados" descripcionVacia="Puede limpiar los filtros activos o registrar una nueva solicitud." />}
      <ModalConfirmacion abierto={Boolean(confirmacion)} titulo={esAprobar ? 'Confirmar aprobación de reserva' : 'Confirmar rechazo de reserva'} descripcion={esAprobar ? '¿Desea aprobar esta solicitud de reserva para el horario indicado?' : '¿Desea rechazar esta solicitud de reserva?'} reserva={confirmacion?.reserva} esIrreversible={!esAprobar} etiquetaConfirmar={esAprobar ? 'Aprobar reserva' : 'Rechazar reserva'} varianteConfirmar={esAprobar ? 'primario' : 'peligro'} enProceso={enProcesoAccion} alConfirmar={ejecutarCambioEstado} alCancelar={() => setConfirmacion(null)} />
    </div>
  );
}
