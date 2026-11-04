// Pruebas FASE 5: Arquitectura de la información (Pestañas, Fecha/Hora, Discreto)
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PestanasEstado from '../components/reservas/PestanasEstado';
import Badge from '../components/ui/Badge';
import { ESTADOS_RESERVA, ESTADOS_AMBIENTE } from '../constants/estados';
import { formatearFecha } from '../utils/formatearFecha';
import { formatearRangoHorario } from '../utils/formatearHora';

describe('FASE 5: Arquitectura de la información', () => {
  it('1. PestanasEstado: renderiza 5 tabs con conteos y accesibilidad aria-selected', () => {
    const fn = vi.fn();
    const conteos = { total: 5, pendientes: 2, aprobadas: 1, rechazadas: 1, canceladas: 1 };
    render(<PestanasEstado estadoActivo={ESTADOS_RESERVA.PENDIENTE} conteos={conteos} alSeleccionar={fn} />);

    expect(screen.getByRole('tablist', { name: /filtrar reservas por estado/i })).toBeInTheDocument();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(5);

    const tabPendiente = screen.getByRole('tab', { name: /pendientes 2/i });
    expect(tabPendiente).toHaveAttribute('aria-selected', 'true');
    expect(tabPendiente).toHaveAttribute('tabIndex', '0');

    const tabAprobada = screen.getByRole('tab', { name: /aprobadas 1/i });
    expect(tabAprobada).toHaveAttribute('aria-selected', 'false');
    expect(tabAprobada).toHaveAttribute('tabIndex', '-1');

    fireEvent.click(tabAprobada);
    expect(fn).toHaveBeenCalledWith(ESTADOS_RESERVA.APROBADA);
  });

  it('2. Badge con soporte discreto: neutraliza color cuando todos son disponibles', () => {
    const { rerender, container } = render(<Badge estado={ESTADOS_AMBIENTE.DISPONIBLE} discreto />);
    expect(container.firstChild.className).toContain('bg-superficie-2');
    expect(container.firstChild.className).toContain('text-texto-suave');

    rerender(<Badge estado={ESTADOS_AMBIENTE.DISPONIBLE} discreto={false} />);
    expect(container.firstChild.className).toContain('bg-aprobada-fondo');
    expect(container.firstChild.className).toContain('text-aprobada-texto');

    rerender(<Badge estado={ESTADOS_AMBIENTE.MANTENIMIENTO} discreto={false} />);
    expect(container.firstChild.className).toContain('bg-pendiente-fondo');
  });

  it('3. Fecha y horario unificados: línea 1 fecha formal y línea 2 rango secundario', () => {
    const fecha = '2026-11-15';
    const hIni = '10:00:00';
    const hFin = '12:00:00';
    const fechaFmt = formatearFecha(fecha);
    const rangoFmt = formatearRangoHorario(hIni, hFin);

    expect(fechaFmt).toMatch(/15\/11\/2026/);
    expect(rangoFmt).toBe('10:00 – 12:00');
  });

  it('4. Priorización por defecto: Pendientes van primero y luego por fecha próxima', () => {
    const items = [
      { id: 1, estado: ESTADOS_RESERVA.APROBADA, fecha: '2026-11-15', horaInicio: '10:00:00' },
      { id: 2, estado: ESTADOS_RESERVA.PENDIENTE, fecha: '2026-11-16', horaInicio: '08:00:00' },
      { id: 3, estado: ESTADOS_RESERVA.PENDIENTE, fecha: '2026-11-14', horaInicio: '09:00:00' },
      { id: 4, estado: ESTADOS_RESERVA.CANCELADA, fecha: '2026-11-10', horaInicio: '07:00:00' }
    ];
    const ordenadas = [...items].sort((a, b) => {
      const pA = a.estado === ESTADOS_RESERVA.PENDIENTE ? 0 : 1;
      const pB = b.estado === ESTADOS_RESERVA.PENDIENTE ? 0 : 1;
      if (pA !== pB) return pA - pB;
      return `${a.fecha} ${a.horaInicio}`.localeCompare(`${b.fecha} ${b.horaInicio}`);
    });

    expect(ordenadas.map((x) => x.id)).toEqual([3, 2, 4, 1]);
  });
});