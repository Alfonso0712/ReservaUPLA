// Nielsen 7 · Shneiderman 2 · Hook reactivo para media queries accesibles
import { useState, useEffect } from 'react';

export function useMediaQuery(consulta) {
  const obtenerCoincidencia = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia(consulta).matches;
  };

  const [coincide, setCoincide] = useState(obtenerCoincidencia);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }
    const media = window.matchMedia(consulta);
    setCoincide(media.matches);

    const alCambiar = (e) => setCoincide(e.matches);
    if (media.addEventListener) {
      media.addEventListener('change', alCambiar);
      return () => media.removeEventListener('change', alCambiar);
    }
    media.addListener?.(alCambiar);
    return () => media.removeListener?.(alCambiar);
  }, [consulta]);

  return coincide;
}
