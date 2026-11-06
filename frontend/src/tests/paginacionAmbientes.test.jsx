// WCAG 2.2 AA · ISO 9241-110 · Paginación por defecto de 5 registros en Ambientes
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import Ambientes from '../pages/Ambientes';
import { dbMock, reiniciarBaseMock, guardarIdSesionMock } from '../mocks/baseDatosMock';
import { TIPOS_AMBIENTE } from '../constants/tiposAmbiente';
import { ESTADOS_AMBIENTE } from '../constants/estados';

describe('Paginación en tabla de Ambientes', () => {
  beforeEach(() => {
    reiniciarBaseMock();
    sessionStorage.clear();
    localStorage.clear();
    guardarIdSesionMock('usr-admin');
    dbMock.ambientes.push(
      { id: 'amb-5', nombre: 'Ambiente Extra 5', tipo: TIPOS_AMBIENTE.AULA_COMUN, capacidad: 30, ubicacion: 'Pabellón A', estado: ESTADOS_AMBIENTE.DISPONIBLE, responsableId: '', responsableNombre: 'Sin asignar' },
      { id: 'amb-6', nombre: 'Ambiente Extra 6', tipo: TIPOS_AMBIENTE.AULA_COMUN, capacidad: 30, ubicacion: 'Pabellón A', estado: ESTADOS_AMBIENTE.DISPONIBLE, responsableId: '', responsableNombre: 'Sin asignar' },
      { id: 'amb-7', nombre: 'Ambiente Extra 7', tipo: TIPOS_AMBIENTE.AULA_COMUN, capacidad: 30, ubicacion: 'Pabellón A', estado: ESTADOS_AMBIENTE.DISPONIBLE, responsableId: '', responsableNombre: 'Sin asignar' }
    );
  });

  it('muestra 5 registros por defecto y se expande al seleccionar 10 / pág.', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><AuthProvider><Ambientes /></AuthProvider></MemoryRouter>);

    expect(await screen.findByText('Mostrando 1–5 de 7 registros')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(6);

    const selector = screen.getByRole('combobox', { name: /registros por página/i });
    expect(selector).toHaveValue('5');
    expect(screen.getByRole('option', { name: '5 / pág.' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '10 / pág.' })).toBeInTheDocument();

    await user.selectOptions(selector, '10');

    expect(await screen.findByText('Mostrando 1–7 de 7 registros')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(8);
  });
});
