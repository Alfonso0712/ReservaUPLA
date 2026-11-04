// Hook y proveedor de sesión · Nunca almacena contraseñas ni datos sensibles en el cliente · E-07..09 · E-18
import { createContext, createElement, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { iniciarSesionApi, cerrarSesionApi, obtenerSesionActualApi } from '../services/authService';
import { interpretarRespuesta } from '../validation/interpretarRespuesta';
import { obtenerUsuarioActualMock, guardarIdSesionMock } from '../mocks/estadoMock';

const ContextoAuth = createContext(null);

export function AuthProvider({ children, usuarioInicial = null }) {
  const [usuario, setUsuario] = useState(() => usuarioInicial || obtenerUsuarioActualMock() || null);
  const [cargandoSesion, setCargandoSesion] = useState(false);

  useEffect(() => {
    if (usuarioInicial || obtenerUsuarioActualMock()) return undefined;
    if (import.meta.env?.VITE_USAR_MOCK !== 'false') return undefined;
    const ctrl = new AbortController();
    setCargandoSesion(true);
    obtenerSesionActualApi(ctrl.signal).then((resp) => {
      if (ctrl.signal.aborted) return;
      const interp = interpretarRespuesta(resp);
      if (interp.ok && interp.datos) setUsuario(interp.datos);
      setCargandoSesion(false);
    });
    return () => ctrl.abort();
  }, [usuarioInicial]);

  const iniciarSesion = useCallback(async ({ correo, contrasena }, signal) => {
    const resp = await iniciarSesionApi({ correo, contrasena }, signal);
    const resultado = interpretarRespuesta(resp);
    if (resultado.ok && resultado.datos) {
      setUsuario(resultado.datos);
      if (resultado.datos.id) guardarIdSesionMock(resultado.datos.id);
    }
    return resultado;
  }, []);

  const cerrarSesion = useCallback(async () => {
    await cerrarSesionApi();
    guardarIdSesionMock('');
    setUsuario(null);
  }, []);

  const valor = useMemo(() => ({
    usuario,
    autenticado: Boolean(usuario),
    cargandoSesion,
    iniciarSesion,
    cerrarSesion,
    establecerUsuario: setUsuario
  }), [usuario, cargandoSesion, iniciarSesion, cerrarSesion]);

  return createElement(ContextoAuth.Provider, { value: valor }, children);
}

export function useAuth() {
  const contexto = useContext(ContextoAuth);
  if (!contexto) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider.');
  }
  return contexto;
}
