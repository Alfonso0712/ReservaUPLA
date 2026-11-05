// Nielsen 3 · Shneiderman 6 · ISO 9241-110 · Hook para disclosure dropdown accesible
import { useState, useRef, useEffect, useCallback } from 'react';

export function useMenuDesplegable() {
  const [abierto, setAbierto] = useState(false);
  const botonRef = useRef(null);
  const contenedorRef = useRef(null);

  const alternar = useCallback(() => setAbierto((prev) => !prev), []);
  const cerrar = useCallback((devolverFoco = true) => {
    setAbierto(false);
    if (devolverFoco) botonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!abierto) return undefined;

    const alPulsarTecla = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cerrar(true);
      }
    };

    const alHacerClicFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };

    document.addEventListener('keydown', alPulsarTecla);
    document.addEventListener('mousedown', alHacerClicFuera);
    return () => {
      document.removeEventListener('keydown', alPulsarTecla);
      document.removeEventListener('mousedown', alHacerClicFuera);
    };
  }, [abierto, cerrar]);

  const manejarPerdidaFoco = useCallback((e) => {
    if (contenedorRef.current && !contenedorRef.current.contains(e.relatedTarget)) {
      setAbierto(false);
    }
  }, []);

  return {
    abierto,
    setAbierto,
    alternar,
    cerrar,
    botonRef,
    contenedorRef,
    manejarPerdidaFoco
  };
}
