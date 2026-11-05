// Pruebas FASE 1: Sistema unificado de iconos y botones
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MAPA_ICONOS } from '../constants/iconos';
import Icono from '../components/ui/Icono';
import Button from '../components/ui/Button';

describe('FASE 1: Sistema de iconos y botones', () => {
  it('1. Mapa único de iconos define las 7 acciones estándar de la aplicación', () => {
    expect(MAPA_ICONOS.VER_DETALLE).toBe('Eye');
    expect(MAPA_ICONOS.APROBAR).toBe('CircleCheck');
    expect(MAPA_ICONOS.RECHAZAR).toBe('CircleX');
    expect(MAPA_ICONOS.CANCELAR).toBe('Ban');
    expect(MAPA_ICONOS.EDITAR).toBe('Pencil');
    expect(MAPA_ICONOS.CAMBIAR_ESTADO).toBe('ArrowLeftRight');
    expect(MAPA_ICONOS.MAS_ACCIONES).toBe('MoreHorizontal');
  });

  it('2. Icono utiliza stroke uniforme (1.8) y clases correctas', () => {
    const { container } = render(<Icono nombre={MAPA_ICONOS.APROBAR} className="w-4 h-4 text-aprobada-texto" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('stroke-width', '1.8');
    expect(svg.getAttribute('class')).toContain('w-4');
  });

  it('3. Button soporta variantes requeridas y tamaños estándar sm (36px) y md (40px)', () => {
    const { rerender } = render(<Button variante="success" tamano="sm" icono={MAPA_ICONOS.APROBAR}>Aprobar</Button>);
    let boton = screen.getByRole('button', { name: 'Aprobar' });
    expect(boton.className).toContain('h-9');
    expect(boton.className).toContain('var(--btn-success-bg)');

    rerender(<Button variante="danger" tamano="md" icono={MAPA_ICONOS.RECHAZAR}>Rechazar</Button>);
    boton = screen.getByRole('button', { name: 'Rechazar' });
    expect(boton.className).toContain('h-10');
    expect(boton.className).toContain('var(--btn-danger-bg)');

    rerender(<Button variante="secondary" tamano="sm" icono={MAPA_ICONOS.CANCELAR}>Cancelar</Button>);
    boton = screen.getByRole('button', { name: 'Cancelar' });
    expect(boton.className).toContain('bg-superficie');
  });

  it('4. El icono se posiciona siempre antes del texto en orden DOM', () => {
    const { container } = render(<Button variante="primary" icono={MAPA_ICONOS.EDITAR}>Editar ambiente</Button>);
    const boton = container.querySelector('button');
    const svg = boton.querySelector('svg');
    const span = boton.querySelector('span');
    expect(svg).toBeInTheDocument();
    expect(span).toBeInTheDocument();
    expect(boton.firstElementChild).toBe(svg);
  });

  it('5. Botón icon-only exige aria-label y expone tooltip accesible', () => {
    render(<Button variante="icon-only" tamano="sm" icono={MAPA_ICONOS.EDITAR} aria-label="Editar registro" tooltip="Editar registro" />);
    const boton = screen.getByRole('button', { name: 'Editar registro' });
    expect(boton).toBeInTheDocument();
    expect(boton.className).toContain('w-9');
    expect(boton.className).toContain('h-9');
    expect(screen.getByRole('tooltip')).toHaveTextContent('Editar registro');
  });
});
