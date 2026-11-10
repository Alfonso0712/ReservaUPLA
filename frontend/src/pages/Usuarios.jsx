// Módulo Usuarios · Exclusivo Administrador · Listado, filtros, alta, edición y estado
import { useState, useMemo, useEffect } from 'react';
import { usePermisos } from '../hooks/usePermisos';
import { useAuth } from '../hooks/useAuth';
import { useUsuarios } from '../hooks/useUsuarios';
import { useDebounce } from '../hooks/useDebounce';
import { useTamanoFuente } from '../hooks/useTamanoFuente';
import { PERMISOS } from '../constants/permisos';
import { normalizarTexto } from '../utils/normalizarTexto';
import { obtenerIniciales } from '../utils/obtenerIniciales';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import FiltrosUsuarios from '../components/usuarios/FiltrosUsuarios';
import FormularioUsuario from '../components/usuarios/FormularioUsuario';
import AccionesFilaUsuario from '../components/usuarios/AccionesFilaUsuario';
import ModalConfirmacion from '../components/ui/ModalConfirmacion';
import AlertMessage from '../components/ui/AlertMessage';
import Badge from '../components/ui/Badge';
import TableList from '../components/ui/TableList';
import Toast from '../components/ui/Toast';
import Button from '../components/ui/Button';

const ESTILOS_CHIP_ROL = {
  Administrador: 'bg-primario-suave text-primario dark:text-primario-enlace border border-primario/20',
  Responsable: 'bg-pendiente-fondo text-pendiente-texto border border-pendiente-texto/20',
  Solicitante: 'bg-superficie-2 text-texto border border-borde'
};

