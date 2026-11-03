import { useState, useEffect, useCallback } from 'react';
import { ambienteService } from '../services/ambienteService';
import { interpretarRespuesta } from '../utils/interpretarRespuesta';

// RF-02 · RF-04
export function useAmbientes() {
  const [ambientes, setAmbientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const cargarAmbientes = useCallback(async () => {
    setCargando(true);
    setError('');
    const res = await ambienteService.listarAmbientes();
    const interpretacion = interpretarRespuesta(res);
    if (interpretacion.accion === 'exito') {
      setAmbientes(interpretacion.datos || []);
    } else {
      setError(interpretacion.errorGeneral);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarAmbientes();
  }, [cargarAmbientes]);

  const registrarAmbiente = async (dto) => {
    const res = await ambienteService.crearAmbiente(dto);
    const interpretacion = interpretarRespuesta(res);
    if (interpretacion.accion === 'exito') {
      await cargarAmbientes();
    }
    return interpretacion;
  };

  return { ambientes, cargando, error, cargarAmbientes, registrarAmbiente };
}
