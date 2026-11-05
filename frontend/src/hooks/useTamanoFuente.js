// Shneiderman 2 · WCAG 2.2 AA · E-29
import { useContext, useState, useEffect, useCallback } from 'react';
import { ContextoPreferencias } from '../context/PreferenciasContext';
import { ESCALAS_FUENTE } from '../utils/preferencias';

export { ESCALAS_FUENTE };

export function useTamanoFuente() {
  const ctx = useContext(ContextoPreferencias);
  const [tamanoLocal, setTamanoLocal] = useState('100%');

  useEffect(() => {
    if (ctx) return;
    document.documentElement.style.fontSize = tamanoLocal;
  }, [ctx, tamanoLocal]);

  const cambiarTamanoLocal = useCallback((nuevo) => {
    if (ESCALAS_FUENTE.some((e) => e.porcentaje === nuevo)) {
      setTamanoLocal(nuevo);
    }
  }, []);

  if (ctx) {
    return {
      tamanoFuente: ctx.tamanoFuente,
      cambiarTamanoFuente: ctx.cambiarTamanoFuente,
      escalas: ctx.escalas || ESCALAS_FUENTE
    };
  }
  return { tamanoFuente: tamanoLocal, cambiarTamanoFuente: cambiarTamanoLocal, escalas: ESCALAS_FUENTE };
}
