// Pruebas automatizadas E-10 a E-17: Ambientes, solicitudes de reserva y disponibilidad
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import Ambientes from '../pages/Ambientes';
import FormularioReserva from '../components/reservas/FormularioReserva';
import { reiniciarBaseMock, guardarIdSesionMock } from '../mocks/baseDatosMock';
import { validarCapacidadAmbiente, validarHorarioReserva, validarFechaReserva } from '../validation/validadores';
import { MENSAJES } from '../constants/mensajes';

beforeEach(() => { reiniciarBaseMock(); sessionStorage.clear(); localStorage.clear(); });
const renderModalReserva = (alExito = () => {}) => render(
  <MemoryRouter><AuthProvider><FormularioReserva abierto alCerrar={() => {}} alExito={alExito} /></AuthProvider></MemoryRouter>,
);
it('E-10 y E-11: registra ambiente válido y rechaza capacidad <= 0 o no numérica', async () => {
  expect(validarCapacidadAmbiente('0')).toBe(MENSAJES.AMBIENTE_CAPACIDAD_INVALIDA);
  expect(validarCapacidadAmbiente('-15')).toBe(MENSAJES.AMBIENTE_CAPACIDAD_INVALIDA);
  expect(validarCapacidadAmbiente('abc')).toBe(MENSAJES.AMBIENTE_CAPACIDAD_INVALIDA);
  guardarIdSesionMock('usr-admin');
  const user = userEvent.setup();
  render(<MemoryRouter><AuthProvider><Ambientes /></AuthProvider></MemoryRouter>);
  await user.click(await screen.findByRole('button', { name: /nuevo ambiente/i }));
  const dialogo = screen.getByRole('dialog');
  await user.type(within(dialogo).getByLabelText(/^nombre/i), 'Laboratorio de IA 201');
  await user.selectOptions(within(dialogo).getByLabelText(/^tipo/i), 'Laboratorio de cómputo');
  await user.type(within(dialogo).getByLabelText(/^capacidad/i), '35');
  await user.type(within(dialogo).getByLabelText(/^ubicación/i), 'Pabellón D, 2do piso');
  await user.click(within(dialogo).getByRole('button', { name: /registrar ambiente/i }));
  expect(await screen.findByText('Laboratorio de IA 201')).toBeInTheDocument();
});
it('E-12 y E-13: reserva válida en Pendiente y campos vacíos impiden envío', async () => {
  guardarIdSesionMock('usr-solic');
  const alExito = vi.fn();
  const user = userEvent.setup();
  renderModalReserva(alExito);
  await user.click(screen.getByRole('button', { name: /registrar solicitud/i }));
  expect(await screen.findByText(MENSAJES.RESERVA_AMBIENTE_OBLIGATORIO)).toBeInTheDocument();
  await screen.findByRole('option', { name: /Laboratorio de Cómputo 101/i });
  await user.selectOptions(screen.getByLabelText(/^ambiente/i), 'amb-1');
  await user.type(screen.getByLabelText(/^fecha/i), '2027-05-20');
  await user.type(screen.getByLabelText(/hora de inicio/i), '08:00');
  await user.type(screen.getByLabelText(/hora de fin/i), '10:00');
  await user.type(screen.getByLabelText(/^motivo/i), 'Sesión de laboratorio de pruebas de software.');
  await user.click(screen.getByRole('button', { name: /registrar solicitud/i }));
  await vi.waitFor(() => expect(alExito).toHaveBeenCalledWith(MENSAJES.RESERVA_CREADA_EXITO, expect.objectContaining({ estado: 'Pendiente' })));
});
it('E-14, E-15 y E-16: validan fin <= inicio (RN-03), bordes 07:00–22:00 (RN-04) y fecha pasada', () => {
  expect(validarHorarioReserva('10:00', '10:00').horaFin).toBe(MENSAJES.RESERVA_FIN_MAYOR_INICIO);
  expect(validarHorarioReserva('12:00', '10:00').horaFin).toBe(MENSAJES.RESERVA_FIN_MAYOR_INICIO);
  expect(validarHorarioReserva('06:59', '08:00').horaFin).toBe(MENSAJES.RESERVA_FUERA_DE_HORARIO);
  expect(validarHorarioReserva('20:00', '22:01').horaFin).toBe(MENSAJES.RESERVA_FUERA_DE_HORARIO);
  expect(validarHorarioReserva('07:00', '22:00').horaFin).toBe('');
  expect(validarFechaReserva('2026-11-01', '2026-11-03')).toBe(MENSAJES.RESERVA_FECHA_PASADA);
  expect(validarFechaReserva('2026-11-03', '2026-11-03')).toBe('');
});
it('E-17: solape con reserva aprobada se rechaza y horario consecutivo es permitido', async () => {
  guardarIdSesionMock('usr-solic');
  const alExito = vi.fn();
  const user = userEvent.setup();
  renderModalReserva(alExito);
  await screen.findByRole('option', { name: /Laboratorio de Cómputo 101/i });
  await user.selectOptions(screen.getByLabelText(/^ambiente/i), 'amb-1');
  await user.type(screen.getByLabelText(/^fecha/i), '2026-11-15');
  await user.type(screen.getByLabelText(/hora de inicio/i), '11:00');
  await user.type(screen.getByLabelText(/hora de fin/i), '13:00');
  await user.type(screen.getByLabelText(/^motivo/i), 'Intento de horario con solape sobre reserva aprobada.');
  await user.click(screen.getByRole('button', { name: /registrar solicitud/i }));
  expect(await screen.findAllByText(MENSAJES.RESERVA_SOLAPE_HORARIO)).not.toHaveLength(0);
  fireEvent.change(screen.getByLabelText(/hora de inicio/i), { target: { value: '12:00' } });
  await user.click(screen.getByRole('button', { name: /registrar solicitud/i }));
  await vi.waitFor(() => expect(alExito).toHaveBeenCalled());
});
