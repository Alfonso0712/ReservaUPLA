import { useState, useEffect, useCallback } from 'react';
import { reservaService } from '../services/reservaService';
import { interpretarRespuesta } from '../utils/interpretarRespuesta';

// RF-05 · RF-06 · RF-07 · E-18 a E-21 · E-31
export function useReservas() {
  const [reservas, setReservas] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [ambienteFiltro, setAmbienteFiltro] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const cargarReservas = useCallback(async () => {
    setCargando(true);
    setError('');
    const res = await reservaService.listarReservas({
      estado: estadoFiltro,
      ambienteId: ambienteFiltro,
      fecha: fechaFiltro,
      pagina,
      tamanoPagina: 10
    });
    const inter = interpretarRespuesta(res);
    if (inter.accion === 'exito') {
      setReservas(inter.datos?.items || []);
      setTotal(inter.datos?.totalItems || 0);
    } else {
      setError(inter.errorGeneral);
    }
    setCargando(false);
  }, [estadoFiltro, ambienteFiltro, fechaFiltro, pagina]);

  useEffect(() => {
    cargarReservas();
  }, [cargarReservas]);

  const cambiarEstado = async (id, nuevoEstado) => {
    const res = await reservaService.cambiarEstado(id, nuevoEstado);
    const inter = interpretarRespuesta(res);
    if (inter.accion === 'exito') {
      await cargarReservas();
    }
    return inter;
  };

  return {
    reservas, total, pagina, setPagina,
    estadoFiltro, setEstadoFiltro,
    ambienteFiltro, setAmbienteFiltro,
    fechaFiltro, setFechaFiltro,
    cargando, error,
    cargarReservas, cambiarEstado
  };
}
