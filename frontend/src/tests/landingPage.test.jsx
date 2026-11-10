// Pruebas deterministas de la Landing Page pública · Accesibilidad, enlaces y redirección
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import RutasApp from '../routes/rutas';
import LandingPage from '../pages/LandingPage';
import { ENLACES_NAV_LANDING, AMBIENTES_LANDING, REGLAS_LANDING } from '../constants/datosLanding';
import { obtenerPermisosDeRol } from '../mocks/permisosPorRol';

describe('Landing Page pública de ReservaUPLA', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('renderiza un único h1 con la propuesta de valor institucional', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </MemoryRouter>
    );

    const encabezadosH1 = screen.getAllByRole('heading', { level: 1 });
    expect(encabezadosH1).toHaveLength(1);
    expect(encabezadosH1[0]).toHaveTextContent(/gestión y reserva eficiente de ambientes universitarios/i);
  });

  it('renderiza todos los enlaces de ancla definidos en la barra de navegación', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </MemoryRouter>
    );

    ENLACES_NAV_LANDING.forEach((enlace) => {
      const links = screen.getAllByRole('link', { name: enlace.etiqueta });
      expect(links.length).toBeGreaterThanOrEqual(1);
      expect(links[0]).toHaveAttribute('href', enlace.href);
    });
  });

  it('renderiza las 4 tarjetas de tipos de ambientes y las reglas normativas', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </MemoryRouter>
    );

    // Tipos de ambientes
    AMBIENTES_LANDING.forEach((amb) => {
      expect(screen.getByRole('heading', { level: 3, name: amb.tipo })).toBeInTheDocument();
    });

    // Reglas
    REGLAS_LANDING.forEach((regla) => {
      expect(screen.getByRole('heading', { level: 3, name: regla.titulo })).toBeInTheDocument();
    });
  });

  it('el botón "Iniciar sesión" del hero navega a la ruta del login (/ingresar)', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <RutasApp />
        </AuthProvider>
      </MemoryRouter>
    );

    // Encuentra el botón principal de iniciar sesión en el Hero
    const botonesLogin = screen.getAllByRole('link', { name: /iniciar sesión/i });
    expect(botonesLogin.length).toBeGreaterThanOrEqual(1);

    await user.click(botonesLogin[0]);

    // Verifica que ahora se muestra el formulario de login (/ingresar)
    expect(await screen.findByRole('heading', { level: 1, name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/correo institucional/i)).toBeInTheDocument();
  });

  it('el botón "Registrarse" navega a la ruta del registro (/registro)', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <RutasApp />
        </AuthProvider>
      </MemoryRouter>
    );

    const botonesRegistro = screen.getAllByRole('link', { name: /registrarse/i });
    expect(botonesRegistro.length).toBeGreaterThanOrEqual(1);

    await user.click(botonesRegistro[0]);

    // Verifica que se muestra la pantalla de registro de solicitante
    expect(await screen.findByRole('heading', { level: 1, name: /registrarse como solicitante/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/correo institucional/i)).toBeInTheDocument();
  });

  it('usuario con sesión activa que accede a "/" es redirigido automáticamente a su panel (/panel)', async () => {
    const usuarioAutenticado = {
      id: 'usr-admin',
      nombreCompleto: 'Carlos Mendoza Quispe',
      correo: 'admin@upla.edu.pe',
      rol: 'Administrador',
      permisos: obtenerPermisosDeRol('Administrador')
    };

    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider usuarioInicial={usuarioAutenticado}>
          <RutasApp />
        </AuthProvider>
      </MemoryRouter>
    );

    // Debe mostrar la cabecera y el h1 del Panel sin mostrar la Landing
    expect(await screen.findByRole('heading', { level: 1, name: 'Panel' })).toBeInTheDocument();
    expect(screen.queryByText(/gestión y reserva eficiente de ambientes universitarios/i)).not.toBeInTheDocument();
  });
});
