import { useState } from 'react';
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import TableList from '../components/TableList';
import { useAmbientes } from '../hooks/useAmbientes';
import { validarAmbiente } from '../validation/validarAmbiente';

const TIPOS_OPCIONES = [
  { valor: 'LaboratorioComputo', texto: 'Laboratorio de Cómputo' },
  { valor: 'Auditorio', texto: 'Auditorio' },
  { valor: 'SalaReuniones', texto: 'Sala de Reuniones' },
  { valor: 'LaboratorioEspecializado', texto: 'Laboratorio Especializado' }
];

// RF-02 · RV-04 a RV-07 · E-10 · E-11
export default function AmbientesPage({ esAdmin, alSeleccionarParaReservar }) {
  const { ambientes, cargando, error, registrarAmbiente } = useAmbientes();
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [errores, setErrores] = useState({});
  const [errorForm, setErrorForm] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleCrear = async (e) => {
    e.preventDefault();
    const val = validarAmbiente({ nombre, tipo, capacidad, ubicacion });
    if (!val.valido) { setErrores(val.errores); return; }
    setErrores({});
    setGuardando(true);
    const res = await registrarAmbiente({ nombre, tipo, capacidad: Number(capacidad), ubicacion });
    if (res.accion === 'exito') {
      setNombre(''); setTipo(''); setCapacidad(''); setUbicacion('');
    } else { setErrorForm(res.errorGeneral); }
    setGuardando(false);
  };

  return (
    <div className="pagina-ambientes">
      <h1 className="pagina-titulo">Gestión de Ambientes</h1>
      <AlertMessage tipo="error" mensaje={error || errorForm} />
      {cargando && <p role="status">Cargando ambientes...</p>}
      {esAdmin && (
        <form onSubmit={handleCrear} noValidate className="formulario-admin-ambiente">
          <h2>Nuevo Ambiente</h2>
          <div className="grid-formulario">
            <TextInput id="amb-nombre" label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} error={errores.nombre} obligatorio />
            <SelectInput id="amb-tipo" label="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} opciones={TIPOS_OPCIONES} error={errores.tipo} obligatorio />
            <TextInput id="amb-capacidad" label="Capacidad" type="number" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} error={errores.capacidad} obligatorio />
            <TextInput id="amb-ubicacion" label="Ubicación" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} error={errores.ubicacion} obligatorio />
          </div>
          <Button type="submit" cargando={guardando}>Registrar Ambiente</Button>
        </form>
      )}
      <TableList
        titulo="Listado de Ambientes"
        columnas={[{ id: 'nom', titulo: 'Nombre' }, { id: 'tip', titulo: 'Tipo' }, { id: 'cap', titulo: 'Capacidad' }, { id: 'ubi', titulo: 'Ubicación' }, { id: 'est', titulo: 'Estado' }, { id: 'acc', titulo: 'Acciones' }]}
        filas={ambientes}
        renderFila={(amb) => (
          <tr key={amb.id}>
            <td><strong>{amb.nombre}</strong></td>
            <td>{amb.tipo}</td>
            <td>{amb.capacidad} personas</td>
            <td>{amb.ubicacion}</td>
            <td><span className={`badge-estado badge-${amb.estado.toLowerCase()}`}>{amb.estado}</span></td>
            <td>
              {alSeleccionarParaReservar && amb.estado === 'Disponible' && (
                <Button variante="secundario" onClick={() => alSeleccionarParaReservar(amb.id)}>Reservar</Button>
              )}
            </td>
          </tr>
        )}
      />
    </div>
  );
}
