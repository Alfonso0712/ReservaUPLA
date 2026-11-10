// Hook de gestión de usuarios exclusivo de Administrador · RF-01 · Permisos RBAC
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  listarUsuariosAdminApi,
  crearUsuarioAdminApi,
  actualizarUsuarioAdminApi,
  cambiarEstadoUsuarioAdminApi
} from '../services/usuarioService';
import { interpretarRespuesta } from '../validation/interpretarRespuesta';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const peticionRef = useRef(0);
  const enAccionRef = useRef(false);

  const cargarUsuarios = useCallback(async (signal) => {
    const idPeticion = ++peticionRef.current;
    setCargando(true);
    setError('');
    const resp = await listarUsuariosAdminApi({}, signal);
    if (typeof window === 'undefined' || signal?.aborted || idPeticion !== peticionRef.current) return;
    const res = interpretarRespuesta(resp);
    if (res.ok) {
      setUsuarios(Array.isArray(res.datos) ? res.datos : []);
    } else {
      setError(res.errorGeneral);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    cargarUsuarios(ctrl.signal);
    return () => ctrl.abort();
  }, [cargarUsuarios]);

  const ejecutarAccionSegura = useCallback(async (operacion) => {
    if (enAccionRef.current) return { ok: false, errorGeneral: 'Ya hay una operación en curso.' };
    enAccionRef.current = true;
    try {
      const resp = await operacion();
      const resultado = interpretarRespuesta(resp);
      if (resultado.ok) await cargarUsuarios();
      return resultado;
    } finally {
      enAccionRef.current = false;
    }
  }, [cargarUsuarios]);

  const registrarUsuario = useCallback((datos) => ejecutarAccionSegura(() => crearUsuarioAdminApi(datos)), [ejecutarAccionSegura]);
  const editarUsuario = useCallback((id, datos) => ejecutarAccionSegura(() => actualizarUsuarioAdminApi(id, datos)), [ejecutarAccionSegura]);
  const cambiarEstadoUsuario = useCallback((id, activo) => ejecutarAccionSegura(() => cambiarEstadoUsuarioAdminApi(id, activo)), [ejecutarAccionSegura]);

  return {
    usuarios,
    cargando,
    error,
    recargar: () => cargarUsuarios(),
    registrarUsuario,
    editarUsuario,
    cambiarEstadoUsuario
  };
}
