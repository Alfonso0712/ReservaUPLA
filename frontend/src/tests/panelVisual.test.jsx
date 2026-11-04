// Pruebas E-50 a E-54: Rediseño visual del panel y navegación
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import CardIndicador from '../components/ui/CardIndicador';
import EstadoBadge from '../components/ui/EstadoBadge';
import Panel from '../pages/Panel';
import Sidebar from '../components/navegacion/Sidebar';
import { INDICADORES, construirIndicadores } from '../constants/indicadores';
import { ESTADOS_RESERVA, TONOS_ESTADO } from '../constants/estados';
import { reiniciarBaseMock, guardarIdSesionMock } from '../mocks/baseDatosMock';

describe('Rediseño visual del Panel (E-50 a E-54)', () => {
  beforeEach(() => {
    reiniciarBaseMock();
    sessionStorage.clear();
    localStorage.clear();
  });

  it('E-50: CardIndicador muestra etiqueta, valor, descripcion y un solo enlace con nombre accesible exacto', () => {
    render(
      <MemoryRouter>
        <CardIndicador
          etiqueta="Total de reservas"
          valor={15}
          descripcion="Registradas en el sistema"
          destino="/reservas"
          textoAccion="Ver todas las reservas"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Total de reservas')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Registradas en el sistema')).toBeInTheDocument();

    const enlaces = screen.getAllByRole('link');
    expect(enlaces).toHaveLength(1);
    expect(enlaces[0]).toHaveAttribute('aria-label', 'Total de reservas: 15. Ver todas las reservas');
  });

  it('E-51: Panel renderiza las 6 tarjetas desde constants/indicadores.js en orden y con la misma estructura', async () => {
    guardarIdSesionMock('usr-admin');
    render(
      <MemoryRouter>
        <AuthProvider>
          <Panel />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { level: 1, name: 'Panel' })).toBeInTheDocument();
    const enlaces = screen.getAllByRole('link').filter((l) => l.getAttribute('aria-label')?.includes(':'));
    expect(enlaces).toHaveLength(6);

    INDICADORES.forEach((item, idx) => {
      expect(enlaces[idx].getAttribute('aria-label')).toMatch(new RegExp(`^${item.etiqueta.slice(0, 5)}`, 'i'));
    });
  });

  it('E-52: tonos de CardIndicador y EstadoBadge provienen de la misma constante TONOS_ESTADO', () => {
    Object.values(ESTADOS_RESERVA).forEach((estado) => {
      expect(TONOS_ESTADO[estado]).toBeDefined();
      expect(TONOS_ESTADO[estado].chip).toContain(TONOS_ESTADO[estado].fondo);

      const { container: badgeContainer } = render(<EstadoBadge estado={estado} />);
      expect(badgeContainer.firstChild.className).toContain(TONOS_ESTADO[estado].fondo);

      const { container: cardContainer } = render(
        <MemoryRouter>
          <CardIndicador etiqueta="Prueba" valor={1} descripcion="Desc" tono={estado} destino="/test" />
        </MemoryRouter>
      );
      const chip = cardContainer.querySelector('[aria-hidden="true"]');
      expect(chip.className).toContain(TONOS_ESTADO[estado].fondo);
    });
  });

  it('E-53: ambiente mas utilizado nulo muestra "Aun sin datos"; singular y plural en descripcion', () => {
    const sinAmbiente = construirIndicadores({ total: 0, ambienteMasUtilizado: null });
    const tarjetaSinAmb = sinAmbiente.find((i) => i.clave === 'ambiente');
    expect(tarjetaSinAmb.valor).toBe('Aún sin datos');
    expect(tarjetaSinAmb.descripcion).toBe('Se calculará con las primeras reservas');

    const conUnAmbiente = construirIndicadores({ total: 1, ambienteMasUtilizado: { nombre: 'Laboratorio 1', cantidad: 1 } });
    const tarjetaUnAmb = conUnAmbiente.find((i) => i.clave === 'ambiente');
    expect(tarjetaUnAmb.descripcion).toBe('1 reserva registrada');

    const conVarios = construirIndicadores({ total: 3, ambienteMasUtilizado: { nombre: 'Auditorio', cantidad: 3 } });
    const tarjetaVarios = conVarios.find((i) => i.clave === 'ambiente');
    expect(tarjetaVarios.descripcion).toBe('3 reservas registradas');
  });

  it('E-54: en Sidebar solo el item activo lleva aria-current="page"', () => {
    guardarIdSesionMock('usr-admin');
    render(
      <MemoryRouter initialEntries={['/panel']}>
        <AuthProvider>
          <Sidebar />
        </AuthProvider>
      </MemoryRouter>
    );

    const enlaces = screen.getAllByRole('link');
    const enlacesConAriaCurrent = enlaces.filter((l) => l.getAttribute('aria-current') === 'page');
    expect(enlacesConAriaCurrent).toHaveLength(1);
    expect(enlacesConAriaCurrent[0]).toHaveAttribute('href', '/panel');
  });
});
