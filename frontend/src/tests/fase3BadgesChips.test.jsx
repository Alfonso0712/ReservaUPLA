// Pruebas FASE 3: Badges y chips unificados (ISO 9241-110 · WCAG 2.2 AA)
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Badge from '../components/ui/Badge';
import EstadoBadge from '../components/ui/EstadoBadge';
import EstadoAmbienteBadge from '../components/ui/EstadoAmbienteBadge';
import TipoAmbienteChip from '../components/ui/TipoAmbienteChip';
import { ESTADOS_RESERVA, ESTADOS_AMBIENTE } from '../constants/estados';

describe('FASE 3: Badges y chips unificados', () => {
  it('1. Badge renderiza altura estandar (24-28px), redondeado suave y no-wrap', () => {
    const { container } = render(<Badge estado={ESTADOS_RESERVA.APROBADA} />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('h-[1.625rem]', 'rounded-full', 'whitespace-nowrap');
    expect(badge).toHaveTextContent('Aprobada');
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('2. Colores semanticos de fondo suave para estados de reservas y ambientes', () => {
    const { rerender, container } = render(<Badge estado={ESTADOS_RESERVA.APROBADA} />);
    expect(container.firstChild.className).toContain('bg-aprobada-fondo');
    expect(container.firstChild.className).toContain('text-aprobada-texto');

    rerender(<Badge estado={ESTADOS_RESERVA.PENDIENTE} />);
    expect(container.firstChild.className).toContain('bg-pendiente-fondo');
    expect(container.firstChild.className).toContain('text-pendiente-texto');

    rerender(<Badge estado={ESTADOS_RESERVA.RECHAZADA} />);
    expect(container.firstChild.className).toContain('bg-rechazada-fondo');
    expect(container.firstChild.className).toContain('text-rechazada-texto');

    rerender(<Badge estado={ESTADOS_RESERVA.CANCELADA} />);
    expect(container.firstChild.className).toContain('bg-cancelada-fondo');
    expect(container.firstChild.className).toContain('text-cancelada-texto');

    rerender(<Badge estado={ESTADOS_AMBIENTE.DISPONIBLE} />);
    expect(container.firstChild.className).toContain('bg-aprobada-fondo');

    rerender(<Badge estado={ESTADOS_AMBIENTE.MANTENIMIENTO} />);
    expect(container.firstChild.className).toContain('bg-pendiente-fondo');
  });

  it('3. EstadoBadge y EstadoAmbienteBadge delegan en Badge manteniendo compatibilidad', () => {
    const { container: rCont } = render(<EstadoBadge estado={ESTADOS_RESERVA.APROBADA} />);
    expect(rCont.firstChild.className).toContain('bg-aprobada-fondo');
    expect(rCont.querySelector('svg')).toBeInTheDocument();

    const { container: aCont } = render(<EstadoAmbienteBadge estado={ESTADOS_AMBIENTE.DISPONIBLE} />);
    expect(aCont.firstChild.className).toContain('bg-aprobada-fondo');
    expect(aCont.querySelector('svg')).toBeInTheDocument();
  });

  it('4. TipoAmbienteChip no tiene fondo ni borde, muestra icono pequeno de 14px y texto limpio', () => {
    const { container } = render(<TipoAmbienteChip tipo="Auditorio" />);
    const chip = container.querySelector('span');
    expect(chip.className).not.toContain('bg-');
    expect(chip.className).not.toContain('border-');
    expect(chip).toHaveTextContent('Auditorio');
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg.getAttribute('class')).toContain('w-3.5');
  });
});
