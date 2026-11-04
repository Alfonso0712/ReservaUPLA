// RF-02 · Catálogo de ambientes y permisos de reserva · E-10 · E-11 · E-32 · E-45
import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { usePermisos } from '../hooks/usePermisos';
import { useAmbientes } from '../hooks/useAmbientes';
import { PERMISOS } from '../constants/permisos';
import { normalizarTexto } from '../utils/normalizarTexto';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import FiltrosAmbientes from '../components/ambientes/FiltrosAmbientes';
import FormularioAmbiente from '../components/ambientes/FormularioAmbiente';
import TableList from '../components/ui/TableList';
import TipoAmbienteChip from '../components/ui/TipoAmbienteChip';
import AlertMessage from '../components/ui/AlertMessage';
import Cargando from '../components/ui/Cargando';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';

export default function Ambientes() {
  const { puede } = usePermisos();
  const ctx = useOutletContext() || {};
  const { ambientes, responsables, cargando, error, registrarAmbiente } = useAmbientes();
  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  const puedeCrearAmbiente = puede(PERMISOS.AMBIENTES_CREAR);
  const puedeCrearReserva = puede(PERMISOS.RESERVAS_CREAR);

  const ambientesFiltrados = useMemo(() => {
    const busq = normalizarTexto(texto).toLowerCase();
    return ambientes.filter((amb) => {
      if (tipo && amb.tipo !== tipo) return false;
      if (!busq) return true;
      return `${amb.nombre} ${amb.ubicacion}`.toLowerCase().includes(busq);
    });
  }, [ambientes, texto, tipo]);

  const columnas = [
    { clave: 'nombre', encabezado: 'Nombre', render: (a) => <span className="font-semibold text-texto">{a.nombre}</span> },
    { clave: 'tipo', encabezado: 'Tipo', render: (a) => <TipoAmbienteChip tipo={a.tipo} /> },
    { clave: 'capacidad', encabezado: 'Capacidad', claseCelda: 'whitespace-nowrap cifra-tabular', render: (a) => <span className="whitespace-nowrap cifra-tabular">{`${a.capacidad} personas`}</span> },
    { clave: 'ubicacion', encabezado: 'Ubicación', render: (a) => a.ubicacion },
    { clave: 'responsable', encabezado: 'Responsable', render: (a) => a.responsableNombre || 'Sin asignar' },
    {
      clave: 'acciones',
      encabezado: 'Acciones',
      render: (a) => {
        if (!puedeCrearReserva) return <span className="text-sm text-texto-suave">Solo consulta</span>;
        if (a.estado !== 'Disponible') return <span className="text-sm text-texto-suave">No disponible</span>;
        return (
          <Button variante="secundario" aria-label={`Reservar ${a.nombre}`} onClick={() => ctx.abrirModalReserva?.(a.id)} className="text-sm px-3">
            Reservar
          </Button>
        );
      }
    }
  ];

  return (
    <div className="space-y-5">
      <EncabezadoPagina
        titulo="Ambientes"
        descripcion="Catálogo de laboratorios, auditorios y salas académicas disponibles para reserva."
        accionPrimaria={puedeCrearAmbiente ? <Button variante="primario" onClick={() => setModalAbierto(true)}><Icono nombre="Plus" className="w-5 h-5" /><span>Nuevo ambiente</span></Button> : null}
      />
      {ctx.mensajeGlobal && <AlertMessage variante="exito" rol="status" mensaje={ctx.mensajeGlobal} enfocarAlAparecer alCerrar={ctx.limpiarMensajeGlobal} />}
      {mensajeExito && <AlertMessage variante="exito" rol="status" mensaje={mensajeExito} enfocarAlAparecer alCerrar={() => setMensajeExito('')} />}
      {error && <AlertMessage variante="error" rol="alert" mensaje={error} enfocarAlAparecer />}
      <FiltrosAmbientes texto={texto} tipo={tipo} totalResultados={ambientesFiltrados.length} alCambiarTexto={setTexto} alCambiarTipo={setTipo} alLimpiar={() => { setTexto(''); setTipo(''); }} />
      {cargando ? <Cargando /> : <TableList caption="Catálogo de ambientes universitarios" columnas={columnas} datos={ambientesFiltrados} mensajeVacio="No se encontraron ambientes con esos filtros" descripcionVacia="Intente limpiar los criterios de búsqueda aplicados." />}
      <FormularioAmbiente abierto={modalAbierto} responsables={responsables} alRegistrar={registrarAmbiente} alCerrar={() => setModalAbierto(false)} alExito={(msg) => { setModalAbierto(false); setMensajeExito(msg); }} />
    </div>
  );
}
