// WCAG 2.2 AA · Foco programático al montar o cambiar ruta · E-25
import { useEffect, useRef } from 'react';

export function useFocoAlMontar(enfocar = true, dependencia = null) {
  const elementoRef = useRef(null);

  useEffect(() => {
    if (enfocar && elementoRef.current && typeof elementoRef.current.focus === 'function') {
      elementoRef.current.focus();
    }
  }, [enfocar, dependencia]);

  return elementoRef;
}
