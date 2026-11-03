import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistroSolicitantePage from '../pages/RegistroSolicitantePage';
import { usuarioService } from '../services/usuarioService';

describe('Registro de Solicitante (E-01, E-02, E-03)', () => {
  it('E-01: registro de solicitante con datos correctos', async () => {
    const user = userEvent.setup();
    const alRegistrarExitoso = vi.fn();
    vi.spyOn(usuarioService, 'registrarSolicitante').mockResolvedValue({
      ok: true,
      estado: 201,
      datos: { id: 'user-1', nombreCompleto: 'Carlos Perez', correo: 'carlos@upla.edu.pe' }
    });

    render(<RegistroSolicitantePage alRegistrarExitoso={alRegistrarExitoso} alIrALogin={vi.fn()} />);

    await user.type(screen.getByLabelText(/Nombre completo/i), 'Carlos Perez');
    await user.type(screen.getByLabelText(/Correo institucional/i), 'carlos@upla.edu.pe');
    await user.type(screen.getByLabelText(/^Contraseña/i), 'ClaveSegura123*');
    await user.click(screen.getByRole('button', { name: /Registrarse/i }));

    await waitFor(() => {
      expect(alRegistrarExitoso).toHaveBeenCalledTimes(1);
    });
  });

  it('E-02: campos vacíos en registro', async () => {
    const user = userEvent.setup();
    const registrarSpy = vi.spyOn(usuarioService, 'registrarSolicitante');

    render(<RegistroSolicitantePage alRegistrarExitoso={vi.fn()} alIrALogin={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /Registrarse/i }));

    expect(await screen.findByText(/El nombre es obligatorio/i)).toBeInTheDocument();
    expect(registrarSpy).not.toHaveBeenCalled();
  });

  it('E-03: correo con formato incorrecto', async () => {
    const user = userEvent.setup();
    const registrarSpy = vi.spyOn(usuarioService, 'registrarSolicitante');

    render(<RegistroSolicitantePage alRegistrarExitoso={vi.fn()} alIrALogin={vi.fn()} />);

    await user.type(screen.getByLabelText(/Nombre completo/i), 'Carlos Perez');
    await user.type(screen.getByLabelText(/Correo institucional/i), 'correo-invalido-sin-arroba');
    await user.type(screen.getByLabelText(/^Contraseña/i), 'ClaveSegura123*');
    await user.click(screen.getByRole('button', { name: /Registrarse/i }));

    expect(await screen.findByText(/El correo electrónico no tiene un formato válido/i)).toBeInTheDocument();
    expect(registrarSpy).not.toHaveBeenCalled();
  });
});
