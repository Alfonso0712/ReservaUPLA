// Servicio HTTP de usuarios · RF-01 · POST /api/usuarios · E-01..06
import { solicitarApi } from './apiClient';

export async function registrarSolicitanteApi({ nombreCompleto, correo, contrasena }, signal) {
  return solicitarApi('/api/usuarios', {
    metodo: 'POST',
    cuerpo: { nombreCompleto, correo, contrasena },
    signal
  });
}

export async function listarUsuariosApi(signal) {
  return solicitarApi('/api/usuarios', {
    metodo: 'GET',
    signal
  });
}
