// Pruebas FASE 2: Jerarquía de acciones por fila, botones icon-only y feedback
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MenuAccionesFila from '../components/ui/MenuAccionesFila';
import AccionesReserva from '../components/reservas/AccionesReserva';
import AccionesFilaAmbiente from '../components/ambientes/AccionesFilaAmbiente';
import ModalConfirmacion from '../components/ui/ModalConfirmacion';
import Toast from '../components/ui/Toast';
import { ESTADOS_RESERVA } from '../constants/estados';

describe('FASE 2: Jerarquía de acciones por fila', () => {
  it('1. MenuAccionesFila accesible: role menu, menuitem y cierre con Escape', () => {
    const fn = vi.fn();
    render(<MenuAccionesFila items={[{ etiqueta: 'Ver detalle', onClick: fn }]} />);
    const btn = screen.getByRole('button', { name: 'Más acciones' });
    expect(btn).toHaveAttribute('aria-haspopup', 'menu');
    fireEvent.click(btn);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('2. AccionesReserva: Pendiente tiene posiciones fijas [Detalle][Aprobar][Rechazar]', () => {
    const resPend = { id: 'r1', estado: ESTADOS_RESERVA.PENDIENTE, fecha: '2026-11-15', solicitante: { nombreCompleto: 'Juan' } };
    render(<MemoryRouter><AccionesReserva reserva={resPend} /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /ver detalle/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /aprobar reserva/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rechazar reserva/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /más acciones/i })).not.toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('3. AccionesReserva: Aprobada solo muestra Ver detalle y reserva espacios para alineación', () => {
    const resAprob = { id: 'r2', estado: ESTADOS_RESERVA.APROBADA, fecha: '2026-11-15', solicitante: { nombreCompleto: 'Maria' } };
    const { container } = render(<MemoryRouter><AccionesReserva reserva={resAprob} /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /ver detalle/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /más acciones/i })).not.toBeInTheDocument();
    const placeholders = container.querySelectorAll('div[aria-hidden="true"]');
    expect(placeholders.length).toBe(1);
  });

  it('4. AccionesFilaAmbiente: 2 botones icon-only visibles [Editar] y [Cambiar estado]', () => {
    const amb = { id: 'a1', nombre: 'Lab 1', estado: 'Disponible' };
    render(<AccionesFilaAmbiente ambiente={amb} puedeEditar puedeCambiarEstado alEditar={vi.fn()} alCambiarEstado={vi.fn()} />);
    expect(screen.getByRole('button', { name: /^editar$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /marcar como no disponible/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /más acciones/i })).not.toBeInTheDocument();
  });

  it('5. ModalConfirmacion exige motivo con contador (0/200); Toast expone estado accesible', () => {
    render(<ModalConfirmacion abierto titulo="Rechazar" requiereMotivo motivo="" etiquetaConfirmar="Rechazar reserva" />);
    expect(screen.getByLabelText(/motivo/i)).toBeInTheDocument();
    expect(screen.getByText('0/200')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument();

    render(<Toast toasts={[{ id: 1, tipo: 'exito', mensaje: 'Reserva aprobada' }]} alCerrar={vi.fn()} />);
    expect(screen.getByRole('status')).toHaveTextContent('Reserva aprobada');
  });
});
