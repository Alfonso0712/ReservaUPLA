// Hook de catálogo de ambientes y alta según alcance del backend · RF-02 · E-10..11 · E-32 · E-39..44
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  listarAmbientesApi, crearAmbienteApi,
  actualizarAmbienteApi, cambiarEstadoAmbienteApi
} from '../services/ambienteService';
import { listarResponsablesApi } from '../services/usuarioService';
import { interpretarRespuesta } from '../validation/interpretarRespuesta';
import { usePermisos } from './usePermisos';
import { PERMISOS } from '../constants/permisos';

export function useAmbientes() {
  const { puede } = usePermisos();
  const [ambientes, setAmbientes] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const peticionRef = useRef(0);
  const enAccionRef = useRef(false);

  const cargarAmbientes = useCallback(async (signal) => {
    const idPeticion = ++peticionRef.current;
    setCargando(true);
    setError('');
    const promesas = [listarAmbientesApi(signal)];
    if (typeof puede === 'function' && puede(PERMISOS.USUARIOS_LISTAR_RESPONSABLES)) {
      promesas.push(listarResponsablesApi(signal));
    }
    const [respAmb, respUsr] = await Promise.all(promesas);
    if (typeof window === 'undefined' || signal?.aborted || idPeticion !== peticionRef.current) return;
    const resAmb = interpretarRespuesta(respAmb);
    if (resAmb.ok) setAmbientes(Array.isArray(resAmb.datos) ? resAmb.datos : []);
    else setError(resAmb.errorGeneral);
    if (respUsr) {
      const resUsr = interpretarRespuesta(respUsr);
      if (resUsr.ok && Array.isArray(resUsr.datos)) setResponsables(resUsr.datos);
    }
    setCargando(false);
  }, [puede]);

  useEffect(() => {
    const ctrl = new AbortController();
    cargarAmbientes(ctrl.signal);
    return () => ctrl.abort();
  }, [cargarAmbientes]);

  const ejecutarAccionSegura = useCallback(async (operacion) => {
    if (enAccionRef.current) return { ok: false, errorGeneral: 'Ya hay una operación en curso.' };
    enAccionRef.current = true;
    try {
      const resp = await operacion();
      const resultado = interpretarRespuesta(resp);
      if (resultado.ok) await cargarAmbientes();
      return resultado;
    } finally {
      enAccionRef.current = false;
    }
  }, [cargarAmbientes]);

  const registrarAmbiente = useCallback((datos) => ejecutarAccionSegura(() => crearAmbienteApi(datos)), [ejecutarAccionSegura]);
  const editarAmbiente = useCallback((id, datos) => ejecutarAccionSegura(() => actualizarAmbienteApi(id, datos)), [ejecutarAccionSegura]);
  const cambiarEstadoAmbiente = useCallback((id, estado) => ejecutarAccionSegura(() => cambiarEstadoAmbienteApi(id, estado)), [ejecutarAccionSegura]);

  return {
    ambientes, responsables, cargando, error,
    recargar: () => cargarAmbientes(),
    registrarAmbiente, editarAmbiente, cambiarEstadoAmbiente
  };
}
