// Pruebas FASE 4: Tipografía, alineación, ordenación y estructura de tabla
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TableList from '../components/ui/TableList';

describe('FASE 4: Tipografía, alineación y estructura de tabla', () => {
  const columnas = [
    { clave: 'nombre', encabezado: 'Nombre', ordenable: true },
    { clave: 'capacidad', encabezado: 'Capacidad', ordenable: true, claseEncabezado: 'text-right' }
  ];
  const datos = [
    { id: 1, nombre: 'Beta', capacidad: 40 },
    { id: 2, nombre: 'Alfa', capacidad: 100 }
  ];

  it('1. Estructura semántica: table, caption sr-only, thead sticky y align-middle', () => {
    const { container } = render(<TableList caption="Catálogo" columnas={columnas} datos={datos} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(container.querySelector('caption')).toHaveClass('sr-only');
    expect(container.querySelector('thead')).toHaveClass('bg-superficie-2', 'border-b');
    const celdas = container.querySelectorAll('tbody td');
    celdas.forEach((c) => expect(c.className).toContain('align-middle'));
  });

  it('2. Filas tienen altura uniforme (56-64px) y hover claro', () => {
    const { container } = render(<TableList caption="Catálogo" columnas={columnas} datos={datos} />);
    const fila = container.querySelector('tbody tr');
    expect(fila.className).toContain('h-14');
    expect(fila.className).toContain('hover:bg-superficie-2');
  });

  it('3. Columnas ordenables: aria-sort dinámico y flecha visible solo en activa', () => {
    const { container } = render(<TableList caption="Catálogo" columnas={columnas} datos={datos} />);
    const thNombre = container.querySelectorAll('thead th')[0];
    const thCapacidad = container.querySelectorAll('thead th')[1];

    expect(thNombre).toHaveAttribute('aria-sort', 'none');
    expect(thCapacidad).toHaveAttribute('aria-sort', 'none');
    expect(thNombre.querySelector('svg')).not.toBeInTheDocument();

    const btnOrdenar = screen.getByRole('button', { name: 'Ordenar por Nombre' });
    fireEvent.click(btnOrdenar);
    expect(thNombre).toHaveAttribute('aria-sort', 'ascending');
    expect(thNombre.querySelector('svg')).toBeInTheDocument();
    expect(thCapacidad.querySelector('svg')).not.toBeInTheDocument();

    const filasAsc = container.querySelectorAll('tbody tr td:first-child');
    expect(filasAsc[0]).toHaveTextContent('Alfa');
    expect(filasAsc[1]).toHaveTextContent('Beta');

    fireEvent.click(btnOrdenar);
    expect(thNombre).toHaveAttribute('aria-sort', 'descending');
    const filasDesc = container.querySelectorAll('tbody tr td:first-child');
    expect(filasDesc[0]).toHaveTextContent('Beta');
    expect(filasDesc[1]).toHaveTextContent('Alfa');
  });

  it('4. Tipografía en encabezados y celdas sigue escala y colores atenuados', () => {
    const { container } = render(<TableList caption="Catálogo" columnas={columnas} datos={datos} />);
    const th = container.querySelector('thead th');
    expect(th.className).toContain('text-[0.8125rem]');
    expect(th.className).toContain('text-texto-suave');
    const td = container.querySelector('tbody td');
    expect(td.className).toContain('text-[0.9375rem]');
  });
});
