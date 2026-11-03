import { peticionHttp } from '../utils/clienteHttp';

// RF-03 a RF-08 · RN-01 a RN-06
export const reservaService = {
  async crearReserva(dto) {
    return await peticionHttp('/api/reservas', {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  },

  async listarReservas({ estado, ambienteId, fecha, pagina = 1, tamanoPagina = 10 } = {}) {
    const params = new URLSearchParams();
    if (estado) params.append('estado', estado);
    if (ambienteId) params.append('ambienteId', ambienteId);
    if (fecha) params.append('fecha', fecha);
    params.append('pagina', pagina);
    params.append('tamanoPagina', tamanoPagina);

    return await peticionHttp(`/api/reservas?${params.toString()}`, {
      method: 'GET'
    });
  },

  async obtenerDetalle(id) {
    return await peticionHttp(`/api/reservas/${id}`, {
      method: 'GET'
    });
  },

  async cambiarEstado(id, estado) {
    return await peticionHttp(`/api/reservas/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado })
    });
  },

  async obtenerDashboard() {
    return await peticionHttp('/api/dashboard', {
      method: 'GET'
    });
  }
};
