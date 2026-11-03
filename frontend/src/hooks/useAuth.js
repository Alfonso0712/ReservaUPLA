import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  const verificarSesion = useCallback(async () => {
    setCargandoAuth(true);
    const res = await authService.obtenerUsuarioActual();
    if (res.ok && res.datos) {
      setUsuario(res.datos);
    } else {
      setUsuario(null);
    }
    setCargandoAuth(false);
  }, []);

  useEffect(() => {
    verificarSesion();
  }, [verificarSesion]);

  const cerrarSesion = async () => {
    await authService.logout();
    setUsuario(null);
  };

  return { usuario, setUsuario, cargandoAuth, verificarSesion, cerrarSesion };
}
