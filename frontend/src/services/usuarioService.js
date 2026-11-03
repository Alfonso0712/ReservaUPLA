import { peticionHttp } from '../utils/clienteHttp';

// RF-01 · RV-01 a RV-03
export const usuarioService = {
  async registrarSolicitante(dto) {
    return await peticionHttp('/api/usuarios', {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  }
};
