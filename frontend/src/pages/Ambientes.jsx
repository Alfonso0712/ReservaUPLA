// RF-02 · Catálogo de ambientes, acciones y permisos RBAC · E-10..11 · E-32 · E-39..44
import { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { usePermisos } from '../hooks/usePermisos';
import { useAmbientes } from '../hooks/useAmbientes';
import { useDebounce } from '../hooks/useDebounce';
import { useTamanoFuente } from '../hooks/useTamanoFuente';
import { PERMISOS } from '../constants/permisos';
import { normalizarTexto } from '../utils/normalizarTexto';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import FiltrosAmbientes from '../components/ambientes/FiltrosAmbientes';
import FormularioAmbiente from '../components/ambientes/FormularioAmbiente';
import ModalCambiarEstadoAmbiente from '../components/ambientes/ModalCambiarEstadoAmbiente';
import AccionesFilaAmbiente from '../components/ambientes/AccionesFilaAmbiente';
import Badge from '../components/ui/Badge';
import TableList from '../components/ui/TableList';
import TipoAmbienteChip from '../components/ui/TipoAmbienteChip';
import Toast from '../components/ui/Toast';
import Button from '../components/ui/Button';

export default function Ambientes() {
  const { puede } = usePermisos(); const outletCtx = useOutletContext();
  const mensajeGlobal = outletCtx?.mensajeGlobal; const limpiarMensajeGlobal = outletCtx?.limpiarMensajeGlobal; const abrirModalReserva = outletCtx?.abrirModalReserva;
  const { ambientes, responsables, cargando, error, registrarAmbiente, editarAmbiente, cambiarEstadoAmbiente } = useAmbientes();
  const { tamanoFuente } = useTamanoFuente(); const esExtra = tamanoFuente === '125%';
  const [textoFiltro, setTextoFiltro] = useState(''); const textoDebounce = useDebounce(textoFiltro);
  const [tipoFiltro, setTipoFiltro] = useState(''); const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [ambienteParaEditar, setAmbienteParaEditar] = useState(null); const [ambienteParaCambiarEstado, setAmbienteParaCambiarEstado] = useState(null);
  const [toasts, setToasts] = useState([]);
  const notificarExito = (callback) => (mensaje) => { if (typeof window !== 'undefined') { callback(); setToasts((prev) => [...prev.slice(-2), { id: Date.now(), tipo: 'exito', mensaje }]); } };

  useEffect(() => {
    if (mensajeGlobal) { setToasts((prev) => [...prev.slice(-2), { id: Date.now(), tipo: 'exito', mensaje: mensajeGlobal }]); limpiarMensajeGlobal?.(); }
  }, [mensajeGlobal, limpiarMensajeGlobal]);

  useEffect(() => {
    if (error) setToasts((prev) => [...prev.slice(-2), { id: Date.now(), tipo: 'error', mensaje: error }]);
  }, [error]);

  const puedeCrear = puede(PERMISOS.AMBIENTES_CREAR); const puedeEditar = puede(PERMISOS.AMBIENTES_EDITAR);
  const puedeCambiarEstado = puede(PERMISOS.AMBIENTES_CAMBIAR_ESTADO); const puedeCrearReserva = puede(PERMISOS.RESERVAS_CREAR);

  const manejarCambioEstado = async (amb) => {
    if ((amb.reservasFuturasActivas || 0) > 0) { setAmbienteParaCambiarEstado(amb); return; }
    const nuevo = amb.estado === 'Disponible' ? 'Mantenimiento' : 'Disponible';
    const res = await cambiarEstadoAmbiente(amb.id, nuevo);
    if (res.ok) setToasts((prev) => [...prev.slice(-2), { id: Date.now(), tipo: 'exito', mensaje: `Estado de ${amb.nombre} actualizado a ${nuevo}.`, alDeshacer: () => cambiarEstadoAmbiente(amb.id, amb.estado) }]);
  };

  const filtrados = useMemo(() => {
    const busqueda = normalizarTexto(textoDebounce).toLowerCase();
    return ambientes.filter((amb) => (!tipoFiltro || amb.tipo === tipoFiltro) && (!busqueda || `${amb.nombre} ${amb.ubicacion}`.toLowerCase().includes(busqueda)));
  }, [ambientes, textoDebounce, tipoFiltro]);

  const columnas = [
    { clave: 'nombre', encabezado: 'Nombre', ordenable: true, claseEncabezado: 'min-w-[12rem] px-3', claseCelda: 'min-w-[12rem] px-3', render: (a) => <span className="font-semibold text-texto line-clamp-2 leading-snug break-words block" title={a.nombre}>{a.nombre}</span> },
    { clave: 'tipo', encabezado: 'Tipo', claseEncabezado: `w-[1%] whitespace-nowrap px-3 ${esExtra ? 'hidden xl:table-cell' : 'hidden lg:table-cell'}`, claseCelda: `w-[1%] whitespace-nowrap px-3 ${esExtra ? 'hidden xl:table-cell' : 'hidden lg:table-cell'}`, render: (a) => <TipoAmbienteChip tipo={a.tipo} /> },
    { clave: 'capacidad', encabezado: 'Capacidad', ordenable: true, claseEncabezado: 'w-[1%] whitespace-nowrap text-right pr-4 pl-2', claseCelda: 'w-[1%] whitespace-nowrap text-right pr-4 pl-2 cifra-tabular', render: (a) => <span className="cifra-tabular">{a.capacidad}</span> },
    { clave: 'ubicacion', encabezado: 'Ubicación', claseEncabezado: 'min-w-[10rem] px-3', claseCelda: 'px-3 min-w-[10rem]', render: (a) => <span title={a.ubicacion} className="line-clamp-2 leading-snug break-words block">{a.ubicacion}</span> },
    { clave: 'responsable', encabezado: 'Responsable', claseEncabezado: `min-w-[10rem] px-3 ${esExtra ? 'hidden' : 'hidden xl:table-cell'}`, claseCelda: `px-3 min-w-[10rem] ${esExtra ? 'hidden' : 'hidden xl:table-cell'}`, render: (a) => <span title={a.nombreResponsable || a.responsableNombre || 'Sin asignar'} className="line-clamp-2 leading-snug break-words block">{a.nombreResponsable || a.responsableNombre || 'Sin asignar'}</span> },
    { clave: 'estado', encabezado: 'Estado', claseEncabezado: 'w-[1%] whitespace-nowrap px-3', claseCelda: 'w-[1%] whitespace-nowrap px-3', render: (a) => <Badge estado={a.estado} /> },
    { clave: 'acciones', encabezado: 'Acciones', claseEncabezado: 'w-[1%] whitespace-nowrap text-right pl-3 pr-2', claseCelda: 'w-[1%] whitespace-nowrap text-right pl-3 pr-2', render: (a) => <AccionesFilaAmbiente ambiente={a} puedeEditar={puedeEditar} puedeCambiarEstado={puedeCambiarEstado} puedeCrearReserva={puedeCrearReserva} alEditar={setAmbienteParaEditar} alCambiarEstado={manejarCambioEstado} alReservar={(id) => abrirModalReserva?.(id)} /> }
  ];

  return (
    <div className="space-y-5">
      <EncabezadoPagina titulo="Ambientes" descripcion="Catálogo de laboratorios, auditorios y salas académicas." accionPrimaria={puedeCrear ? <Button variante="primario" icono="Plus" onClick={() => setModalCrearAbierto(true)}>Nuevo ambiente</Button> : null} />
      <FiltrosAmbientes texto={textoFiltro} tipo={tipoFiltro} totalResultados={filtrados.length} alCambiarTexto={setTextoFiltro} alCambiarTipo={setTipoFiltro} alLimpiar={() => { setTextoFiltro(''); setTipoFiltro(''); }} />
      <TableList caption="Catálogo de ambientes universitarios" columnas={columnas} datos={filtrados} cargando={cargando} esFiltroActivo={Boolean(textoFiltro.trim() || tipoFiltro)} alLimpiarFiltros={() => { setTextoFiltro(''); setTipoFiltro(''); }} mensajeVacio="No hay ambientes registrados aún" descripcionVacia="Puede registrar un nuevo ambiente con el botón superior." accionVacia={puedeCrear ? <Button variante="primario" icono="Plus" onClick={() => setModalCrearAbierto(true)}>Nuevo ambiente</Button> : null} />
      <FormularioAmbiente abierto={modalCrearAbierto} modo="crear" responsables={responsables} alRegistrar={registrarAmbiente} alCerrar={() => setModalCrearAbierto(false)} alExito={notificarExito(() => setModalCrearAbierto(false))} />
      <FormularioAmbiente abierto={Boolean(ambienteParaEditar)} modo="editar" ambienteAEditar={ambienteParaEditar} responsables={responsables} alEditar={editarAmbiente} alCerrar={() => setAmbienteParaEditar(null)} alExito={notificarExito(() => setAmbienteParaEditar(null))} />
      <ModalCambiarEstadoAmbiente abierto={Boolean(ambienteParaCambiarEstado)} ambiente={ambienteParaCambiarEstado} alCambiarEstado={cambiarEstadoAmbiente} alCerrar={() => setAmbienteParaCambiarEstado(null)} alExito={notificarExito(() => setAmbienteParaCambiarEstado(null))} />
      <Toast toasts={toasts} alCerrar={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
