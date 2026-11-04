// WCAG 2.2 AA · E-25
import { useEffect, useRef } from 'react';

export function useFocoAlMontar(tituloDocumento, enfocar = true) {
  const elementoRef = useRef(null);

  useEffect(() => {
    if (tituloDocumento) {
      document.title = `${tituloDocumento} — ReservaUPLA`;
    }
    if (enfocar && elementoRef.current) {
      elementoRef.current.focus();
    }
  }, [tituloDocumento, enfocar]);

  return elementoRef;
}
