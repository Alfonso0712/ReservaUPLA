// Servicio HTTP de ambientes y disponibilidad · RF-02 · RF-04 · E-10 · E-11 · E-17 · E-32
import { solicitarApi } from './apiClient';

export async function listarAmbientesApi(signal) {
  return solicitarApi('/api/ambientes', {
    metodo: 'GET',
    signal
  });
}

export async function crearAmbienteApi(datosAmbiente, signal) {
  return solicitarApi('/api/ambientes', {
    metodo: 'POST',
    cuerpo: datosAmbiente,
    signal
  });
}

export async function consultarDisponibilidadApi(ambienteId, fecha, signal) {
  const params = new URLSearchParams({ fecha: fecha || '' });
  return solicitarApi(`/api/ambientes/${encodeURIComponent(ambienteId)}/disponibilidad?${params.toString()}`, {
    metodo: 'GET',
    signal
  });
}
