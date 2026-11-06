// WCAG 2.2 AA · ISO 9241-110 · Paginación por defecto de 5 registros en Reservas
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import ListadoReservas from '../pages/ListadoReservas';
import { dbMock, reiniciarBaseMock, guardarIdSesionMock } from '../mocks/baseDatosMock';
import { ESTADOS_RESERVA } from '../constants/estados';
import { TIPOS_AMBIENTE } from '../constants/tiposAmbiente';

describe('Paginación en tabla de Reservas', () => {
  beforeEach(() => {
    reiniciarBaseMock();
    sessionStorage.clear();
    localStorage.clear();
    guardarIdSesionMock('usr-admin');
    dbMock.reservas.push(
      { id: 'res-6', fecha: '2026-11-20', horaInicio: '10:00', horaFin: '12:00', motivo: 'Sustentación de tesis de software.', estado: ESTADOS_RESERVA.PENDIENTE, solicitante: { id: 'usr-solic', nombreCompleto: 'Marco Paredes Castro', correo: 'solicitante@upla.edu.pe' }, ambiente: { id: 'amb-1', nombre: 'Laboratorio de Cómputo 101', tipo: TIPOS_AMBIENTE.LABORATORIO_COMPUTO }, fechaRegistro: '2026-11-04T09:00:00Z' },
      { id: 'res-7', fecha: '2026-11-21', horaInicio: '14:00', horaFin: '16:00', motivo: 'Taller de arquitectura hexagonal.', estado: ESTADOS_RESERVA.PENDIENTE, solicitante: { id: 'usr-solic', nombreCompleto: 'Marco Paredes Castro', correo: 'solicitante@upla.edu.pe' }, ambiente: { id: 'amb-2', nombre: 'Auditorio Central UPLA', tipo: TIPOS_AMBIENTE.AUDITORIO }, fechaRegistro: '2026-11-04T10:00:00Z' }
    );
  });

  it('muestra 5 registros por defecto y se expande al seleccionar 10 / pág.', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/reservas?estado=']}><AuthProvider><ListadoReservas /></AuthProvider></MemoryRouter>);

    expect(await screen.findByText('Mostrando 1–5 de 7 registros')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(6);

    const selector = screen.getByRole('combobox', { name: /registros por página/i });
    expect(selector).toHaveValue('5');
    expect(screen.getByRole('option', { name: '5 / pág.' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '10 / pág.' })).toBeInTheDocument();

    await user.selectOptions(selector, '10');

    expect(await screen.findByText('Mostrando 1–7 de 7 registros')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(8);
  });
});
