// Nielsen 3 · WCAG 2.2 AA · Trampa de foco, cierre con Escape, retorno al disparador y fondo inerte · E-25 · E-33
import { useEffect, useRef } from 'react';

const SELECTOR_ENFOCABLES = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useTrampaFoco(abierto, alCerrar, selectorFocoInicial = null) {
  const contenedorRef = useRef(null);
  const disparadorRef = useRef(null);
  const alCerrarRef = useRef(alCerrar);
  alCerrarRef.current = alCerrar;

  useEffect(() => {
    if (!abierto) return undefined;

    disparadorRef.current = document.activeElement;
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const principal = document.getElementById('contenido-principal');
    principal?.setAttribute('aria-hidden', 'true');

    const contenedor = contenedorRef.current;
    const enfocarInicial = () => {
      if (!contenedor) return;
      const objetivo = (selectorFocoInicial && contenedor.querySelector(selectorFocoInicial))
        || contenedor.querySelector(SELECTOR_ENFOCABLES);
      objetivo?.focus();
    };
    enfocarInicial();
    const timer = setTimeout(enfocarInicial, 0);

    const manejarTeclado = (evento) => {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        alCerrarRef.current?.();
        return;
      }
      if (evento.key !== 'Tab' || !contenedor) return;
      const elementos = Array.from(contenedor.querySelectorAll(SELECTOR_ENFOCABLES));
      if (elementos.length === 0) return;
      const primero = elementos[0];
      const ultimo = elementos[elementos.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener('keydown', manejarTeclado);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', manejarTeclado);
      document.body.style.overflow = overflowPrevio;
      principal?.removeAttribute('aria-hidden');
      if (disparadorRef.current && typeof disparadorRef.current.focus === 'function') {
        disparadorRef.current.focus();
      }
    };
  }, [abierto, selectorFocoInicial]);

  return contenedorRef;
}
