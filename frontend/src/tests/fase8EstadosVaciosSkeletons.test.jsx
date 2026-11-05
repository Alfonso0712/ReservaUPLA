// Pruebas FASE 8: Estados vacíos contextuales, skeletons en tabla y soporte responsive
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TableList from '../components/ui/TableList';

describe('FASE 8: Estados vacíos, skeletons y responsive', () => {
  const columnas = [
    { clave: 'nombre', encabezado: 'Nombre' },
    { clave: 'tipo', encabezado: 'Tipo' }
  ];

  it('1. Skeletons de carga: 5 filas animate-pulse dentro de la tabla para CLS = 0', () => {
    const { container } = render(<TableList caption="Prueba" columnas={columnas} datos={[]} cargando />);
    const skeletons = container.querySelectorAll('tbody tr.animate-pulse');
    expect(skeletons.length).toBe(5);
    const celdas = skeletons[0].querySelectorAll('td');
    expect(celdas.length).toBe(2);
  });

  it('2. Estado vacío con filtros activos: SearchX y botón Limpiar filtros', () => {
    const fnLimpiar = vi.fn();
    render(
      <TableList
        caption="Prueba" columnas={columnas} datos={[]}
        esFiltroActivo alLimpiarFiltros={fnLimpiar}
      />
    );
    expect(screen.getByText('No se encontraron resultados para los filtros aplicados')).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /limpiar filtros/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(fnLimpiar).toHaveBeenCalledTimes(1);
  });

  it('3. Estado vacío general: mensaje contextual y acción primaria disponible', () => {
    render(
      <TableList
        caption="Prueba" columnas={columnas} datos={[]}
        mensajeVacio="No hay reservas registradas aún"
        accionVacia={<button type="button">Crear reserva</button>}
      />
    );
    expect(screen.getByText('No hay reservas registradas aún')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear reserva' })).toBeInTheDocument();
  });

  it('4. Soporte responsive: clase tabla-responsiva y celdas con data-label para card layout', () => {
    const datos = [{ id: 1, nombre: 'Auditorio', tipo: 'Principal' }];
    const { container } = render(<TableList caption="Prueba" columnas={columnas} datos={datos} />);

    expect(screen.getByRole('table')).toHaveClass('tabla-responsiva');
    const tdNombre = container.querySelector('tbody td[data-label="Nombre"]');
    expect(tdNombre).toHaveTextContent('Auditorio');
    const tdTipo = container.querySelector('tbody td[data-label="Tipo"]');
    expect(tdTipo).toHaveTextContent('Principal');
  });
});
