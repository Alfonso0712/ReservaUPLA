// Pruebas automatizadas E-07 a E-09 e integración con <App /> · E-07..09
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { reiniciarBaseMock, configurarFalloMock } from '../mocks/baseDatosMock';
import { MENSAJES } from '../constants/mensajes';

beforeEach(() => { reiniciarBaseMock(); sessionStorage.clear(); localStorage.clear(); });

const renderAppEnIngresar = () => render(
  <MemoryRouter initialEntries={['/ingresar']}><App /></MemoryRouter>
);

describe('Inicio de sesión institucional (E-07..09)', () => {
  it('E-07: login integración con App y botón demo redirige a /panel con h1', async () => {
    const user = userEvent.setup();
    renderAppEnIngresar();
    await user.click(await screen.findByRole('button', { name: /^administrador$/i }));
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Panel' })).toBeInTheDocument();
  });

  it('E-08: login incorrecto con mensaje uniforme y foco en contraseña', async () => {
    const user = userEvent.setup();
    renderAppEnIngresar();
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
    renderAppEnIngresar();
    await user.type(screen.getByLabelText(/correo institucional/i), 'admin@upla.edu.pe');
    await user.type(screen.getByLabelText(/^contraseña/i), 'AdminUpla2026!');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    const alerta = await screen.findByRole('alert');
    expect(alerta).toHaveTextContent(MENSAJES.LIMITE_INTENTOS);
    expect(document.activeElement).toBe(alerta);
  });
});
