import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NuevaReservaPage from '../pages/NuevaReservaPage';
import { ambienteService } from '../services/ambienteService';
import { reservaService } from '../services/reservaService';

describe('Formulario de Reserva (E-12, E-13)', () => {
  it('E-12: reserva correcta', async () => {
    const user = userEvent.setup();
    const alCrearExitoso = vi.fn();
    vi.spyOn(ambienteService, 'listarAmbientes').mockResolvedValue({
      ok: true,
      estado: 200,
      datos: [{ id: 'amb-1', nombre: 'Lab 101', ubicacion: 'Pabellon B', estado: 'Disponible' }]
    });
    vi.spyOn(ambienteService, 'consultarDisponibilidad').mockResolvedValue({
      ok: true, estado: 200, datos: { reservas: [] }
    });
    const crearSpy = vi.spyOn(reservaService, 'crearReserva').mockResolvedValue({
      ok: true, estado: 201, datos: { id: 'res-1' }
    });

    render(<NuevaReservaPage alCrearExitoso={alCrearExitoso} />);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /Lab 101/i })).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByLabelText(/Ambiente universitario/i), 'amb-1');
    await user.clear(screen.getByLabelText(/Motivo/i));
    await user.type(screen.getByLabelText(/Motivo/i), 'Clase magistral de ingenieria de software');
    await user.click(screen.getByRole('button', { name: /Registrar Solicitud/i }));

    await waitFor(() => {
      expect(crearSpy).toHaveBeenCalledTimes(1);
      expect(alCrearExitoso).toHaveBeenCalledTimes(1);
    });
  });

  it('E-13: reserva con campos vacíos', async () => {
    const user = userEvent.setup();
    vi.spyOn(ambienteService, 'listarAmbientes').mockResolvedValue({
      ok: true, estado: 200, datos: []
    });
    const crearSpy = vi.spyOn(reservaService, 'crearReserva');

    render(<NuevaReservaPage alCrearExitoso={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /Registrar Solicitud/i }));

    expect(await screen.findByText(/El ambiente seleccionado no existe/i)).toBeInTheDocument();
    expect(crearSpy).not.toHaveBeenCalled();
  });
});
