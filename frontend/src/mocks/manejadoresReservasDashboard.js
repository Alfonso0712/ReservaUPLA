// Manejadores mock de reservas, disponibilidad y dashboard · RF-03..08 · RN-01..06 · E-12..32
import { ROLES } from '../constants/roles';
import { ESTADOS_RESERVA } from '../constants/estados';
import { MENSAJES } from '../constants/mensajes';
import { normalizarTexto } from '../utils/normalizarTexto';
import { validarReserva, verificarDisponibilidadLocal, validarTransicionEstado } from '../validation/validadores';
import { dbMock, obtenerUsuarioActualMock, respuestaExito, respuestaError } from './estadoMock';

function filtrarPorRol(reservas, usuario) {
  if (!usuario || usuario.rol === ROLES.ADMINISTRADOR) return reservas;
  if (usuario.rol === ROLES.SOLICITANTE) return reservas.filter((r) => r.solicitante.id === usuario.id);
  const idsAmb = dbMock.ambientes.filter((a) => a.responsableId === usuario.id).map((a) => a.id);
  return reservas.filter((r) => idsAmb.includes(r.ambiente.id));
}

export function mockObtenerDisponibilidad(ambienteId, fecha) {
  const ocupados = dbMock.reservas.filter((r) => r.ambiente.id === ambienteId && r.fecha === fecha && r.estado === ESTADOS_RESERVA.APROBADA).map(({ id, horaInicio, horaFin }) => ({ id, horaInicio, horaFin }));
  return respuestaExito({ ambienteId, fecha, ocupados });
}

export function mockListarReservas({ estado = '', tipo = '', texto = '' } = {}) {
  const base = filtrarPorRol(dbMock.reservas, obtenerUsuarioActualMock());
  const busq = normalizarTexto(texto).toLowerCase();
  const lista = base.filter((r) => (!estado || r.estado === estado) && (!tipo || r.ambiente.tipo === tipo) && (!busq || `${r.solicitante.nombreCompleto} ${r.ambiente.nombre} ${r.motivo}`.toLowerCase().includes(busq)));
  return respuestaExito(lista);
}

export function mockObtenerReserva(id) {
  const item = dbMock.reservas.find((r) => r.id === id);
  return item ? respuestaExito(item) : respuestaError(404, 'No se encontró la reserva solicitada.');
}

export function mockCrearReserva(cuerpo = {}) {
  const usuario = obtenerUsuarioActualMock();
  const esAdmin = usuario?.rol === ROLES.ADMINISTRADOR;
  if (!verificarDisponibilidadLocal(dbMock.reservas, cuerpo)) return respuestaError(409, MENSAJES.RESERVA_SOLAPE_HORARIO, { horaFin: [MENSAJES.RESERVA_SOLAPE_HORARIO] });
  const val = validarReserva(cuerpo, { reservasExistentes: dbMock.reservas, requiereSolicitante: esAdmin });
  if (!val.valido) return respuestaError(400, MENSAJES.RESUMEN_ERRORES_FORMULARIO, Object.fromEntries(Object.entries(val.errores).map(([k, v]) => [k, [v]])));
  const amb = dbMock.ambientes.find((a) => a.id === cuerpo.ambienteId) || dbMock.ambientes[0];
  const solic = (esAdmin && dbMock.usuarios.find((u) => u.id === cuerpo.solicitanteId)) || usuario || dbMock.usuarios[2];
  const nueva = {
    id: `res-${Date.now()}`, fecha: cuerpo.fecha, horaInicio: cuerpo.horaInicio, horaFin: cuerpo.horaFin,
    motivo: normalizarTexto(cuerpo.motivo), estado: ESTADOS_RESERVA.PENDIENTE,
    solicitante: { id: solic.id, nombreCompleto: solic.nombreCompleto, correo: solic.correo },
    ambiente: { id: amb.id, nombre: amb.nombre, tipo: amb.tipo }, fechaRegistro: new Date().toISOString()
  };
  dbMock.reservas.unshift(nueva);
  return respuestaExito(nueva, MENSAJES.RESERVA_CREADA_EXITO, 201);
}

export function mockCambiarEstadoReserva(id, { estado: nuevoEstado } = {}) {
  const reserva = dbMock.reservas.find((r) => r.id === id);
  if (!reserva) return respuestaError(404, 'Reserva no encontrada.');
  const trans = validarTransicionEstado(reserva.estado, nuevoEstado, obtenerUsuarioActualMock()?.rol || ROLES.ADMINISTRADOR);
  if (!trans.valido) return respuestaError(trans.error === MENSAJES.ACCION_SOLO_ADMINISTRADOR ? 403 : 409, trans.error);
  reserva.estado = nuevoEstado;
  return respuestaExito({ ...reserva }, 'Estado actualizado.');
}

export function mockObtenerDashboard() {
  const base = filtrarPorRol(dbMock.reservas, obtenerUsuarioActualMock());
  const conteo = {};
  base.forEach((r) => { conteo[r.ambiente.nombre] = (conteo[r.ambiente.nombre] || 0) + 1; });
  const top = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0];
  const contar = (est) => base.filter((r) => r.estado === est).length;
  return respuestaExito({
    total: base.length, pendientes: contar(ESTADOS_RESERVA.PENDIENTE), aprobadas: contar(ESTADOS_RESERVA.APROBADA),
    rechazadas: contar(ESTADOS_RESERVA.RECHAZADA), canceladas: contar(ESTADOS_RESERVA.CANCELADA),
    ambienteMasUtilizado: top ? { nombre: top[0], cantidad: top[1] } : { nombre: 'Sin registros', cantidad: 0 }
  });
}
