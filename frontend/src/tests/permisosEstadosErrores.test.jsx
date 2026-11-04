// Pruebas automatizadas E-18 a E-24: Permisos por rol, estados finales, doble envío y errores de red/500
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import ListadoReservas from '../pages/ListadoReservas';
import DetalleReserva from '../pages/DetalleReserva';
import Ingresar from '../pages/Ingresar';
import { reiniciarBaseMock, guardarIdSesionMock, configurarFalloMock } from '../mocks/baseDatosMock';
import { validarTransicionEstado } from '../validation/validadores';
import { MENSAJES } from '../constants/mensajes';
import * as authService from '../services/authService';

beforeEach(() => { reiniciarBaseMock(); sessionStorage.clear(); localStorage.clear(); });
afterEach(() => { vi.restoreAllMocks(); });

it('E-18: Solicitante no ve botones Aprobar ni Rechazar en el listado', async () => {
  guardarIdSesionMock('usr-solic');
  render(<MemoryRouter><AuthProvider><ListadoReservas /></AuthProvider></MemoryRouter>);
  await screen.findAllByText(/Laboratorio de Cómputo 101/i);
  expect(screen.queryByRole('button', { name: /aprobar/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /rechazar/i })).not.toBeInTheDocument();
});

it('E-19: Administrador aprueba reserva Pendiente mediante ModalConfirmacion', async () => {
  guardarIdSesionMock('usr-admin');
  const user = userEvent.setup();
  render(<MemoryRouter><AuthProvider><ListadoReservas /></AuthProvider></MemoryRouter>);
  const botonesAprobar = await screen.findAllByRole('button', { name: /^aprobar reserva/i });
  await user.click(botonesAprobar[0]);
  expect(await screen.findByRole('dialog')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Aprobar reserva' }));
  expect(await screen.findByText(MENSAJES.RESERVA_APROBADA_EXITO)).toBeInTheDocument();
});

it('E-20 y E-21: reserva en estado final no ofrece acciones y rechaza transiciones inválidas', async () => {
  guardarIdSesionMock('usr-admin');
  render(<MemoryRouter initialEntries={['/reservas/res-4']}><AuthProvider><Routes><Route path="/reservas/:id" element={<DetalleReserva />} /></Routes></AuthProvider></MemoryRouter>);
  expect(await screen.findByText(MENSAJES.TRANSICION_ESTADO_NO_PERMITIDA)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /aprobar reserva/i })).not.toBeInTheDocument();
  expect(validarTransicionEstado('Rechazada', 'Aprobada', 'Administrador').valido).toBe(false);
  expect(validarTransicionEstado('Pendiente', 'Aprobada', 'Solicitante').error).toBe(MENSAJES.ACCION_SOLO_ADMINISTRADOR);
});

it('E-22: doble envío realiza una sola petición mientras está en proceso', async () => {
  let resolverPromesa;
  const espia = vi.spyOn(authService, 'iniciarSesionApi').mockImplementation(() => new Promise((r) => { resolverPromesa = r; }));
  const user = userEvent.setup();
  render(<MemoryRouter><AuthProvider><Ingresar /></AuthProvider></MemoryRouter>);
  await user.type(screen.getByLabelText(/correo institucional/i), 'admin@upla.edu.pe');
  await user.type(screen.getByLabelText(/^contraseña/i), 'AdminUpla2026!');
  const boton = screen.getByRole('button', { name: /iniciar sesión/i });
  await user.click(boton);
  await user.click(boton);
  expect(espia).toHaveBeenCalledTimes(1);
  resolverPromesa({ estado: 401, datos: null });
  expect(await screen.findByRole('alert')).toBeInTheDocument();
});

it('E-23 y E-24: red caída (0) conserva datos y error 500 muestra mensaje no técnico', async () => {
  configurarFalloMock(0);
  const user = userEvent.setup();
  render(<MemoryRouter><AuthProvider><Ingresar /></AuthProvider></MemoryRouter>);
  const inputCorreo = screen.getByLabelText(/correo institucional/i);
  await user.type(inputCorreo, 'admin@upla.edu.pe');
  await user.type(screen.getByLabelText(/^contraseña/i), 'AdminUpla2026!');
  await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
  expect(await screen.findByRole('alert')).toHaveTextContent(MENSAJES.SIN_CONEXION);
  expect(inputCorreo).toHaveValue('admin@upla.edu.pe');
  configurarFalloMock(500);
  await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
  expect(await screen.findByRole('alert')).toHaveTextContent(MENSAJES.ERROR_SERVIDOR);
});
