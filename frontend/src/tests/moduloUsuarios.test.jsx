import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import RutasApp from '../routes/rutas.jsx';
import Sidebar from '../components/navegacion/Sidebar';
import Usuarios from '../pages/Usuarios';
import { guardarIdSesionMock, reiniciarBaseMock, dbMock } from '../mocks/baseDatosMock';
import { obtenerPermisosDeRol } from '../mocks/permisosPorRol';
import { MENSAJES } from '../constants/mensajes';

describe('Módulo de Administración de Usuarios', () => {
  beforeEach(() => {
    sessionStorage.clear();
    reiniciarBaseMock();
  });

  const crearContextoUsuario = (id) => {
    guardarIdSesionMock(id);
    const u = dbMock.usuarios.find((item) => item.id === id);
    return { ...u, permisos: obtenerPermisosDeRol(u.rol) };
  };

  it('el Administrador ve la opción Usuarios en el menú y los otros roles no', () => {
    // 1. Administrador
    const admin = crearContextoUsuario('usr-admin');
    const { unmount: u1 } = render(
      <MemoryRouter>
        <AuthProvider usuarioInicial={admin}>
          <Sidebar />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /usuarios/i })).toBeInTheDocument();
    u1();

    // 2. Responsable
    const resp = crearContextoUsuario('usr-resp');
    const { unmount: u2 } = render(
      <MemoryRouter>
        <AuthProvider usuarioInicial={resp}>
          <Sidebar />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.queryByRole('link', { name: /usuarios/i })).not.toBeInTheDocument();
    u2();

    // 3. Solicitante
    const solic = crearContextoUsuario('usr-solic');
    const { unmount: u3 } = render(
      <MemoryRouter>
        <AuthProvider usuarioInicial={solic}>
          <Sidebar />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.queryByRole('link', { name: /usuarios/i })).not.toBeInTheDocument();
    u3();
  });

  it('ruta protegida /usuarios: deniega acceso a Solicitante y redirige a /panel', async () => {
    const solic = crearContextoUsuario('usr-solic');
    render(
      <MemoryRouter initialEntries={['/usuarios']}>
        <AuthProvider usuarioInicial={solic}>
          <RutasApp />
        </AuthProvider>
      </MemoryRouter>
    );

    const alerta = await screen.findByRole('alert');
    expect(alerta).toHaveTextContent('No tiene permiso para acceder a esa sección.');
  });

  it('Administrador accede a /usuarios, lista usuarios y usa filtros de búsqueda', async () => {
    const admin = crearContextoUsuario('usr-admin');
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider usuarioInicial={admin}>
          <Usuarios />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { level: 1, name: 'Usuarios' })).toBeInTheDocument();
    expect(await screen.findByText('Elena Huamán Rojas')).toBeInTheDocument();

    const campoBuscar = screen.getByPlaceholderText('Nombre o correo');
    await user.type(campoBuscar, 'Elena');

    await waitFor(() => {
      expect(screen.getByText('Elena Huamán Rojas')).toBeInTheDocument();
      expect(screen.queryByText('Marco Paredes Castro')).not.toBeInTheDocument();
    });
  });

  it('validación de formulario de alta: campos vacíos impiden el envío y muestran errores', async () => {
    const admin = crearContextoUsuario('usr-admin');
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider usuarioInicial={admin}>
          <Usuarios />
        </AuthProvider>
      </MemoryRouter>
    );

    const botonNuevo = await screen.findByRole('button', { name: 'Nuevo usuario' });
    await user.click(botonNuevo);

    expect(await screen.findByRole('heading', { level: 2, name: 'Nuevo usuario' })).toBeInTheDocument();

    const botonCrear = screen.getByRole('button', { name: 'Crear usuario' });
    await user.click(botonCrear);

    expect(await screen.findByText(MENSAJES.NOMBRE_OBLIGATORIO)).toBeInTheDocument();
  });

  it('alta exitosa: crea un nuevo usuario y actualiza la lista', async () => {
    const admin = crearContextoUsuario('usr-admin');
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider usuarioInicial={admin}>
          <Usuarios />
        </AuthProvider>
      </MemoryRouter>
    );

    const botonNuevo = await screen.findByRole('button', { name: 'Nuevo usuario' });
    await user.click(botonNuevo);

    const modal = await screen.findByRole('dialog', { name: /nuevo usuario/i });
    expect(modal).toBeInTheDocument();

    await user.type(screen.getByLabelText(/nombre completo/i), 'Nuevo Docente Prueba');
    await user.type(screen.getByLabelText(/correo electrónico institucional/i), 'docente.prueba@upla.edu.pe');
    await user.selectOptions(screen.getByLabelText(/rol asignado/i), 'Responsable');
    await user.type(screen.getByLabelText(/contraseña inicial/i), 'ClaveSegura123*');

    await user.click(screen.getByRole('button', { name: 'Crear usuario' }));

    expect(await screen.findByText('Usuario registrado con éxito.')).toBeInTheDocument();
    expect(await screen.findByText('Nuevo Docente Prueba')).toBeInTheDocument();
  });

  it('desactivación con advertencia de ambientes asignados y confirmación en modal', async () => {
    const admin = crearContextoUsuario('usr-admin');
    const user = userEvent.setup();

    dbMock.ambientes = [
      { id: 'amb-1', nombre: 'Laboratorio Alfa', responsableId: 'usr-resp', estado: 'Disponible' }
    ];

    render(
      <MemoryRouter>
        <AuthProvider usuarioInicial={admin}>
          <Usuarios />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('Elena Huamán Rojas')).toBeInTheDocument();

    const botonDesactivar = screen.getByRole('button', { name: 'Desactivar usuario Elena Huamán Rojas' });
    await user.click(botonDesactivar);

    const modal = await screen.findByRole('dialog', { name: /desactivar usuario/i });
    expect(modal).toBeInTheDocument();
    expect(screen.getByText(/tiene 1 ambiente\(s\) asignado\(s\) como responsable/i)).toBeInTheDocument();

    const botonConfirmar = screen.getByRole('button', { name: 'Desactivar' });
    await user.click(botonConfirmar);

    expect(await screen.findByText(/desactivado/i)).toBeInTheDocument();
  });
});
