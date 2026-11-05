// Hook y proveedor de sesión · Permisos en memoria · E-07..09 · E-18 · E-45..49
import { createContext, createElement, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { iniciarSesionApi, cerrarSesionApi, obtenerSesionActualApi } from '../services/authService';
import { interpretarRespuesta } from '../validation/interpretarRespuesta';
import { obtenerUsuarioActualMock, guardarIdSesionMock } from '../mocks/estadoMock';
import { obtenerPermisosDeRol } from '../mocks/permisosPorRol';

export const ContextoAuth = createContext(null);

export function AuthProvider({ children, usuarioInicial = null }) {
  const [usuario, setUsuario] = useState(() => usuarioInicial || obtenerUsuarioActualMock() || null);
  const [permisos, setPermisos] = useState(() => (
    usuarioInicial?.permisos || (usuario?.rol ? obtenerPermisosDeRol(usuario.rol) : [])
  ));
  const [cargandoSesion, setCargandoSesion] = useState(false);

  useEffect(() => {
    if (usuarioInicial || obtenerUsuarioActualMock()) return undefined;
    if (import.meta.env?.VITE_USAR_MOCK !== 'false') return undefined;
    const ctrl = new AbortController();
    setCargandoSesion(true);
    obtenerSesionActualApi(ctrl.signal).then((resp) => {
      if (ctrl.signal.aborted) return;
      const interp = interpretarRespuesta(resp);
      if (interp.ok && interp.datos) {
        const u = interp.datos.usuario || interp.datos;
        const p = interp.datos.permisos || obtenerPermisosDeRol(u.rol) || [];
        setUsuario(u);
        setPermisos(p);
      }
      setCargandoSesion(false);
    });
    return () => ctrl.abort();
  }, [usuarioInicial]);

  const iniciarSesion = useCallback(async ({ correo, contrasena }, signal) => {
    const resp = await iniciarSesionApi({ correo, contrasena }, signal);
    const resultado = interpretarRespuesta(resp);
    if (resultado.ok && resultado.datos) {
      const u = resultado.datos.usuario || resultado.datos;
      const p = resultado.datos.permisos || obtenerPermisosDeRol(u.rol) || [];
      setUsuario(u);
      setPermisos(p);
      if (u.id) guardarIdSesionMock(u.id);
    }
    return resultado;
  }, []);

  const cerrarSesion = useCallback(async () => {
    await cerrarSesionApi();
    guardarIdSesionMock('');
    setUsuario(null);
    setPermisos([]);
  }, []);

  const puede = useCallback((permiso) => permisos.includes(permiso), [permisos]);

  const valor = useMemo(() => ({
    usuario,
    permisos,
    puede,
    autenticado: Boolean(usuario),
    cargandoSesion,
    iniciarSesion,
    cerrarSesion,
    establecerUsuario: setUsuario
  }), [usuario, permisos, puede, cargandoSesion, iniciarSesion, cerrarSesion]);

  return createElement(ContextoAuth.Provider, { value: valor }, children);
}

export function useAuth() {
  const contexto = useContext(ContextoAuth);
  if (!contexto) throw new Error('useAuth debe utilizarse dentro de un AuthProvider.');
  return contexto;
}
