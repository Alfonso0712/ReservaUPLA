// Manejadores mock de autenticación y usuarios · RF-01 · E-01..09 · E-45..49
import { ROLES } from '../constants/roles';
import { MENSAJES } from '../constants/mensajes';
import { validarLogin, validarRegistroSolicitante } from '../validation/validadores';
import { dbMock, guardarIdSesionMock, obtenerUsuarioActualMock, respuestaExito, respuestaError } from './estadoMock';
import { obtenerPermisosDeRol } from './permisosPorRol';

function formatearErroresCampo(errores) {
  return Object.fromEntries(Object.entries(errores).map(([k, v]) => [k, [v]]));
}

export function mockLogin(cuerpo = {}) {
  const val = validarLogin(cuerpo);
  if (!val.valido) return respuestaError(400, MENSAJES.RESUMEN_ERRORES_FORMULARIO, formatearErroresCampo(val.errores));
  const usuario = dbMock.usuarios.find((u) => u.correo === val.correoNormalizado && u.activo);
  if (!usuario || dbMock.claves[val.correoNormalizado] !== cuerpo.contrasena) {
    return respuestaError(401, MENSAJES.CREDENCIALES_INVALIDAS);
  }
  guardarIdSesionMock(usuario.id);
  const permisos = obtenerPermisosDeRol(usuario.rol);
  return respuestaExito({ usuario, permisos }, 'Sesión iniciada.');
}

export function mockLogout() {
  guardarIdSesionMock('');
  return respuestaExito({ cerrado: true }, 'Sesión cerrada.');
}

export function mockObtenerYo() {
  const usuario = obtenerUsuarioActualMock();
  if (!usuario) return respuestaError(401, MENSAJES.CREDENCIALES_INVALIDAS);
  const permisos = obtenerPermisosDeRol(usuario.rol);
  return respuestaExito({ usuario, permisos }, 'Sesión activa.');
}

export function mockRegistrarUsuario(cuerpo = {}) {
  const val = validarRegistroSolicitante(cuerpo);
  if (!val.valido) return respuestaError(400, MENSAJES.RESUMEN_ERRORES_FORMULARIO, formatearErroresCampo(val.errores));
  const { nombreCompleto, correo, contrasena } = val.datosNormalizados;
  if (dbMock.usuarios.some((u) => u.correo === correo)) {
    return respuestaError(409, MENSAJES.CORREO_DUPLICADO, { correo: [MENSAJES.CORREO_DUPLICADO] });
  }
  const nuevo = { id: `usr-${Date.now()}`, nombreCompleto, correo, rol: ROLES.SOLICITANTE, activo: true };
  dbMock.usuarios.push(nuevo);
  dbMock.claves[correo] = contrasena;
  return respuestaExito(nuevo, MENSAJES.REGISTRO_EXITOSO_TITULO, 201);
}

export function mockListarResponsables() {
  const usuario = obtenerUsuarioActualMock();
  if (usuario && usuario.rol !== ROLES.ADMINISTRADOR) {
    return respuestaError(403, MENSAJES.ACCESO_DENEGADO || 'No tiene permiso para realizar esta acción.');
  }
  const lista = dbMock.usuarios.filter((u) => u.activo && u.rol === ROLES.RESPONSABLE);
  return respuestaExito(lista);
}

export { mockListarAmbientes, mockCrearAmbiente, mockActualizarAmbiente, mockCambiarEstadoAmbiente } from './manejadoresAmbientes';
