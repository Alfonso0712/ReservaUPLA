// Pruebas automatizadas E-34 a E-38: Rediseño de Cabecera y Menú de Usuario
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import Header from '../components/navegacion/Header';
import Sidebar from '../components/navegacion/Sidebar';
import { AuthProvider } from '../hooks/useAuth';
import { reiniciarBaseMock, guardarIdSesionMock } from '../mocks/baseDatosMock';

beforeEach(() => { reiniciarBaseMock(); sessionStorage.clear(); localStorage.clear(); });

it('E-34: clic en el nombre abre el menú (aria-expanded=true) y muestra Cerrar sesión', async () => {
  guardarIdSesionMock('usr-admin');
  const user = userEvent.setup();
  render(<MemoryRouter><AuthProvider><Header /></AuthProvider></MemoryRouter>);
  const botonMenu = screen.getByRole('button', { name: /menú de cuenta/i });
  expect(botonMenu).toHaveAttribute('aria-expanded', 'false');
  await user.click(botonMenu);
  expect(botonMenu).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
});

it('E-35: Escape cierra y devuelve foco; clic fuera y Tab fuera también cierran', async () => {
  guardarIdSesionMock('usr-admin');
  const user = userEvent.setup();
  render(<MemoryRouter><AuthProvider><button type="button">Externo</button><Header /></AuthProvider></MemoryRouter>);
  const botonMenu = screen.getByRole('button', { name: /menú de cuenta/i });
  await user.click(botonMenu);
  expect(botonMenu).toHaveAttribute('aria-expanded', 'true');
  await user.keyboard('{Escape}');
  expect(botonMenu).toHaveAttribute('aria-expanded', 'false');
  expect(document.activeElement).toBe(botonMenu);
  await user.click(botonMenu);
  await user.click(screen.getByRole('button', { name: 'Externo' }));
  expect(botonMenu).toHaveAttribute('aria-expanded', 'false');
});

it('E-36: Cerrar sesión lleva a /ingresar con foco en primer campo y evita doble envío', async () => {
  guardarIdSesionMock('usr-admin');
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={['/panel']}><App /></MemoryRouter>);
  await user.click(await screen.findByRole('button', { name: /menú de cuenta/i }));
  await user.click(screen.getByRole('button', { name: /cerrar sesión/i }));
  const inputCorreo = await screen.findByLabelText(/correo institucional/i);
  expect(inputCorreo).toBeInTheDocument();
  expect(document.activeElement).toBe(inputCorreo);
});

it('E-37: orden DOM en cabecera, Sidebar limpio y migas en cabecera', async () => {
  guardarIdSesionMock('usr-admin');
  render(<MemoryRouter initialEntries={['/panel']}><App /></MemoryRouter>);
  const header = screen.getByRole('banner', { name: /cabecera/i });
  expect(within(header).getByText('Inicio')).toBeInTheDocument();
  const ctrlFuente = within(header).getByRole('group', { name: /tamaño de fuente/i });
  const ctrlTema = within(header).getByRole('button', { name: /modo/i });
  const ctrlMenu = within(header).getByRole('button', { name: /menú de cuenta/i });
  const sig = window.Node.DOCUMENT_POSITION_FOLLOWING;
  expect(ctrlFuente.compareDocumentPosition(ctrlTema) & sig).toBeTruthy();
  expect(ctrlTema.compareDocumentPosition(ctrlMenu) & sig).toBeTruthy();
  const { container } = render(<MemoryRouter><Sidebar usuario={{ rol: 'Administrador' }} /></MemoryRouter>);
  expect(within(container).queryByRole('button', { name: /cerrar sesión/i })).not.toBeInTheDocument();
  expect(within(container).queryByRole('button', { name: /nueva reserva/i })).not.toBeInTheDocument();
  expect(within(container).queryByText(/resumen|catálogo/i)).not.toBeInTheDocument();
});

it('E-38: con ancho < 480 px controles dentro del menú sin duplicados en cabecera', async () => {
  window.matchMedia = vi.fn().mockImplementation((q) => ({ matches: false, media: q, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  guardarIdSesionMock('usr-admin');
  const user = userEvent.setup();
  render(<MemoryRouter><AuthProvider><Header /></AuthProvider></MemoryRouter>);
  const header = screen.getByRole('banner', { name: /cabecera/i });
  expect(within(header).queryByRole('group', { name: /tamaño de fuente/i })).not.toBeInTheDocument();
  expect(within(header).queryByRole('button', { name: /modo/i })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /menú de cuenta/i }));
  expect(screen.getByRole('group', { name: /tamaño de fuente/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /modo/i })).toBeInTheDocument();
});
