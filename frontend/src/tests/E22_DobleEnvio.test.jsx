import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../pages/LoginPage';
import { authService } from '../services/authService';

describe('Prevención de Doble Envío (E-22)', () => {
  it('E-22: doble envío realiza una sola petición', async () => {
    const user = userEvent.setup();
    let resolverPeticion;
    const promesaDemorada = new Promise((resolve) => {
      resolverPeticion = resolve;
    });

    const loginSpy = vi.spyOn(authService, 'login').mockReturnValue(promesaDemorada);

    const alEnviar = vi.fn();
    const { rerender } = render(
      <LoginPage
        correo="admin@upla.edu.pe"
        alCambiarCorreo={vi.fn()}
        contrasena="Admin123*"
        alCambiarContrasena={vi.fn()}
        recordarCorreo={false}
        alCambiarRecordarCorreo={vi.fn()}
        alEnviar={alEnviar}
        cargando={false}
        error=""
        bloqMayusActivo={false}
        alVerificarBloqMayus={vi.fn()}
        alIrARegistro={vi.fn()}
      />
    );

    const boton = screen.getByRole('button', { name: /Iniciar sesión/i });
    await user.click(boton);
    expect(alEnviar).toHaveBeenCalledTimes(1);

    // Simulando estado cargando durante la peticion en vuelo
    rerender(
      <LoginPage
        correo="admin@upla.edu.pe"
        alCambiarCorreo={vi.fn()}
        contrasena="Admin123*"
        alCambiarContrasena={vi.fn()}
        recordarCorreo={false}
        alCambiarRecordarCorreo={vi.fn()}
        alEnviar={alEnviar}
        cargando={true}
        error=""
        bloqMayusActivo={false}
        alVerificarBloqMayus={vi.fn()}
        alIrARegistro={vi.fn()}
      />
    );

    // Segundo click intentado mientras esta procesando
    await user.click(boton);

    // Debe seguir siendo 1 sola peticion
    expect(alEnviar).toHaveBeenCalledTimes(1);

    resolverPeticion?.({ ok: true, estado: 200, datos: {} });
    expect(loginSpy).toBeDefined();
  });
});