function RolChip({ rol }) {
  const clases = ESTILOS_CHIP_ROL[rol] || ESTILOS_CHIP_ROL.Solicitante;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${clases}`}>
      {rol}
    </span>
  );
}

export default function Usuarios() {
  const { puede } = usePermisos();
  const { usuario: usuarioActual } = useAuth();
  const { usuarios, cargando, error, registrarUsuario, editarUsuario, cambiarEstadoUsuario } = useUsuarios();
  const { tamanoFuente } = useTamanoFuente();
  const esExtra = tamanoFuente === '125%';

  const [textoFiltro, setTextoFiltro] = useState('');
  const textoDebounce = useDebounce(textoFiltro);
  const [rolFiltro, setRolFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState(null);
  const [usuarioParaCambiarEstado, setUsuarioParaCambiarEstado] = useState(null);
  const [toasts, setToasts] = useState([]);

  const notificarExito = (mensaje) => {
    if (typeof window !== 'undefined') {
      setToasts((prev) => [...prev.slice(-2), { id: Date.now(), tipo: 'exito', mensaje }]);
    }
  };

  const notificarError = (mensaje) => {
    if (typeof window !== 'undefined') {
      setToasts((prev) => [...prev.slice(-2), { id: Date.now(), tipo: 'error', mensaje }]);
    }
  };

  useEffect(() => {
    if (error) notificarError(error);
  }, [error]);

  const puedeCrear = puede(PERMISOS.USUARIOS_CREAR);
  const puedeEditar = puede(PERMISOS.USUARIOS_EDITAR);
  const puedeCambiarEstado = puede(PERMISOS.USUARIOS_CAMBIAR_ESTADO);

  const manejarCambioEstado = async (u) => {
    if (u.activo) {
      // Confirmar antes de desactivar
      setUsuarioParaCambiarEstado(u);
    } else {
      // Reactivar inmediatamente
      const res = await cambiarEstadoUsuario(u.id, true);
      if (res.ok) {
        notificarExito(`Usuario ${u.nombreCompleto} reactivado con éxito.`);
      } else {
        notificarError(res.errorGeneral || 'No se pudo reactivar el usuario.');
      }
    }
  };

  const confirmarDesactivacion = async () => {
    if (!usuarioParaCambiarEstado) return;
    const u = usuarioParaCambiarEstado;
    const res = await cambiarEstadoUsuario(u.id, false);
    setUsuarioParaCambiarEstado(null);
    if (res.ok) {
      notificarExito(`Usuario ${u.nombreCompleto} desactivado.`);
    } else {
      notificarError(res.errorGeneral || 'No se pudo desactivar el usuario.');
    }
  };

  const filtrados = useMemo(() => {
    const busqueda = normalizarTexto(textoDebounce).toLowerCase();
    return usuarios.filter((u) => {
      if (rolFiltro && !Object.is(u.rol, rolFiltro)) return false;
      if (estadoFiltro === 'activos' && !u.activo) return false;
      if (estadoFiltro === 'inactivos' && u.activo) return false;
      if (busqueda) {
        const coincidencia = `${u.nombreCompleto} ${u.correo}`.toLowerCase().includes(busqueda);
        if (!coincidencia) return false;
      }
      return true;
    });
  }, [usuarios, textoDebounce, rolFiltro, estadoFiltro]);

  const columnas = [
    {
      clave: 'usuario',
      encabezado: 'Usuario',
      ordenable: true,
      claseEncabezado: 'min-w-[14rem] px-3',
      claseCelda: 'min-w-[14rem] px-3',
      render: (u) => {
        const iniciales = obtenerIniciales(u.nombreCompleto) || 'U';
        return (
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-full bg-primario-suave text-primario dark:text-primario-enlace font-bold text-xs flex items-center justify-center shrink-0">
              {iniciales}
            </span>
            <div className="min-w-0 flex-1">
              <span
                title={u.nombreCompleto}
                className="font-semibold text-texto line-clamp-2 leading-snug break-words block text-sm"
              >
                {u.nombreCompleto}
              </span>
              <p title={u.correo} className="text-xs text-texto-suave truncate mt-0.5 leading-snug">
                {u.correo}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      clave: 'rol',
      encabezado: 'Rol',
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
      claseCelda: 'w-[1%] whitespace-nowrap px-3',
      render: (u) => <RolChip rol={u.rol} />
    },
    {
      clave: 'ambientesAsignados',
      encabezado: 'Ambientes asignados',
      claseEncabezado: `w-[1%] whitespace-nowrap text-center px-3 ${esExtra ? 'hidden xl:table-cell' : 'hidden lg:table-cell'}`,
      claseCelda: `w-[1%] whitespace-nowrap text-center px-3 cifra-tabular ${esExtra ? 'hidden xl:table-cell' : 'hidden lg:table-cell'}`,
      render: (u) => {
        if (!['Responsable'].includes(u.rol)) return <span className="text-texto-suave">—</span>;
        const count = u.ambientesAsignados || 0;
        return (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${count > 0 ? 'bg-superficie-2 text-texto font-semibold' : 'text-texto-suave'}`}>
            {count} {count === 1 ? 'ambiente' : 'ambientes'}
          </span>
        );
      }
    },
    {
      clave: 'estado',
      encabezado: 'Estado',
      claseEncabezado: 'w-[1%] whitespace-nowrap px-3',
      claseCelda: 'w-[1%] whitespace-nowrap px-3',
      render: (u) => (
        <Badge
          variante={u.activo ? 'aprobada' : 'cancelada'}
          icono={u.activo ? 'CircleCheck' : 'CircleX'}
        >
          {u.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      clave: 'acciones',
      encabezado: 'Acciones',
      claseEncabezado: 'w-[1%] whitespace-nowrap text-right pl-3 pr-4',
      claseCelda: 'w-[1%] whitespace-nowrap text-right pl-3 pr-4',
      render: (u) => (
        <AccionesFilaUsuario
          usuario={u}
          puedeEditar={puedeEditar}
          puedeCambiarEstado={puedeCambiarEstado}
          esUsuarioActual={usuarioActual?.id === u.id}
          alEditar={(usr) => setUsuarioParaEditar(usr)}
          alCambiarEstado={manejarCambioEstado}
        />
      )
    }
  ];

  return (
    <div className="space-y-4">
      <EncabezadoPagina
        titulo="Usuarios"
        descripcion="Consulte, filtre y gestione los usuarios del sistema."
        accionPrimaria={
          puedeCrear ? (
            <Button
              variante="primary"
              icono="Plus"
              onClick={() => setModalCrearAbierto(true)}
              aria-label="Nuevo usuario"
            >
              Nuevo usuario
            </Button>
          ) : null
        }
      />

      <FiltrosUsuarios
        texto={textoFiltro}
        rol={rolFiltro}
        estado={estadoFiltro}
        totalResultados={filtrados.length}
        alCambiarTexto={setTextoFiltro}
        alCambiarRol={setRolFiltro}
        alCambiarEstado={setEstadoFiltro}
        alLimpiar={() => {
          setTextoFiltro('');
          setRolFiltro('');
          setEstadoFiltro('');
        }}
      />

      <TableList
        datos={filtrados}
        columnas={columnas}
        cargando={cargando}
        mensajeVacio="No se encontraron usuarios con los filtros aplicados."
        claveFila="id"
      />

      {/* Modal Alta */}
      <FormularioUsuario
        abierto={modalCrearAbierto}
        modo="crear"
        alRegistrar={registrarUsuario}
        alCerrar={() => setModalCrearAbierto(false)}
        alExito={(msg) => {
          setModalCrearAbierto(false);
          notificarExito(msg);
        }}
      />

      {/* Modal Edición */}
      <FormularioUsuario
        abierto={Boolean(usuarioParaEditar)}
        modo="editar"
        usuarioAEditar={usuarioParaEditar}
        alEditar={editarUsuario}
        alCerrar={() => setUsuarioParaEditar(null)}
        alExito={(msg) => {
          setUsuarioParaEditar(null);
          notificarExito(msg);
        }}
      />

      {/* Modal Confirmación Desactivación */}
      <ModalConfirmacion
        abierto={Boolean(usuarioParaCambiarEstado)}
        titulo="Desactivar usuario"
        descripcion={`¿Está seguro de que desea desactivar a ${usuarioParaCambiarEstado?.nombreCompleto}? El usuario no podrá iniciar sesión en el sistema.`}
        resumen={
          usuarioParaCambiarEstado?.ambientesAsignados > 0 ? (
            <div className="mb-4">
              <AlertMessage
                variante="alerta"
                rol="status"
                mensaje={`Advertencia: Este usuario tiene ${usuarioParaCambiarEstado.ambientesAsignados} ambiente(s) asignado(s) como responsable. Debe considerar reasignar dichos ambientes.`}
              />
            </div>
          ) : null
        }
        etiquetaConfirmar="Desactivar"
        varianteConfirmar="peligro"
        etiquetaCancelar="Cancelar"
        alConfirmar={confirmarDesactivacion}
        alCancelar={() => setUsuarioParaCambiarEstado(null)}
      />

      {/* Toasts de retroalimentación */}
      <Toast
        toasts={toasts}
        alCerrar={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
