import { useState } from 'react';

// Nielsen 5 · Prevencion de errores en clave
export function useBloqMayus() {
  const [bloqMayusActivo, setBloqMayusActivo] = useState(false);

  const verificarBloqMayus = (evento) => {
    if (evento && typeof evento.getModifierState === 'function') {
      setBloqMayusActivo(evento.getModifierState('CapsLock'));
    }
  };

  return { bloqMayusActivo, verificarBloqMayus };
}
