import { peticionHttp } from '../utils/clienteHttp';

// E-07 · E-08 · E-09
export const authService = {
  async login(correo, contrasena) {
    return await peticionHttp('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo, contrasena })
    });
  },

  async logout() {
    return await peticionHttp('/api/auth/logout', {
      method: 'POST'
    });
  },

  async obtenerUsuarioActual() {
    return await peticionHttp('/api/auth/yo', {
      method: 'GET'
    });
  }
};
