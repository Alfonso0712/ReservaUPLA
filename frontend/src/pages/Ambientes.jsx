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
import Badge from '../components/ui/Badge';
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
  const conExito = (fn) => (m) => { if (typeof window !== 'undefined') { fn(); setMensajeExito(m); } };

  const puedeCrear = puede(PERMISOS.AMBIENTES_CREAR);
  const puedeEditar = puede(PERMISOS.AMBIENTES_EDITAR);
  const puedeCambiarEstado = puede(PERMISOS.AMBIENTES_CAMBIAR_ESTADO);
  const puedeCrearReserva = puede(PERMISOS.RESERVAS_CREAR);

  const filtrados = useMemo(() => {
    const busq = normalizarTexto(texto).toLowerCase();
    return ambientes.filter((amb) => (!tipo || amb.tipo === tipo) && (!busq || `${amb.nombre} ${amb.ubicacion}`.toLowerCase().includes(busq)));
  }, [ambientes, texto, tipo]);
  const todosDisponibles = useMemo(() => filtrados.length > 0 && filtrados.every((a) => a.estado === 'Disponible'), [filtrados]);

  const columnas = [
    { clave: 'nombre', encabezado: 'Nombre', ordenable: true, render: (a) => <span className="font-semibold text-texto">{a.nombre}</span> },
    { clave: 'tipo', encabezado: 'Tipo', claseCelda: 'whitespace-nowrap', render: (a) => <TipoAmbienteChip tipo={a.tipo} /> },
    { clave: 'capacidad', encabezado: 'Capacidad', ordenable: true, claseEncabezado: 'text-right', claseCelda: 'text-right whitespace-nowrap cifra-tabular', render: (a) => <span className="cifra-tabular">{a.capacidad}</span> },
    { clave: 'ubicacion', encabezado: 'Ubicación', render: (a) => <span title={a.ubicacion} className="truncate max-w-[12rem] block">{a.ubicacion}</span> },
    { clave: 'responsable', encabezado: 'Responsable', render: (a) => <span title={a.responsableNombre || 'Sin asignar'} className="truncate max-w-[12rem] block">{a.responsableNombre || 'Sin asignar'}</span> },
    { clave: 'estado', encabezado: 'Estado', render: (a) => <Badge estado={a.estado} discreto={todosDisponibles && a.estado === 'Disponible'} /> },
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
      <FormularioAmbiente abierto={modalCrear} modo="crear" responsables={responsables} alRegistrar={registrarAmbiente} alCerrar={() => setModalCrear(false)} alExito={conExito(() => setModalCrear(false))} />
      <FormularioAmbiente abierto={Boolean(aEditar)} modo="editar" ambienteAEditar={aEditar} responsables={responsables} alEditar={editarAmbiente} alCerrar={() => setAEditar(null)} alExito={conExito(() => setAEditar(null))} />
      <ModalCambiarEstadoAmbiente abierto={Boolean(aCambiarEstado)} ambiente={aCambiarEstado} alCambiarEstado={cambiarEstadoAmbiente} alCerrar={() => setACambiarEstado(null)} alExito={conExito(() => setACambiarEstado(null))} />
    </div>
  );
}