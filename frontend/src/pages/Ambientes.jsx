// RF-02 · Catálogo de ambientes, acciones y permisos RBAC · E-10..11 · E-32 · E-39..44
import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { usePermisos } from '../hooks/usePermisos';
import { useAmbientes } from '../hooks/useAmbientes';
import { PERMISOS } from '../constants/permisos';
import { normalizarTexto } from '../utils/normalizarTexto';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import FiltrosAmbientes from '../components/ambientes/FiltrosAmbientes';
import FormularioAmbiente from '../components/ambientes/FormularioAmbiente';
import ModalCambiarEstadoAmbiente from '../components/ambientes/ModalCambiarEstadoAmbiente';
import AccionesFilaAmbiente from '../components/ambientes/AccionesFilaAmbiente';
import EstadoAmbienteBadge from '../components/ui/EstadoAmbienteBadge';
import TableList from '../components/ui/TableList';
import TipoAmbienteChip from '../components/ui/TipoAmbienteChip';
import AlertMessage from '../components/ui/AlertMessage';
import Cargando from '../components/ui/Cargando';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';

export default function Ambientes() {
  const { puede } = usePermisos();
  const ctx = useOutletContext() || {};
  const { ambientes, responsables, cargando, error, registrarAmbiente, editarAmbiente, cambiarEstadoAmbiente } = useAmbientes();
  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState('');
  const [modalCrear, setModalCrear] = useState(false);
  const [aEditar, setAEditar] = useState(null);
  const [aCambiarEstado, setACambiarEstado] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');

  const puedeCrear = puede(PERMISOS.AMBIENTES_CREAR);
  const puedeEditar = puede(PERMISOS.AMBIENTES_EDITAR);
  const puedeCambiarEstado = puede(PERMISOS.AMBIENTES_CAMBIAR_ESTADO);
  const puedeCrearReserva = puede(PERMISOS.RESERVAS_CREAR);

  const filtrados = useMemo(() => {
    const busq = normalizarTexto(texto).toLowerCase();
    return ambientes.filter((amb) => (!tipo || amb.tipo === tipo) && (!busq || `${amb.nombre} ${amb.ubicacion}`.toLowerCase().includes(busq)));
  }, [ambientes, texto, tipo]);

  const columnas = [
    { clave: 'nombre', encabezado: 'Nombre', render: (a) => <span className="font-semibold text-texto">{a.nombre}</span> },
    { clave: 'tipo', encabezado: 'Tipo', render: (a) => <TipoAmbienteChip tipo={a.tipo} /> },
    { clave: 'capacidad', encabezado: 'Capacidad', claseCelda: 'whitespace-nowrap cifra-tabular', render: (a) => `${a.capacidad} personas` },
    { clave: 'ubicacion', encabezado: 'Ubicación', render: (a) => a.ubicacion },
    { clave: 'responsable', encabezado: 'Responsable', render: (a) => a.responsableNombre || 'Sin asignar' },
    { clave: 'estado', encabezado: 'Estado', render: (a) => <EstadoAmbienteBadge estado={a.estado} /> },
    {
      clave: 'acciones', encabezado: 'Acciones', claseCelda: 'whitespace-nowrap',
      render: (a) => (
        <AccionesFilaAmbiente
          ambiente={a} puedeEditar={puedeEditar} puedeCambiarEstado={puedeCambiarEstado} puedeCrearReserva={puedeCrearReserva}
          alEditar={setAEditar} alCambiarEstado={setACambiarEstado} alReservar={(id) => ctx.abrirModalReserva?.(id)}
        />
      )
    }
  ];

  return (
    <div className="space-y-5">
      <EncabezadoPagina
        titulo="Ambientes" descripcion="Catálogo de laboratorios, auditorios y salas académicas."
        accionPrimaria={puedeCrear ? <Button variante="primario" onClick={() => setModalCrear(true)}><Icono nombre="Plus" className="w-5 h-5" /><span>Nuevo ambiente</span></Button> : null}
      />
      {ctx.mensajeGlobal && <AlertMessage variante="exito" rol="status" mensaje={ctx.mensajeGlobal} enfocarAlAparecer alCerrar={ctx.limpiarMensajeGlobal} />}
      {mensajeExito && <AlertMessage variante="exito" rol="status" mensaje={mensajeExito} enfocarAlAparecer alCerrar={() => setMensajeExito('')} />}
      {error && <AlertMessage variante="error" rol="alert" mensaje={error} enfocarAlAparecer />}
      <FiltrosAmbientes texto={texto} tipo={tipo} totalResultados={filtrados.length} alCambiarTexto={setTexto} alCambiarTipo={setTipo} alLimpiar={() => { setTexto(''); setTipo(''); }} />
      {cargando ? <Cargando /> : <TableList caption="Catálogo de ambientes universitarios" columnas={columnas} datos={filtrados} mensajeVacio="No se encontraron ambientes con esos filtros" descripcionVacia="Intente limpiar los criterios de búsqueda aplicados." />}
      <FormularioAmbiente abierto={modalCrear} modo="crear" responsables={responsables} alRegistrar={registrarAmbiente} alCerrar={() => setModalCrear(false)} alExito={(msg) => { setModalCrear(false); setMensajeExito(msg); }} />
      <FormularioAmbiente abierto={Boolean(aEditar)} modo="editar" ambienteAEditar={aEditar} responsables={responsables} alEditar={editarAmbiente} alCerrar={() => setAEditar(null)} alExito={(msg) => { setAEditar(null); setMensajeExito(msg); }} />
      <ModalCambiarEstadoAmbiente abierto={Boolean(aCambiarEstado)} ambiente={aCambiarEstado} alCambiarEstado={cambiarEstadoAmbiente} alCerrar={() => setACambiarEstado(null)} alExito={(msg) => { setACambiarEstado(null); setMensajeExito(msg); }} />
    </div>
  );
}