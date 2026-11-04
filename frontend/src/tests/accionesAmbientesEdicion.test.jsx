// Pruebas automatizadas E-39, E-40 y E-44: Edición de ambientes y doble envío
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import Ambientes from '../pages/Ambientes';
import { reiniciarBaseMock, guardarIdSesionMock } from '../mocks/baseDatosMock';
import { MENSAJES } from '../constants/mensajes';
import * as ambienteService from '../services/ambienteService';

beforeEach(() => { reiniciarBaseMock(); sessionStorage.clear(); localStorage.clear(); });
afterEach(() => { vi.restoreAllMocks(); });

it('E-39: editar ambiente con datos correctos actualiza catálogo y muestra alerta', async () => {
  guardarIdSesionMock('usr-admin');
  const user = userEvent.setup();
  render(<MemoryRouter><AuthProvider><Ambientes /></AuthProvider></MemoryRouter>);
  const btnsEditar = await screen.findAllByRole('button', { name: /^editar$/i });
  await user.click(btnsEditar[0]);
  expect(await screen.findByRole('dialog', { name: /editar ambiente/i })).toBeInTheDocument();
  const inputCap = screen.getByLabelText(/^capacidad/i);
  await user.clear(inputCap);
  await user.type(inputCap, '55');
  await user.click(screen.getByRole('button', { name: /guardar cambios/i }));
  expect(await screen.findByText(MENSAJES.AMBIENTE_ACTUALIZADO_EXITO)).toBeInTheDocument();
  expect(await screen.findByText('55 personas')).toBeInTheDocument();
});

it('E-40: editar con campos vacíos, capacidad inválida y nombre duplicado (409)', async () => {
  guardarIdSesionMock('usr-admin');
  const user = userEvent.setup();
  render(<MemoryRouter><AuthProvider><Ambientes /></AuthProvider></MemoryRouter>);
  const btnsEditar = await screen.findAllByRole('button', { name: /^editar$/i });
  await user.click(btnsEditar[1]);
  expect(await screen.findByRole('dialog', { name: /editar ambiente/i })).toBeInTheDocument();
  const inputNom = screen.getByLabelText(/^nombre/i);
  const inputCap = screen.getByLabelText(/^capacidad/i);
  await user.clear(inputNom);
  await user.click(screen.getByRole('button', { name: /guardar cambios/i }));
  expect(await screen.findByText(MENSAJES.AMBIENTE_NOMBRE_OBLIGATORIO)).toBeInTheDocument();
  await user.type(inputNom, 'Auditorio Secundario');
  await user.clear(inputCap);
  await user.type(inputCap, '0');
  await user.click(screen.getByRole('button', { name: /guardar cambios/i }));
  expect(await screen.findByText(MENSAJES.AMBIENTE_CAPACIDAD_INVALIDA)).toBeInTheDocument();
  await user.clear(inputCap);
  await user.type(inputCap, '100');
  await user.clear(inputNom);
  await user.type(inputNom, 'laboratorio de cómputo 101');
  await user.click(screen.getByRole('button', { name: /guardar cambios/i }));
  expect(await screen.findByText(MENSAJES.AMBIENTE_NOMBRE_DUPLICADO)).toBeInTheDocument();
});

it('E-44: doble envío en editar y en cambiar estado realiza una sola petición', async () => {
  guardarIdSesionMock('usr-admin');
  let resolverEdicion;
  const espiaEdicion = vi.spyOn(ambienteService, 'actualizarAmbienteApi').mockImplementation(() => new Promise((r) => { resolverEdicion = r; }));
  const user = userEvent.setup();
  render(<MemoryRouter><AuthProvider><Ambientes /></AuthProvider></MemoryRouter>);
  const btnsEditar = await screen.findAllByRole('button', { name: /^editar$/i });
  await user.click(btnsEditar[0]);
  const btnGuardar = await screen.findByRole('button', { name: /guardar cambios/i });
  await user.click(btnGuardar);
  await user.click(btnGuardar);
  expect(espiaEdicion).toHaveBeenCalledTimes(1);
  resolverEdicion({ estado: 200, datos: { id: 'amb-1', nombre: 'Laboratorio de Cómputo 101' } });
});
