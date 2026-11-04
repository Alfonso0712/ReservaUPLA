// Pruebas FASE 2: Jerarquía de acciones por fila, menú desplegable y toast
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
    const item = screen.getByRole('menuitem', { name: 'Ver detalle' });
    expect(item).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('2. AccionesReserva: Pendiente tiene max 2 botones (Aprobar/Rechazar) + 1 menú ⋯', () => {
    const resPend = { id: 'r1', estado: ESTADOS_RESERVA.PENDIENTE, fecha: '2026-11-15' };
    render(<MemoryRouter><AccionesReserva reserva={resPend} /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /aprobar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rechazar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /más acciones/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('3. AccionesReserva: Aprobada tiene Cancelar + menú ⋯; Rechazada solo menú ⋯ sin Estado final', () => {
    const resAprob = { id: 'r2', estado: ESTADOS_RESERVA.APROBADA, fecha: '2026-11-15' };
    const { rerender } = render(<MemoryRouter><AccionesReserva reserva={resAprob} /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /más acciones/i })).toBeInTheDocument();

    const resRech = { id: 'r3', estado: ESTADOS_RESERVA.RECHAZADA, fecha: '2026-11-15' };
    rerender(<MemoryRouter><AccionesReserva reserva={resRech} /></MemoryRouter>);
    expect(screen.queryByRole('button', { name: /aprobar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /rechazar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/estado final/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /más acciones/i })).toBeInTheDocument();
  });

  it('4. AccionesFilaAmbiente: Admin muestra icon-only Editar con tooltip + menú ⋯ Cambiar estado', () => {
    const amb = { id: 'a1', nombre: 'Lab 1', estado: 'Disponible' };
    render(<AccionesFilaAmbiente ambiente={amb} puedeEditar={true} puedeCambiarEstado={true} alEditar={vi.fn()} alCambiarEstado={vi.fn()} />);
    const btnEditar = screen.getByRole('button', { name: 'Editar' });
    expect(btnEditar).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Más acciones para Lab 1' })).toBeInTheDocument();
  });

  it('5. ModalConfirmacion exige motivo con contador (0/200); Toast expone estado accesible', () => {
    render(<ModalConfirmacion abierto={true} titulo="Rechazar" requiereMotivo={true} motivo="" etiquetaConfirmar="Rechazar reserva" />);
    expect(screen.getByLabelText(/motivo/i)).toBeInTheDocument();
    expect(screen.getByText('0/200')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument();

    render(<Toast toasts={[{ id: 1, tipo: 'exito', mensaje: 'Reserva aprobada' }]} alCerrar={vi.fn()} />);
    expect(screen.getByRole('status')).toHaveTextContent('Reserva aprobada');
  });
});
