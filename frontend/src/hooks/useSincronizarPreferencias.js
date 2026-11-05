// Sincronización debounced de preferencias con el backend · E-29
import { useState, useRef, useCallback } from 'react';
import { actualizarPreferenciasApi } from '../services/usuarioService';
import { MAPA_PCT_A_LETRA } from '../utils/preferencias';

export function useSincronizarPreferencias(usuario, establecerUsuario) {
  const [alerta, setAlerta] = useState(null);
  const timerRef = useRef(null);

  const sincronizar = useCallback((nuevoTema, nuevoTamano) => {
    if (!usuario?.id) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const resp = await actualizarPreferenciasApi({
          tema: nuevoTema,
          tamanoLetra: MAPA_PCT_A_LETRA[nuevoTamano] || 'normal'
        });
        if (resp && resp.status >= 400) {
          setAlerta('No se pudieron sincronizar tus preferencias con el servidor.');
        } else if (establecerUsuario) {
          establecerUsuario((u) => (
            u ? { ...u, tema: nuevoTema, tamanoLetra: MAPA_PCT_A_LETRA[nuevoTamano] } : u
          ));
        }
      } catch {
        setAlerta('No se pudieron sincronizar tus preferencias con el servidor.');
      }
    }, 400);
  }, [usuario?.id, establecerUsuario]);

  return { alerta, setAlerta, sincronizar };
}
