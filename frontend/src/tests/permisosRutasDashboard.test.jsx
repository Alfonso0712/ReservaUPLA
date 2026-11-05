// Pruebas E-48 y E-49: Redirección sin permiso a /panel con alerta y foco, y alcance en dashboard
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import RutaProtegida from '../routes/RutaProtegida';
import Panel from '../pages/Panel';
import { PERMISOS } from '../constants/permisos';
import { reiniciarBaseMock, guardarIdSesionMock } from '../mocks/baseDatosMock';

beforeEach(() => {
  reiniciarBaseMock();
  sessionStorage.clear();
  localStorage.clear();
});

it('E-48: ruta sin permiso redirige a /panel con alerta enfocada', async () => {
  guardarIdSesionMock('usr-solic');
  const usuario = {
    id: 'usr-solic',
    nombreCompleto: 'Solicitante Demo',
    correo: 'solic@upla.edu.pe',
    rol: 'Solicitante',
    permisos: [PERMISOS.DASHBOARD_VER]
  };

  render(
    <MemoryRouter initialEntries={['/ruta-privada']}>
      <AuthProvider usuarioInicial={usuario}>
        <Routes>
          <Route path="/panel" element={<Panel />} />
          <Route
            path="/ruta-privada"
            element={
              <RutaProtegida permiso={PERMISOS.AMBIENTES_CREAR}>
                <h1>Zona Privada</h1>
              </RutaProtegida>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

  const alerta = await screen.findByRole('alert');
  expect(alerta).toHaveTextContent('No tiene permiso para acceder a esa sección.');
  expect(document.activeElement).toBe(alerta);
});

it('E-49: panel adapta títulos según el alcance devuelto por el servidor', async () => {
  guardarIdSesionMock('usr-solic');
  const { unmount } = render(
    <MemoryRouter>
      <AuthProvider>
        <Panel />
      </AuthProvider>
    </MemoryRouter>
  );

  expect(await screen.findByRole('heading', { level: 1, name: 'Panel' })).toBeInTheDocument();
  expect(await screen.findByText('Mis solicitudes')).toBeInTheDocument();
  unmount();

  guardarIdSesionMock('usr-resp');
  render(
    <MemoryRouter>
      <AuthProvider>
        <Panel />
      </AuthProvider>
    </MemoryRouter>
  );

  expect(await screen.findByText('Reservas asignadas')).toBeInTheDocument();
});
