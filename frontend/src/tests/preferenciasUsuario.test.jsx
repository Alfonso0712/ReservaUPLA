// Tests de persistencia y conmutación de preferencias por usuario · E-29
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AuthProvider } from '../hooks/useAuth';
import ConmutadorTema from '../components/navegacion/ConmutadorTema';
import ControlTamanoFuente from '../components/navegacion/ControlTamanoFuente';

describe('Preferencias de interfaz por usuario', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.setAttribute('data-tema', 'claro');
    document.documentElement.style.fontSize = '100%';
  });

  it('aplica preferencias del usuario al montar e interactuar', async () => {
    const usuarioA = { id: 'usr-a', nombreCompleto: 'Ana', rol: 'Solicitante', tema: 'claro', tamanoLetra: 'normal' };
    const { unmount } = render(
      <AuthProvider usuarioInicial={usuarioA}>
        <ConmutadorTema />
        <ControlTamanoFuente />
      </AuthProvider>
    );

    const botonTema = screen.getByRole('button', { name: /cambiar a modo oscuro/i });
    expect(botonTema).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(botonTema);
    });

    expect(document.documentElement.getAttribute('data-tema')).toBe('oscuro');

    const botonAplus = screen.getByRole('button', { name: /tamaño de fuente grande/i });
    await act(async () => {
      fireEvent.click(botonAplus);
    });

    expect(document.documentElement.style.fontSize).toBe('125%');
    unmount();
  });

  it('aísla preferencias al cambiar de usuario', async () => {
    const usuarioOscuro = { id: 'usr-1', nombreCompleto: 'Juan', rol: 'Solicitante', tema: 'oscuro', tamanoLetra: 'grande' };
    const { unmount: u1 } = render(
      <AuthProvider usuarioInicial={usuarioOscuro}>
        <ConmutadorTema />
      </AuthProvider>
    );
    expect(document.documentElement.getAttribute('data-tema')).toBe('oscuro');
    expect(document.documentElement.style.fontSize).toBe('125%');
    u1();

    const usuarioClaro = { id: 'usr-2', nombreCompleto: 'Pedro', rol: 'Solicitante', tema: 'claro', tamanoLetra: 'pequeno' };
    render(
      <AuthProvider usuarioInicial={usuarioClaro}>
        <ConmutadorTema />
      </AuthProvider>
    );
    expect(document.documentElement.getAttribute('data-tema')).toBe('claro');
    expect(document.documentElement.style.fontSize).toBe('100%');
  });
});
