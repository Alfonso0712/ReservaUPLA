// Manejadores mock de autenticación, usuarios y ambientes · RF-01 · RF-02 · E-01..11 · E-32
import { ROLES } from '../constants/roles';
import { ESTADOS_AMBIENTE } from '../constants/estados';
import { MENSAJES } from '../constants/mensajes';
import { validarLogin, validarRegistroSolicitante, validarAmbiente } from '../validation/validadores';
import { dbMock, guardarIdSesionMock, obtenerUsuarioActualMock, respuestaExito, respuestaError } from './estadoMock';

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
  return respuestaExito(usuario, 'Sesión iniciada.');
}

export function mockLogout() {
  guardarIdSesionMock('');
  return respuestaExito({ cerrado: true }, 'Sesión cerrada.');
}

export function mockObtenerYo() {
  const usuario = obtenerUsuarioActualMock();
  if (!usuario) return respuestaError(401, MENSAJES.CREDENCIALES_INVALIDAS);
  return respuestaExito(usuario, 'Sesión activa.');
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

export function mockListarAmbientes() {
  const usuario = obtenerUsuarioActualMock();
  if (usuario?.rol === ROLES.RESPONSABLE) {
    return respuestaExito(dbMock.ambientes.filter((a) => a.responsableId === usuario.id));
  }
  return respuestaExito([...dbMock.ambientes]);
}

export function mockCrearAmbiente(cuerpo = {}) {
  const usuario = obtenerUsuarioActualMock();
  if (usuario && usuario.rol !== ROLES.ADMINISTRADOR) return respuestaError(403, MENSAJES.ACCION_SOLO_ADMINISTRADOR);
  const val = validarAmbiente(cuerpo);
  if (!val.valido) return respuestaError(400, MENSAJES.RESUMEN_ERRORES_FORMULARIO, formatearErroresCampo(val.errores));
  const d = val.datosNormalizados;
  const resp = dbMock.usuarios.find((u) => u.id === d.responsableId);
  const nuevo = {
    id: `amb-${Date.now()}`, nombre: d.nombre, tipo: d.tipo, capacidad: d.capacidad,
    ubicacion: d.ubicacion, estado: ESTADOS_AMBIENTE.DISPONIBLE,
    responsableId: resp?.id || '', responsableNombre: resp?.nombreCompleto || 'Sin asignar'
  };
  dbMock.ambientes.push(nuevo);
  return respuestaExito(nuevo, MENSAJES.AMBIENTE_CREADO_EXITO, 201);
}
