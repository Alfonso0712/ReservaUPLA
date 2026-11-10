// Manejadores mock de autenticación y usuarios · RF-01 · E-01..09 · E-45..49
import { ROLES } from '../constants/roles';
import { MENSAJES } from '../constants/mensajes';
import {
  validarLogin,
  validarRegistroSolicitante,
  validarCrearUsuarioAdmin,
  validarEditarUsuarioAdmin
} from '../validation/validadores';
import { dbMock, guardarIdSesionMock, obtenerUsuarioActualMock, respuestaExito, respuestaError, formatearErroresCampo } from './estadoMock';
import { obtenerPermisosDeRol } from './permisosPorRol';

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
  const nuevo = { id: `usr-${Date.now()}`, nombreCompleto, correo, rol: ROLES.SOLICITANTE, activo: true, tema: 'claro', tamanoLetra: 'normal' };
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

export function mockActualizarPreferencias(cuerpo = {}) {
  const usuario = obtenerUsuarioActualMock();
  if (!usuario) return respuestaError(401, 'No autenticado.');
  if (cuerpo.tema && cuerpo.tema !== 'claro' && cuerpo.tema !== 'oscuro') {
    return respuestaError(400, 'El tema debe ser claro u oscuro.');
  }
  if (cuerpo.tamanoLetra && cuerpo.tamanoLetra !== 'pequeno' && cuerpo.tamanoLetra !== 'normal' && cuerpo.tamanoLetra !== 'grande') {
    return respuestaError(400, 'El tamaño de letra debe ser pequeno, normal o grande.');
  }
  if (cuerpo.tema) usuario.tema = cuerpo.tema;
  if (cuerpo.tamanoLetra) usuario.tamanoLetra = cuerpo.tamanoLetra;
  return respuestaExito(usuario, 'Preferencias actualizadas.');
}

// Módulo de Usuarios (Admin)
export function mockListarUsuariosAdmin(params = new URLSearchParams()) {
  const actual = obtenerUsuarioActualMock();
  if (!actual) return respuestaError(401, 'No autenticado.');
  if (actual.rol !== ROLES.ADMINISTRADOR) {
    return respuestaError(403, MENSAJES.ACCESO_DENEGADO || 'No tiene permiso para realizar esta acción.');
  }

  const busqueda = (params.get('busqueda') || '').trim().toLowerCase();
  const rol = params.get('rol') || '';
  const activoParam = params.get('activo');

  const lista = dbMock.usuarios
    .filter((u) => {
      if (busqueda && !u.nombreCompleto.toLowerCase().includes(busqueda) && !u.correo.toLowerCase().includes(busqueda)) {
        return false;
      }
      if (rol && u.rol !== rol) return false;
      if (activoParam !== null && activoParam !== undefined && activoParam !== '') {
        const boolActivo = activoParam === 'true';
        if (u.activo !== boolActivo) return false;
      }
      return true;
    })
    .map((u) => {
      const ambientesAsignados = (dbMock.ambientes || []).filter((a) => a.responsableId === u.id).length;
      return { ...u, ambientesAsignados };
    });

  return respuestaExito(lista);
}

export function mockCrearUsuarioAdmin(cuerpo = {}) {
  const actual = obtenerUsuarioActualMock();
  if (!actual) return respuestaError(401, 'No autenticado.');
  if (actual.rol !== ROLES.ADMINISTRADOR) {
    return respuestaError(403, MENSAJES.ACCESO_DENEGADO || 'No tiene permiso para realizar esta acción.');
  }

  const val = validarCrearUsuarioAdmin(cuerpo);
  if (!val.valido) return respuestaError(400, MENSAJES.RESUMEN_ERRORES_FORMULARIO, formatearErroresCampo(val.errores));

  const { nombreCompleto, correo, rol, contrasena } = val.datosNormalizados;
  if (dbMock.usuarios.some((u) => u.correo.toLowerCase() === correo.toLowerCase())) {
    return respuestaError(409, MENSAJES.CORREO_DUPLICADO, { correo: [MENSAJES.CORREO_DUPLICADO] });
  }

  const nuevo = {
    id: `usr-${Date.now()}`,
    nombreCompleto,
    correo,
    rol,
    activo: true,
    tema: 'claro',
    tamanoLetra: 'normal',
    ambientesAsignados: 0
  };

  dbMock.usuarios.push(nuevo);
  dbMock.claves[correo] = contrasena;
  return respuestaExito(nuevo, 'Usuario creado con éxito.', 201);
}

export function mockActualizarUsuarioAdmin(id, cuerpo = {}) {
  const actual = obtenerUsuarioActualMock();
  if (!actual) return respuestaError(401, 'No autenticado.');
  if (actual.rol !== ROLES.ADMINISTRADOR) {
    return respuestaError(403, MENSAJES.ACCESO_DENEGADO || 'No tiene permiso para realizar esta acción.');
  }

  const usuario = dbMock.usuarios.find((u) => u.id === id);
  if (!usuario) return respuestaError(404, 'El usuario seleccionado no existe.');

  if (usuario.rol === ROLES.ADMINISTRADOR) {
    return respuestaError(400, 'Las cuentas con rol Administrador no se pueden modificar ni desactivar desde este módulo.');
  }

  const val = validarEditarUsuarioAdmin(cuerpo);
  if (!val.valido) return respuestaError(400, MENSAJES.RESUMEN_ERRORES_FORMULARIO, formatearErroresCampo(val.errores));

  const { nombreCompleto, rol, contrasena } = val.datosNormalizados;
  const ambientesAsignados = (dbMock.ambientes || []).filter((a) => a.responsableId === id).length;

  if (usuario.rol === ROLES.RESPONSABLE && rol === ROLES.SOLICITANTE && ambientesAsignados > 0) {
    return respuestaError(400, 'No se puede cambiar el rol a Solicitante porque el usuario tiene ambientes asignados. Reasigne esos ambientes primero.');
  }

  usuario.nombreCompleto = nombreCompleto;
  usuario.rol = rol;
  if (contrasena) {
    dbMock.claves[usuario.correo] = contrasena;
  }

  return respuestaExito({ ...usuario, ambientesAsignados }, 'Usuario actualizado.');
}

export function mockCambiarEstadoUsuarioAdmin(id, cuerpo = {}) {
  const actual = obtenerUsuarioActualMock();
  if (!actual) return respuestaError(401, 'No autenticado.');
  if (actual.rol !== ROLES.ADMINISTRADOR) {
    return respuestaError(403, MENSAJES.ACCESO_DENEGADO || 'No tiene permiso para realizar esta acción.');
  }

  const usuario = dbMock.usuarios.find((u) => u.id === id);
  if (!usuario) return respuestaError(404, 'El usuario seleccionado no existe.');

  if (usuario.rol === ROLES.ADMINISTRADOR) {
    return respuestaError(400, 'Las cuentas con rol Administrador no se pueden modificar ni desactivar desde este módulo.');
  }

  const nuevoActivo = Boolean(cuerpo.activo);
  if (!nuevoActivo && actual.id === id) {
    return respuestaError(400, 'Un administrador no puede desactivarse a sí mismo.');
  }

  usuario.activo = nuevoActivo;
  const ambientesAsignados = (dbMock.ambientes || []).filter((a) => a.responsableId === id).length;

  return respuestaExito({ ...usuario, ambientesAsignados }, `Usuario ${nuevoActivo ? 'activado' : 'desactivado'}.`);
}

export { mockListarAmbientes, mockCrearAmbiente, mockActualizarAmbiente, mockCambiarEstadoAmbiente } from './manejadoresAmbientes';
