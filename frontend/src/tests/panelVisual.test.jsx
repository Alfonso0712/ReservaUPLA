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

  it('E-50: CardIndicador muestra etiqueta, valor, descripcion y un solo enlace accesible', () => {
    render(<MemoryRouter><CardIndicador etiqueta="Total de reservas" valor={15} descripcion="Registradas en el sistema" destino="/reservas" textoAccion="Ver todas las reservas" /></MemoryRouter>);
    expect(screen.getByText('Total de reservas')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    const enlaces = screen.getAllByRole('link');
    expect(enlaces).toHaveLength(1);
    expect(enlaces[0]).toHaveAttribute('aria-label', 'Total de reservas: 15. Ver todas las reservas');
  });

  it('E-51: Panel renderiza las 6 tarjetas desde constants/indicadores.js en orden', async () => {
    guardarIdSesionMock('usr-admin');
    render(<MemoryRouter><AuthProvider><Panel /></AuthProvider></MemoryRouter>);
    expect(await screen.findByRole('heading', { level: 1, name: 'Panel' })).toBeInTheDocument();
    expect(await screen.findByText('Total de reservas')).toBeInTheDocument();
    const enlaces = screen.getAllByRole('link').filter((l) => l.getAttribute('aria-label')?.includes(':'));
    expect(enlaces).toHaveLength(6);
    INDICADORES.forEach((item, idx) => {
      expect(enlaces[idx].getAttribute('aria-label')).toMatch(new RegExp(`^${item.etiqueta.slice(0, 5)}`, 'i'));
    });
  });

  it('E-52: tonos de CardIndicador y EstadoBadge provienen de la misma constante TONOS_ESTADO', () => {
    Object.values(ESTADOS_RESERVA).forEach((estado) => {
      expect(TONOS_ESTADO[estado]).toBeDefined();
      const { container: bCont } = render(<EstadoBadge estado={estado} />);
      expect(bCont.firstChild.className).toContain(TONOS_ESTADO[estado].fondo);
      const { container: cCont } = render(<MemoryRouter><CardIndicador etiqueta="Prueba" valor={1} descripcion="Desc" tono={estado} destino="/test" /></MemoryRouter>);
      expect(cCont.querySelector('[aria-hidden="true"]').className).toContain(TONOS_ESTADO[estado].fondo);
    });
  });

  it('E-53: ambiente mas utilizado nulo muestra "Aun sin datos"; singular y plural en descripcion', () => {
    const sinAmb = construirIndicadores({ total: 0, ambienteMasUtilizado: null }).find((i) => i.clave === 'ambiente');
    expect(sinAmb.valor).toBe('Aún sin datos');
    const conUn = construirIndicadores({ total: 1, ambienteMasUtilizado: { nombre: 'Lab 1', cantidad: 1 } }).find((i) => i.clave === 'ambiente');
    expect(conUn.descripcion).toBe('1 reserva registrada');
    const conVarios = construirIndicadores({ total: 3, ambienteMasUtilizado: { nombre: 'Auditorio', cantidad: 3 } }).find((i) => i.clave === 'ambiente');
    expect(conVarios.descripcion).toBe('3 reservas registradas');
  });

  it('E-54: en Sidebar solo el item activo lleva aria-current="page"', () => {
    guardarIdSesionMock('usr-admin');
    render(<MemoryRouter initialEntries={['/panel']}><AuthProvider><Sidebar /></AuthProvider></MemoryRouter>);
    const enlacesConAriaCurrent = screen.getAllByRole('link').filter((l) => l.getAttribute('aria-current') === 'page');
    expect(enlacesConAriaCurrent).toHaveLength(1);
    expect(enlacesConAriaCurrent[0]).toHaveAttribute('href', '/panel');
  });
});
