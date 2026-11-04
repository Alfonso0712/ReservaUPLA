// Pruebas automatizadas E-10 a E-17: Ambientes, solicitudes de reserva y disponibilidad
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import Ambientes from '../pages/Ambientes';
import FormularioReserva from '../components/reservas/FormularioReserva';
import { reiniciarBaseMock, guardarIdSesionMock } from '../mocks/baseDatosMock';
import { validarCapacidadAmbiente, validarHorarioReserva, validarFechaReserva } from '../validation/validadores';
import { MENSAJES } from '../constants/mensajes';

beforeEach(() => {
  reiniciarBaseMock();
  sessionStorage.clear();
  localStorage.clear();
});

describe('Ambientes y reservas (RF-02..04 · RN-01..04 · E-10..17)', () => {
  it('E-10: ambiente correcto se registra y aparece en la tabla', async () => {
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

  it('E-11: capacidad 0, negativa y no numérica es rechazada por el validador', () => {
    expect(validarCapacidadAmbiente('0')).toBe(MENSAJES.AMBIENTE_CAPACIDAD_INVALIDA);
    expect(validarCapacidadAmbiente('-15')).toBe(MENSAJES.AMBIENTE_CAPACIDAD_INVALIDA);
    expect(validarCapacidadAmbiente('abc')).toBe(MENSAJES.AMBIENTE_CAPACIDAD_INVALIDA);
  });

  it('E-12: reserva correcta registra solicitud en estado Pendiente', async () => {
    guardarIdSesionMock('usr-solic');
    const alExito = vi.fn();
    const user = userEvent.setup();
    render(<MemoryRouter><AuthProvider><FormularioReserva abierto alCerrar={() => {}} alExito={alExito} /></AuthProvider></MemoryRouter>);
    await screen.findByRole('option', { name: /Laboratorio de Cómputo 101/i });
    await user.selectOptions(screen.getByLabelText(/^ambiente/i), 'amb-1');
    await user.type(screen.getByLabelText(/^fecha/i), '2027-05-20');
    await user.type(screen.getByLabelText(/hora de inicio/i), '08:00');
    await user.type(screen.getByLabelText(/hora de fin/i), '10:00');
    await user.type(screen.getByLabelText(/^motivo/i), 'Sesión de laboratorio de pruebas de software.');
    await user.click(screen.getByRole('button', { name: /registrar solicitud/i }));
    await vi.waitFor(() => expect(alExito).toHaveBeenCalledWith(MENSAJES.RESERVA_CREADA_EXITO, expect.objectContaining({ estado: 'Pendiente' })));
  });

  it('E-13: reserva con campos vacíos impide el envío y muestra mensajes por campo', async () => {
    guardarIdSesionMock('usr-solic');
    const user = userEvent.setup();
    render(<MemoryRouter><AuthProvider><FormularioReserva abierto alCerrar={() => {}} alExito={() => {}} /></AuthProvider></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /registrar solicitud/i }));
    expect(await screen.findByText(MENSAJES.RESERVA_AMBIENTE_OBLIGATORIO)).toBeInTheDocument();
    expect(screen.getByText(MENSAJES.RESERVA_FECHA_OBLIGATORIA)).toBeInTheDocument();
  });

  it('E-14: fin <= inicio muestra error de validación RN-03', () => {
    expect(validarHorarioReserva('10:00', '10:00').horaFin).toBe(MENSAJES.RESERVA_FIN_MAYOR_INICIO);
    expect(validarHorarioReserva('12:00', '10:00').horaFin).toBe(MENSAJES.RESERVA_FIN_MAYOR_INICIO);
  });

  it('E-15: fuera de 07:00–22:00 en ambos bordes es rechazado por RN-04', () => {
    expect(validarHorarioReserva('06:59', '08:00').horaFin).toBe(MENSAJES.RESERVA_FUERA_DE_HORARIO);
    expect(validarHorarioReserva('20:00', '22:01').horaFin).toBe(MENSAJES.RESERVA_FUERA_DE_HORARIO);
    expect(validarHorarioReserva('07:00', '22:00').horaFin).toBe('');
  });

  it('E-16: fecha pasada es rechazada frente a la fecha actual', () => {
    expect(validarFechaReserva('2026-11-01', '2026-11-03')).toBe(MENSAJES.RESERVA_FECHA_PASADA);
    expect(validarFechaReserva('2026-11-03', '2026-11-03')).toBe('');
  });

  it('E-17: solape con reserva aprobada se rechaza y horario consecutivo es permitido', async () => {
    guardarIdSesionMock('usr-solic');
    const alExito = vi.fn();
    const user = userEvent.setup();
    render(<MemoryRouter><AuthProvider><FormularioReserva abierto alCerrar={() => {}} alExito={alExito} /></AuthProvider></MemoryRouter>);
    await screen.findByRole('option', { name: /Laboratorio de Cómputo 101/i });
    await user.selectOptions(screen.getByLabelText(/^ambiente/i), 'amb-1');
    await user.type(screen.getByLabelText(/^fecha/i), '2026-11-15');
    await user.type(screen.getByLabelText(/hora de inicio/i), '11:00');
    await user.type(screen.getByLabelText(/hora de fin/i), '13:00');
    await user.type(screen.getByLabelText(/^motivo/i), 'Intento de horario con solape sobre reserva aprobada.');
    await user.click(screen.getByRole('button', { name: /registrar solicitud/i }));
    expect(await screen.findAllByText(MENSAJES.RESERVA_SOLAPE_HORARIO)).not.toHaveLength(0);
    await user.clear(screen.getByLabelText(/hora de inicio/i));
    await user.type(screen.getByLabelText(/hora de inicio/i), '12:00');
    await user.click(screen.getByRole('button', { name: /registrar solicitud/i }));
    await vi.waitFor(() => expect(alExito).toHaveBeenCalled());
  });
});
