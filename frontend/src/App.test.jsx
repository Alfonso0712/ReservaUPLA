import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renderiza la pantalla de autenticacion de ReservaUPLA', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
      headers: new Headers(),
      json: async () => ({})
    });

    render(<App />);
    expect(await screen.findByRole('heading', { name: /ReservaUPLA/i })).toBeInTheDocument();
  });
});
