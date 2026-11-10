// Servicio HTTP de usuarios · RF-01 · POST /api/usuarios · GET /api/usuarios/responsables · E-01..06
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

export async function listarResponsablesApi(signal) {
  return solicitarApi('/api/usuarios/responsables', {
    metodo: 'GET',
    signal
  });
}

export async function actualizarPreferenciasApi({ tema, tamanoLetra }, signal) {
  return solicitarApi('/api/usuarios/preferencias', {
    metodo: 'PATCH',
    cuerpo: { tema, tamanoLetra },
    signal
  });
}

// Módulo de Usuarios (Admin)
export async function listarUsuariosAdminApi({ busqueda, rol, activo } = {}, signal) {
  const params = new URLSearchParams();
  if (busqueda) params.append('busqueda', busqueda);
  if (rol) params.append('rol', rol);
  if (activo !== undefined && activo !== null && activo !== '') params.append('activo', activo);
  const query = params.toString() ? `?${params.toString()}` : '';
  return solicitarApi(`/api/usuarios/admin${query}`, {
    metodo: 'GET',
    signal
  });
}

export async function crearUsuarioAdminApi({ nombreCompleto, correo, rol, contrasena }, signal) {
  return solicitarApi('/api/usuarios/admin', {
    metodo: 'POST',
    cuerpo: { nombreCompleto, correo, rol, contrasena },
    signal
  });
}

export async function actualizarUsuarioAdminApi(id, { nombreCompleto, rol, contrasena }, signal) {
  const cuerpo = { nombreCompleto, rol };
  if (contrasena) cuerpo.contrasena = contrasena;
  return solicitarApi(`/api/usuarios/${encodeURIComponent(id)}`, {
    metodo: 'PUT',
    cuerpo,
    signal
  });
}

export async function cambiarEstadoUsuarioAdminApi(id, activo, signal) {
  return solicitarApi(`/api/usuarios/${encodeURIComponent(id)}/estado`, {
    metodo: 'PATCH',
    cuerpo: { activo },
    signal
  });
}
