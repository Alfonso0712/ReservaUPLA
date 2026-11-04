// Pruebas automatizadas E-41 a E-43: Cambio de estado, aviso reservas y permisos
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import Ambientes from '../pages/Ambientes';
import FormularioReserva from '../components/reservas/FormularioReserva';
import { reiniciarBaseMock, guardarIdSesionMock, dbMock } from '../mocks/baseDatosMock';
import { ESTADOS_AMBIENTE } from '../constants/estados';
import { MENSAJES } from '../constants/mensajes';

beforeEach(() => { reiniciarBaseMock(); sessionStorage.clear(); localStorage.clear(); });
afterEach(() => { vi.restoreAllMocks(); });

it('E-41: cambiar estado muestra el aviso de reservas futuras y requiere confirmación', async () => {
  guardarIdSesionMock('usr-admin');
  const user = userEvent.setup();
  render(<MemoryRouter><AuthProvider><Ambientes /></AuthProvider></MemoryRouter>);
  const btnsCambiar = await screen.findAllByRole('button', { name: /^cambiar estado$/i });
  await user.click(btnsCambiar[0]);
  expect(await screen.findByRole('dialog', { name: /cambiar estado/i })).toBeInTheDocument();
  expect(screen.getByText(/tiene \d+ reservas pendientes o aprobadas/i)).toBeInTheDocument();
  const selectEstado = screen.getByLabelText(/nuevo estado/i);
  await user.selectOptions(selectEstado, ESTADOS_AMBIENTE.MANTENIMIENTO);
  const btnAccion = screen.getByRole('button', { name: /cambiar a mantenimiento/i });
  await user.click(btnAccion);
  expect(await screen.findByText(MENSAJES.AMBIENTE_ESTADO_ACTUALIZADO_EXITO)).toBeInTheDocument();
  expect(await screen.findByText(ESTADOS_AMBIENTE.MANTENIMIENTO)).toBeInTheDocument();
});

it('E-42: ambiente no disponible aparece deshabilitado en Nueva reserva y sin botón Reservar', async () => {
  dbMock.ambientes[0].estado = ESTADOS_AMBIENTE.MANTENIMIENTO;
  guardarIdSesionMock('usr-solic');
  const { unmount } = render(<MemoryRouter><AuthProvider><Ambientes /></AuthProvider></MemoryRouter>);
  expect(await screen.findByText(/no disponible por mantenimiento/i)).toBeInTheDocument();
  unmount();
  render(<MemoryRouter><AuthProvider><FormularioReserva abierto alCerrar={() => {}} /></AuthProvider></MemoryRouter>);
  const optionMantenimiento = await screen.findByRole('option', { name: /en mantenimiento/i });
  expect(optionMantenimiento).toBeDisabled();
});

it('E-43: Solicitante y Responsable no ven Editar ni Cambiar estado', async () => {
  guardarIdSesionMock('usr-solic');
  const { unmount } = render(<MemoryRouter><AuthProvider><Ambientes /></AuthProvider></MemoryRouter>);
  await screen.findByText(/Laboratorio de Cómputo 101/i);
  expect(screen.queryByRole('button', { name: /^editar$/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /^cambiar estado$/i })).not.toBeInTheDocument();
  unmount();
  guardarIdSesionMock('usr-resp');
  render(<MemoryRouter><AuthProvider><Ambientes /></AuthProvider></MemoryRouter>);
  await screen.findByText(/Laboratorio de Cómputo 101/i);
  expect(screen.queryByRole('button', { name: /^editar$/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /^cambiar estado$/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /^reservar/i })).not.toBeInTheDocument();
});
