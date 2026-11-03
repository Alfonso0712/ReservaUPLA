import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../pages/LoginPage';
import { authService } from '../services/authService';
import { MENSAJES } from '../constants/mensajes';

describe('Servidor Apagado (E-23)', () => {
  it('E-23: servidor apagado (estado 0, mensaje y datos conservados)', async () => {
    const user = userEvent.setup();
    vi.spyOn(authService, 'login').mockResolvedValue({
      ok: false,
      estado: 0,
      datos: { error: MENSAJES.ERROR_CONEXION }
    });

    let correoValor = 'docente@upla.edu.pe';
    let claveValor = 'ClaveDocente123*';

    const { rerender } = render(
      <LoginPage
        correo={correoValor}
        alCambiarCorreo={(v) => { correoValor = v; }}
        contrasena={claveValor}
        alCambiarContrasena={(v) => { claveValor = v; }}
        recordarCorreo={false}
        alCambiarRecordarCorreo={vi.fn()}
        alEnviar={vi.fn()}
        cargando={false}
        error=""
        bloqMayusActivo={false}
        alVerificarBloqMayus={vi.fn()}
        alIrARegistro={vi.fn()}
      />
    );

    const inputCorreo = screen.getByLabelText(/Correo institucional/i);
    const inputClave = screen.getByLabelText(/^Contraseña/i);
    expect(inputCorreo).toHaveValue('docente@upla.edu.pe');
    expect(inputClave).toHaveValue('ClaveDocente123*');

    await user.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    // Simula renderizado tras recibir estado 0
    rerender(
      <LoginPage
        correo={correoValor}
        alCambiarCorreo={vi.fn()}
        contrasena={claveValor}
        alCambiarContrasena={vi.fn()}
        recordarCorreo={false}
        alCambiarRecordarCorreo={vi.fn()}
        alEnviar={vi.fn()}
        cargando={false}
        error={MENSAJES.ERROR_CONEXION}
        bloqMayusActivo={false}
        alVerificarBloqMayus={vi.fn()}
        alIrARegistro={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/No se pudo conectar con el servidor/i);
    });

    // Los datos introducidos por el usuario se conservan intactos
    expect(screen.getByLabelText(/Correo institucional/i)).toHaveValue('docente@upla.edu.pe');
    expect(screen.getByLabelText(/^Contraseña/i)).toHaveValue('ClaveDocente123*');
  });
});
