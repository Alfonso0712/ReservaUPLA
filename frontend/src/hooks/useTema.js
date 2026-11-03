import { useState, useEffect } from 'react';

// E-29 · Modo claro/oscuro con prefers-color-scheme y try/catch seguro
export function useTema() {
  const [tema, setTema] = useState(() => {
    try {
      const guardado = window.localStorage.getItem('reservaupla_tema');
      if (guardado === 'dark' || guardado === 'light') return guardado;
    } catch {
      // Ignorar fallo de acceso a localStorage
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema);
    try {
      window.localStorage.setItem('reservaupla_tema', tema);
    } catch {
      // Ignorar fallo de almacenamiento
    }
  }, [tema]);

  const alternarTema = () => {
    setTema((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { tema, alternarTema };
}
