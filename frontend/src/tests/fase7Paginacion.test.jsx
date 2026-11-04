// Pruebas FASE 7: Paginación accesible con selector 10/20/50, números y estado unificado
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PaginacionTabla from '../components/ui/PaginacionTabla';

describe('FASE 7: Paginación completa y accesible', () => {
  it('1. Texto de estado unificado y selector de tamaño 10, 20, 50 por página', () => {
    const fnTam = vi.fn();
    render(<PaginacionTabla paginaActual={1} totalPaginas={4} totalRegistros={34} tamanoPagina={10} alCambiarTamanoPagina={fnTam} />);

    expect(screen.getByText('Mostrando 1–10 de 34 registros')).toBeInTheDocument();
    const select = screen.getByRole('combobox', { name: /registros por página/i });
    expect(select).toHaveValue('10');
    fireEvent.change(select, { target: { value: '20' } });
    expect(fnTam).toHaveBeenCalledWith(20);
  });

  it('2. Controles Anterior/Siguiente: deshabilitado visual y con aria-disabled en extremos', () => {
    const fnPag = vi.fn();
    const { rerender } = render(
      <PaginacionTabla paginaActual={1} totalPaginas={3} totalRegistros={25} tamanoPagina={10} alCambiarPagina={fnPag} />
    );
    const btnAnt = screen.getByRole('button', { name: /página anterior/i });
    const btnSig = screen.getByRole('button', { name: /página siguiente/i });

    expect(btnAnt).toBeDisabled();
    expect(btnAnt).toHaveAttribute('aria-disabled', 'true');
    expect(btnSig).not.toBeDisabled();

    fireEvent.click(btnSig);
    expect(fnPag).toHaveBeenCalledWith(2);

    rerender(
      <PaginacionTabla paginaActual={3} totalPaginas={3} totalRegistros={25} tamanoPagina={10} alCambiarPagina={fnPag} />
    );
    expect(screen.getByRole('button', { name: /página siguiente/i })).toBeDisabled();
  });

  it('3. Números de página con formato estándar y aria-current="page" en activa', () => {
    const fnPag = vi.fn();
    render(<PaginacionTabla paginaActual={2} totalPaginas={5} totalRegistros={50} tamanoPagina={10} alCambiarPagina={fnPag} />);

    const btnPag2 = screen.getByRole('button', { name: '2' });
    expect(btnPag2).toHaveAttribute('aria-current', 'page');
    expect(btnPag2.className).toContain('bg-primario');

    const btnPag3 = screen.getByRole('button', { name: '3' });
    expect(btnPag3).not.toHaveAttribute('aria-current');
    fireEvent.click(btnPag3);
    expect(fnPag).toHaveBeenCalledWith(3);
  });

  it('4. Si hay <= 1 página oculta botones de navegación pero conserva texto de estado', () => {
    render(<PaginacionTabla paginaActual={1} totalPaginas={1} totalRegistros={4} tamanoPagina={10} />);

    expect(screen.getByText('Mostrando 1–4 de 4 registros')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /página anterior/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /página siguiente/i })).not.toBeInTheDocument();
  });
});
