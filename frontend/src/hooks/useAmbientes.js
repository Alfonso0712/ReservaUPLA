// Hook de catálogo de ambientes y alta por Administrador sin condiciones de carrera · RF-02 · E-10 · E-11 · E-32
import { useState, useEffect, useRef, useCallback } from 'react';
import { listarAmbientesApi, crearAmbienteApi } from '../services/ambienteService';
import { listarUsuariosApi } from '../services/usuarioService';
import { interpretarRespuesta } from '../validation/interpretarRespuesta';
import { ROLES } from '../constants/roles';

export function useAmbientes(usuarioActual = null) {
  const [ambientes, setAmbientes] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const peticionRef = useRef(0);

  const cargarAmbientes = useCallback(async (signal) => {
    const idPeticion = ++peticionRef.current;
    setCargando(true);
    setError('');
    const [respAmb, respUsr] = await Promise.all([
      listarAmbientesApi(signal),
      listarUsuariosApi(signal)
    ]);
    if (signal?.aborted || idPeticion !== peticionRef.current) return;
    const resAmb = interpretarRespuesta(respAmb);
    const resUsr = interpretarRespuesta(respUsr);
    if (resAmb.ok) {
      const lista = Array.isArray(resAmb.datos) ? resAmb.datos : [];
      const filtrada = usuarioActual?.rol === ROLES.RESPONSABLE
        ? lista.filter((a) => a.responsableId === usuarioActual.id)
        : lista;
      setAmbientes(filtrada);
    } else {
      setError(resAmb.errorGeneral);
    }
    if (resUsr.ok && Array.isArray(resUsr.datos)) {
      setResponsables(resUsr.datos.filter((u) => u.rol === ROLES.RESPONSABLE));
    }
    setCargando(false);
  }, [usuarioActual?.id, usuarioActual?.rol]);

  useEffect(() => {
    const ctrl = new AbortController();
    cargarAmbientes(ctrl.signal);
    return () => ctrl.abort();
  }, [cargarAmbientes]);

  const registrarAmbiente = useCallback(async (datos) => {
    const resp = await crearAmbienteApi(datos);
    const resultado = interpretarRespuesta(resp);
    if (resultado.ok) await cargarAmbientes();
    return resultado;
  }, [cargarAmbientes]);

  return { ambientes, responsables, cargando, error, recargar: () => cargarAmbientes(), registrarAmbiente };
}
