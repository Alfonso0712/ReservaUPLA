// Servicio HTTP de indicadores del panel · RF-08 · GET /api/dashboard · E-30
import { solicitarApi } from './apiClient';

export async function obtenerDashboardApi(signal) {
  return solicitarApi('/api/dashboard', {
    metodo: 'GET',
    signal
  });
}
