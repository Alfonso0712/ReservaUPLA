// ISO 9241-11 · Debounce para búsqueda sin condiciones de carrera
import { useState, useEffect } from 'react';
import { DEBOUNCE_BUSQUEDA_MS } from '../constants/reglas';

export function useDebounce(valor, retardo = DEBOUNCE_BUSQUEDA_MS) {
  const [valorDebounced, setValorDebounced] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setValorDebounced(valor);
    }, retardo);
    return () => clearTimeout(temporizador);
  }, [valor, retardo]);

  return valorDebounced;
}
