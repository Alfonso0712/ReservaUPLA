// Nielsen 5 · Prevención de errores de escritura en contraseña
import { useState, useCallback } from 'react';

export function useBloqMayus() {
  const [bloqMayusActivo, setBloqMayusActivo] = useState(false);

  const verificarEvento = useCallback((evento) => {
    if (typeof evento?.getModifierState === 'function') {
      setBloqMayusActivo(Boolean(evento.getModifierState('CapsLock')));
    }
  }, []);

  const limpiarBloqMayus = useCallback(() => {
    setBloqMayusActivo(false);
  }, []);

  return { bloqMayusActivo, verificarEvento, limpiarBloqMayus };
}
