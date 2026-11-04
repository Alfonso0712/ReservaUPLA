// Hook de listado, detalle y cambio de estado de reservas sin condiciones de carrera · RF-03..07 · E-12..21
import { useState, useEffect, useRef, useCallback } from 'react';
import { listarReservasApi, cambiarEstadoReservaApi, crearReservaApi } from '../services/reservaService';
import { interpretarRespuesta } from '../validation/interpretarRespuesta';

export function useReservas({ estado = '', tipo = '', texto = '', versionExterna = 0 } = {}) {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [enProcesoAccion, setEnProcesoAccion] = useState(false);
  const peticionRef = useRef(0);
  const bloqueoAccionRef = useRef(false);

  const cargarReservas = useCallback(async (signal) => {
    const idPeticion = ++peticionRef.current;
    setCargando(true);
    setError('');
    const resp = await listarReservasApi({ estado, tipo, texto }, signal);
    if (signal?.aborted || idPeticion !== peticionRef.current) return;
    const resultado = interpretarRespuesta(resp);
    if (resultado.ok) {
      setReservas(Array.isArray(resultado.datos) ? resultado.datos : []);
    } else {
      setError(resultado.errorGeneral);
    }
    setCargando(false);
  }, [estado, tipo, texto]);

  useEffect(() => {
    const ctrl = new AbortController();
    cargarReservas(ctrl.signal);
    return () => ctrl.abort();
  }, [cargarReservas, versionExterna]);

  const cambiarEstado = useCallback(async (idReserva, nuevoEstado) => {
    if (bloqueoAccionRef.current) return { ok: false };
    bloqueoAccionRef.current = true;
    setEnProcesoAccion(true);
    try {
      const resp = await cambiarEstadoReservaApi(idReserva, nuevoEstado);
      const resultado = interpretarRespuesta(resp);
      if (resultado.ok) await cargarReservas();
      return resultado;
    } finally {
      bloqueoAccionRef.current = false;
      setEnProcesoAccion(false);
    }
  }, [cargarReservas]);

  const registrarReserva = useCallback(async (datos) => {
    const resp = await crearReservaApi(datos);
    return interpretarRespuesta(resp);
  }, []);

  return { reservas, cargando, error, enProcesoAccion, recargar: () => cargarReservas(), cambiarEstado, registrarReserva };
}
