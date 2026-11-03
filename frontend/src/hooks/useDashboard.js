import { useState, useEffect, useCallback } from 'react';
import { reservaService } from '../services/reservaService';
import { interpretarRespuesta } from '../utils/interpretarRespuesta';

// RF-08 · E-30
export function useDashboard() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const cargarEstadisticas = useCallback(async () => {
    setCargando(true);
    setError('');
    const res = await reservaService.obtenerDashboard();
    const inter = interpretarRespuesta(res);
    if (inter.accion === 'exito') {
      setEstadisticas(inter.datos);
    } else {
      setError(inter.errorGeneral);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  return { estadisticas, cargando, error, cargarEstadisticas };
}
