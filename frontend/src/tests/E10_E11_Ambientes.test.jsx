import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AmbientesPage from '../pages/AmbientesPage';
import { ambienteService } from '../services/ambienteService';

describe('Gestión de Ambientes (E-10, E-11)', () => {
  it('E-10: registro de ambiente correcto', async () => {
    const user = userEvent.setup();
    vi.spyOn(ambienteService, 'listarAmbientes').mockResolvedValue({
      ok: true, estado: 200, datos: []
    });
    const crearSpy = vi.spyOn(ambienteService, 'crearAmbiente').mockResolvedValue({
      ok: true, estado: 201, datos: { id: 'amb-1', nombre: 'Auditorio Magna' }
    });

    render(<AmbientesPage esAdmin={true} />);

    await user.type(screen.getByLabelText(/^Nombre/i), 'Auditorio Magna');
    await user.selectOptions(screen.getByLabelText(/^Tipo/i), 'Auditorio');
    await user.type(screen.getByLabelText(/Capacidad/i), '150');
    await user.type(screen.getByLabelText(/Ubicación/i), 'Pabellon A - Piso 3');
    await user.click(screen.getByRole('button', { name: /Registrar Ambiente/i }));

    await waitFor(() => {
      expect(crearSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('E-11: capacidad 0, negativa y no numérica', async () => {
    const user = userEvent.setup();
    vi.spyOn(ambienteService, 'listarAmbientes').mockResolvedValue({
      ok: true, estado: 200, datos: []
    });
    const crearSpy = vi.spyOn(ambienteService, 'crearAmbiente');

    render(<AmbientesPage esAdmin={true} />);

    await user.type(screen.getByLabelText(/^Nombre/i), 'Lab Invalido');
    await user.selectOptions(screen.getByLabelText(/^Tipo/i), 'LaboratorioComputo');
    await user.type(screen.getByLabelText(/Capacidad/i), '0');
    await user.type(screen.getByLabelText(/Ubicación/i), 'Pabellon B');
    await user.click(screen.getByRole('button', { name: /Registrar Ambiente/i }));

    expect(await screen.findByText(/La capacidad debe ser un número entero entre 1 y 1000/i)).toBeInTheDocument();
    expect(crearSpy).not.toHaveBeenCalled();
  });
});
