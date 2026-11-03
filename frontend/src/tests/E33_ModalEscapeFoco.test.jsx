import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalConfirmacion from '../components/ModalConfirmacion';

describe('Modal Accesible y Tecla Escape (E-33)', () => {
  it('E-33: Escape cierra el modal y devuelve el foco', async () => {
    const user = userEvent.setup();
    const alCancelar = vi.fn();
    const alConfirmar = vi.fn();

    // Boton disparador que abrio el modal
    const botonDisparador = document.createElement('button');
    botonDisparador.textContent = 'Abrir modal';
    document.body.appendChild(botonDisparador);
    botonDisparador.focus();

    const disparadorRef = { current: botonDisparador };

    const { unmount } = render(
      <ModalConfirmacion
        abierto={true}
        titulo="Confirmar Acción Crítica"
        mensaje="¿Está seguro de continuar?"
        alConfirmar={alConfirmar}
        alCancelar={alCancelar}
        disparadorRef={disparadorRef}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Presionar la tecla Escape
    await user.keyboard('{Escape}');

    expect(alCancelar).toHaveBeenCalledTimes(1);

    // Al desmontar (cerrar modal), el foco retorna al disparador
    unmount();
    expect(document.activeElement).toBe(botonDisparador);
    document.body.removeChild(botonDisparador);
  });
});
