// Pruebas FASE 6: Filtros integrados, debounce, estilos unificados y feedback
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from '../components/formulario/TextInput';
import SelectInput from '../components/formulario/SelectInput';
import FiltrosReservas from '../components/reservas/FiltrosReservas';
import FiltrosAmbientes from '../components/ambientes/FiltrosAmbientes';

describe('FASE 6: Filtros integrados y accesibles', () => {
  it('1. Inputs y selects tienen altura estándar de 40px (h-10) y no muestran (opcional)', () => {
    const { container: cIn } = render(<TextInput etiqueta="Buscar" nombre="b" obligatorio={false} tipo="search" alCambiar={vi.fn()} />);
    const input = cIn.querySelector('input');
    expect(input.className).toContain('h-10');
    expect(input.className).toContain('bg-superficie');
    expect(input.className).toContain('border-borde');
    expect(input.className).toContain('pl-9');
    expect(cIn.querySelector('svg')).toBeInTheDocument();
    expect(cIn.textContent).not.toContain('(opcional)');

    const { container: cSel } = render(<SelectInput etiqueta="Tipo" nombre="t" obligatorio={false} opciones={['A']} />);
    const select = cSel.querySelector('select');
    expect(select.className).toContain('h-10');
    expect(select.className).toContain('bg-superficie');
    expect(cSel.textContent).not.toContain('(opcional)');
  });

  it('2. Contador de resultados en vivo con role="status" y aria-live="polite"', () => {
    render(<FiltrosReservas totalResultados={5} alCambiarTexto={vi.fn()} alCambiarTipo={vi.fn()} alLimpiar={vi.fn()} />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('5 reservas encontradas');
  });

  it('3. Botón "Limpiar filtros" visible solo cuando hay filtros activos', () => {
    const fnLimpiar = vi.fn();
    const { rerender } = render(
      <FiltrosAmbientes texto="" tipo="" totalResultados={4} alCambiarTexto={vi.fn()} alCambiarTipo={vi.fn()} alLimpiar={fnLimpiar} />
    );
    expect(screen.queryByRole('button', { name: /limpiar filtros/i })).not.toBeInTheDocument();

    rerender(
      <FiltrosAmbientes texto="Lab" tipo="" totalResultados={1} alCambiarTexto={vi.fn()} alCambiarTipo={vi.fn()} alLimpiar={fnLimpiar} />
    );
    const btn = screen.getByRole('button', { name: /limpiar filtros/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('hover:bg-superficie-2');
    fireEvent.click(btn);
    expect(fnLimpiar).toHaveBeenCalledTimes(1);
  });

  it('4. FiltrosReservas: búsqueda por solicitante/ambiente y botón limpiar con estado', () => {
    const fnLimpiar = vi.fn();
    render(<FiltrosReservas texto="" estado="Pendiente" tipo="" totalResultados={2} alLimpiar={fnLimpiar} />);
    expect(screen.getByRole('button', { name: /limpiar filtros/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/solicitante o ambiente/i)).toBeInTheDocument();
  });
});
