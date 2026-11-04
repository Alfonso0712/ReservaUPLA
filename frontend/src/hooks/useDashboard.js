// Hook de indicadores del panel sin condiciones de carrera · RF-08 · E-30
import { useState, useEffect, useRef, useCallback } from 'react';
import { obtenerDashboardApi } from '../services/dashboardService';
import { interpretarRespuesta } from '../validation/interpretarRespuesta';

export function useDashboard(versionExterna = 0) {
  const [indicadores, setIndicadores] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const peticionActualRef = useRef(0);

  const cargarDashboard = useCallback(async (signal) => {
    const idActual = ++peticionActualRef.current;
    setCargando(true);
    setError('');
    const resp = await obtenerDashboardApi(signal);
    if (signal?.aborted || idActual !== peticionActualRef.current) return;
    const resultado = interpretarRespuesta(resp);
    if (resultado.ok) {
      setIndicadores(resultado.datos);
    } else {
      setError(resultado.errorGeneral);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    cargarDashboard(ctrl.signal);
    return () => ctrl.abort();
  }, [cargarDashboard, versionExterna]);

  return {
    indicadores,
    cargando,
    error,
    recargar: () => cargarDashboard()
  };
}
