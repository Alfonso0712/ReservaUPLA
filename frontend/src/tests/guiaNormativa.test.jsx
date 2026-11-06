// Pruebas unitarias de accesibilidad y comportamiento para Guía y normativa de ambientes
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/navegacion/Header';
import { AuthProvider } from '../hooks/useAuth';
import { PreferenciasProvider } from '../context/PreferenciasContext';
import { reiniciarBaseMock, guardarIdSesionMock } from '../mocks/baseDatosMock';

beforeEach(() => { reiniciarBaseMock(); sessionStorage.clear(); localStorage.clear(); });

const renderCabecera = () => render(
  <MemoryRouter><AuthProvider><PreferenciasProvider><Header /></PreferenciasProvider></AuthProvider></MemoryRouter>
);

describe('Guía y normativa de ambientes en cabecera', () => {
  it('abre el modal con botón Guía, verifica dialog, cierra con Esc y devuelve foco', async () => {
    guardarIdSesionMock('usr-admin');
    const user = userEvent.setup();
    renderCabecera();
    const btnGuia = screen.getByRole('button', { name: /guía/i });
    expect(btnGuia).toBeInTheDocument();
    expect(btnGuia).toHaveAttribute('aria-haspopup', 'dialog');
    await user.click(btnGuia);

    const dlg = screen.getByRole('dialog', { name: /guía y normativa de ambientes/i });
    expect(dlg).toBeInTheDocument();
    expect(dlg).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText(/reglas de reserva de ambientes upla/i)).toBeInTheDocument();
    expect(screen.getByText(/antes de solicitar un ambiente, revise las reglas que aplica el sistema/i)).toBeInTheDocument();
    expect(screen.getByText(/las reservas solo pueden hacerse entre las 07:00 y las 22:00 horas/i)).toBeInTheDocument();
    expect(screen.getByText(/la hora de fin debe ser posterior a la hora de inicio/i)).toBeInTheDocument();
    expect(screen.getByText(/no puede existir más de una reserva aprobada para el mismo ambiente/i)).toBeInTheDocument();
    expect(screen.getByText(/toda solicitud debe indicar fecha, hora de inicio, hora de fin/i)).toBeInTheDocument();
    expect(screen.getByText(/solo el administrador puede aprobar o rechazar una reserva/i)).toBeInTheDocument();
    expect(screen.getByText(/una reserva rechazada no puede modificarse/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cerrar guía/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entendido/i })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(btnGuia);
  });

  it('cierra modal con Entendido, con X y con clic en fondo oscuro', async () => {
    guardarIdSesionMock('usr-admin');
    const user = userEvent.setup();
    renderCabecera();
    const btn = screen.getByRole('button', { name: /guía/i });

    await user.click(btn);
    await user.click(screen.getByRole('button', { name: /entendido/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(btn);

    await user.click(btn);
    await user.click(screen.getByRole('button', { name: /cerrar guía/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(btn);

    await user.click(btn);
    const fondo = screen.getByRole('dialog').parentElement;
    fireEvent.click(fondo);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(btn);
  });
});
