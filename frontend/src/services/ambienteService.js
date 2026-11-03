import { peticionHttp } from '../utils/clienteHttp';

// RF-02 · RF-04 · RV-04 a RV-07
export const ambienteService = {
  async listarAmbientes() {
    return await peticionHttp('/api/ambientes', {
      method: 'GET'
    });
  },

  async crearAmbiente(dto) {
    return await peticionHttp('/api/ambientes', {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  },

  async consultarDisponibilidad(ambienteId, fecha) {
    return await peticionHttp(`/api/ambientes/${ambienteId}/disponibilidad?fecha=${fecha}`, {
      method: 'GET'
    });
  }
};
