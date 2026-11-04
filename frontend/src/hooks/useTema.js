// Shneiderman 2 · ISO 9241-11 · E-29
import { useState, useEffect, useCallback } from 'react';

const CLAVE_TEMA = 'reservaupla_tema';

function leerTemaInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE_TEMA);
    if (guardado === 'claro' || guardado === 'oscuro') return guardado;
  } catch {
    // Almacenamiento bloqueado
  }
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'oscuro';
  }
  return 'claro';
}

export function useTema() {
  const [tema, setTema] = useState(leerTemaInicial);

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema);
    try {
      localStorage.setItem(CLAVE_TEMA, tema);
    } catch {
      // Almacenamiento bloqueado
    }
  }, [tema]);

  const alternarTema = useCallback(() => {
    setTema((actual) => (actual === 'oscuro' ? 'claro' : 'oscuro'));
  }, []);

  return { tema, setTema, alternarTema };
}
