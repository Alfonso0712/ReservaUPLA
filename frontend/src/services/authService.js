// Servicio HTTP de autenticación · POST /api/auth/login · POST /api/auth/logout · GET /api/auth/yo · E-07..09
import { solicitarApi } from './apiClient';

export async function iniciarSesionApi({ correo, contrasena }, signal) {
  return solicitarApi('/api/auth/login', {
    metodo: 'POST',
    cuerpo: { correo, contrasena },
    signal
  });
}

export async function cerrarSesionApi(signal) {
  return solicitarApi('/api/auth/logout', {
    metodo: 'POST',
    signal
  });
}

export async function obtenerSesionActualApi(signal) {
  return solicitarApi('/api/auth/yo', {
    metodo: 'GET',
    signal
  });
}
