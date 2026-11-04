// Estado en memoria y sesión por id en sessionStorage para el adaptador mock
import { CLAVE_SESION_MOCK } from '../constants/reglas';
import { USUARIOS_SEMILLA, CLAVES_MOCK, AMBIENTES_SEMILLA, RESERVAS_SEMILLA } from './datosSemilla';

function clonar(datos) {
  return JSON.parse(JSON.stringify(datos));
}

export const dbMock = {
  usuarios: clonar(USUARIOS_SEMILLA),
  claves: { ...CLAVES_MOCK },
  ambientes: clonar(AMBIENTES_SEMILLA),
  reservas: clonar(RESERVAS_SEMILLA),
  falloSimulado: null,
  latenciaMs: 15
};

export function reiniciarBaseMock() {
  dbMock.usuarios = clonar(USUARIOS_SEMILLA);
  dbMock.claves = { ...CLAVES_MOCK };
  dbMock.ambientes = clonar(AMBIENTES_SEMILLA);
  dbMock.reservas = clonar(RESERVAS_SEMILLA);
  dbMock.falloSimulado = null;
}

export function configurarFalloMock(codigo = null) {
  dbMock.falloSimulado = codigo;
}

export function obtenerIdSesionMock() {
  try {
    return sessionStorage.getItem(CLAVE_SESION_MOCK) || '';
  } catch {
    return '';
  }
}

export function guardarIdSesionMock(idUsuario) {
  try {
    if (idUsuario) sessionStorage.setItem(CLAVE_SESION_MOCK, String(idUsuario));
    else sessionStorage.removeItem(CLAVE_SESION_MOCK);
  } catch {
    // Almacenamiento restringido
  }
}

export function obtenerUsuarioActualMock() {
  const id = obtenerIdSesionMock();
  return dbMock.usuarios.find((u) => u.id === id) || null;
}

export function respuestaExito(data, message = 'Operación completada.', estado = 200) {
  return { estado, datos: { success: true, message, data, errors: null } };
}

export function respuestaError(estado, message, errors = null) {
  return { estado, datos: { success: false, message, data: null, errors } };
}
