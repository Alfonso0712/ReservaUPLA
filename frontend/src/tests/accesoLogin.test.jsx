// Pruebas automatizadas E-07 a E-09: Inicio de sesión, error 401 uniforme y límite 429
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import Ingresar from '../pages/Ingresar';
import { reiniciarBaseMock, configurarFalloMock } from '../mocks/baseDatosMock';
import { MENSAJES } from '../constants/mensajes';

beforeEach(() => {
  reiniciarBaseMock();
  sessionStorage.clear();
  localStorage.clear();
});

function renderizarLogin() {
  return render(
    <MemoryRouter initialEntries={['/ingresar']}>
      <AuthProvider>
        <Routes>
          <Route path="/ingresar" element={<Ingresar />} />
          <Route path="/panel" element={<h1>Panel</h1>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Inicio de sesión institucional (E-07..09)', () => {
  it('E-07: login correcto redirige al panel institucional', async () => {
    const user = userEvent.setup();
    renderizarLogin();
    await user.type(screen.getByLabelText(/correo institucional/i), 'admin@upla.edu.pe');
    await user.type(screen.getByLabelText(/^contraseña/i), 'AdminUpla2026!');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Panel' })).toBeInTheDocument();
  });

  it('E-08: login incorrecto con mensaje uniforme y foco en contraseña', async () => {
    const user = userEvent.setup();
    renderizarLogin();
    const inputClave = screen.getByLabelText(/^contraseña/i);
    await user.type(screen.getByLabelText(/correo institucional/i), 'admin@upla.edu.pe');
    await user.type(inputClave, 'ClaveErronea123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(MENSAJES.CREDENCIALES_INVALIDAS);
    expect(document.activeElement).toBe(inputClave);
  });

  it('E-09: límite de intentos 429 muestra alerta de espera y recibe foco', async () => {
    configurarFalloMock(429);
    const user = userEvent.setup();
    renderizarLogin();
    await user.type(screen.getByLabelText(/correo institucional/i), 'admin@upla.edu.pe');
    await user.type(screen.getByLabelText(/^contraseña/i), 'AdminUpla2026!');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    const alerta = await screen.findByRole('alert');
    expect(alerta).toHaveTextContent(MENSAJES.LIMITE_INTENTOS);
    expect(document.activeElement).toBe(alerta);
  });
});
