// Manejadores mock de catálogo de ambientes · RF-02 · RV-04..07 · RV-17..18 · E-10..11 · E-39..44
import { ROLES } from '../constants/roles';
import { ESTADOS_AMBIENTE, ESTADOS_RESERVA } from '../constants/estados';
import { MENSAJES } from '../constants/mensajes';
import { validarAmbiente, validarEstadoAmbiente, validarNombreAmbienteUnico } from '../validation/validadores';
import { dbMock, obtenerUsuarioActualMock, respuestaExito, respuestaError } from './estadoMock';
import { obtenerFechaHoyIso } from '../utils/formatearFecha';

function formatearErroresCampo(errores) {
  return Object.fromEntries(Object.entries(errores).map(([k, v]) => [k, [v]]));
}

export function contarReservasFuturasActivas(ambienteId) {
  const hoy = obtenerFechaHoyIso();
  return dbMock.reservas.filter((r) => (r.ambiente?.id || r.ambienteId) === ambienteId && (r.estado === ESTADOS_RESERVA.PENDIENTE || r.estado === ESTADOS_RESERVA.APROBADA) && r.fecha >= hoy).length;
}

function mapearAmbienteConFuturas(a) {
  return { ...a, reservasFuturasActivas: contarReservasFuturasActivas(a.id) };
}

export function mockListarAmbientes() {
  const usuario = obtenerUsuarioActualMock();
  const lista = usuario?.rol === ROLES.RESPONSABLE ? dbMock.ambientes.filter((a) => a.responsableId === usuario.id) : dbMock.ambientes;
  return respuestaExito(lista.map(mapearAmbienteConFuturas));
}

export function mockCrearAmbiente(cuerpo = {}) {
  const usuario = obtenerUsuarioActualMock();
  if (usuario && usuario.rol !== ROLES.ADMINISTRADOR) return respuestaError(403, MENSAJES.ACCION_SOLO_ADMINISTRADOR);
  const val = validarAmbiente(cuerpo);
  if (!val.valido) return respuestaError(400, MENSAJES.RESUMEN_ERRORES_FORMULARIO, formatearErroresCampo(val.errores));
  const errNom = validarNombreAmbienteUnico(val.datosNormalizados.nombre, '', dbMock.ambientes);
  if (errNom) return respuestaError(409, errNom, { nombre: [errNom] });
  const d = val.datosNormalizados;
  const resp = dbMock.usuarios.find((u) => u.id === d.responsableId);
  const nuevo = {
    id: `amb-${Date.now()}`, nombre: d.nombre, tipo: d.tipo, capacidad: d.capacidad,
    ubicacion: d.ubicacion, estado: ESTADOS_AMBIENTE.DISPONIBLE,
    responsableId: resp?.id || '', responsableNombre: resp?.nombreCompleto || 'Sin asignar'
  };
  dbMock.ambientes.push(nuevo);
  return respuestaExito(mapearAmbienteConFuturas(nuevo), MENSAJES.AMBIENTE_CREADO_EXITO, 201);
}

export function mockActualizarAmbiente(id, cuerpo = {}) {
  const usuario = obtenerUsuarioActualMock();
  if (usuario && usuario.rol !== ROLES.ADMINISTRADOR) return respuestaError(403, MENSAJES.ACCION_SOLO_ADMINISTRADOR);
  const amb = dbMock.ambientes.find((a) => a.id === id);
  if (!amb) return respuestaError(404, 'No se encontró el ambiente solicitado.');
  const val = validarAmbiente(cuerpo);
  if (!val.valido) return respuestaError(400, MENSAJES.RESUMEN_ERRORES_FORMULARIO, formatearErroresCampo(val.errores));
  const errNom = validarNombreAmbienteUnico(val.datosNormalizados.nombre, id, dbMock.ambientes);
  if (errNom) return respuestaError(409, errNom, { nombre: [errNom] });
  const d = val.datosNormalizados;
  const resp = dbMock.usuarios.find((u) => u.id === d.responsableId);
  Object.assign(amb, {
    nombre: d.nombre, tipo: d.tipo, capacidad: d.capacidad,
    ubicacion: d.ubicacion, responsableId: resp?.id || '', responsableNombre: resp?.nombreCompleto || 'Sin asignar'
  });
  dbMock.reservas.forEach((r) => { if (r.ambiente?.id === id) { r.ambiente.nombre = d.nombre; r.ambiente.tipo = d.tipo; } });
  return respuestaExito(mapearAmbienteConFuturas(amb), MENSAJES.AMBIENTE_ACTUALIZADO_EXITO);
}

export function mockCambiarEstadoAmbiente(id, { estado: nuevoEstado } = {}) {
  const usuario = obtenerUsuarioActualMock();
  if (usuario && usuario.rol !== ROLES.ADMINISTRADOR) return respuestaError(403, MENSAJES.ACCION_SOLO_ADMINISTRADOR);
  const amb = dbMock.ambientes.find((a) => a.id === id);
  if (!amb) return respuestaError(404, 'No se encontró el ambiente solicitado.');
  const errEst = validarEstadoAmbiente(nuevoEstado);
  if (errEst) return respuestaError(400, errEst, { estado: [errEst] });
  amb.estado = nuevoEstado;
  return respuestaExito(mapearAmbienteConFuturas(amb), MENSAJES.AMBIENTE_ESTADO_ACTUALIZADO_EXITO);
}
