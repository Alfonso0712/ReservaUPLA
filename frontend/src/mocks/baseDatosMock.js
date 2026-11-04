// Enrutador del adaptador mock con latencia y simulación de fallos · E-04 · E-08 · E-09 · E-23 · E-24 · E-39..44
import { MENSAJES } from '../constants/mensajes';
import { dbMock, reiniciarBaseMock, configurarFalloMock, guardarIdSesionMock, respuestaExito, respuestaError } from './estadoMock';
import { CUENTAS_DEMO } from './datosSemilla';
import { mockLogin, mockLogout, mockObtenerYo, mockRegistrarUsuario, mockListarResponsables, mockListarAmbientes, mockCrearAmbiente, mockActualizarAmbiente, mockCambiarEstadoAmbiente } from './manejadoresAuthAmbientes';
import { mockObtenerDisponibilidad, mockListarReservas, mockObtenerReserva, mockCrearReserva, mockCambiarEstadoReserva, mockObtenerDashboard } from './manejadoresReservasDashboard';

function esperarLatencia(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Error('AbortError'));
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => { clearTimeout(timer); reject(new Error('AbortError')); }, { once: true });
  });
}

function despacharRutaMock(metodo, urlLimpia, parametros, cuerpo) {
  if (metodo === 'POST' && urlLimpia === '/api/auth/login') return mockLogin(cuerpo);
  if (metodo === 'POST' && urlLimpia === '/api/auth/logout') return mockLogout();
  if (metodo === 'GET' && urlLimpia === '/api/auth/yo') return mockObtenerYo();
  if (metodo === 'POST' && urlLimpia === '/api/usuarios') return mockRegistrarUsuario(cuerpo);
  if (metodo === 'GET' && urlLimpia === '/api/usuarios/responsables') return mockListarResponsables();
  if (metodo === 'GET' && urlLimpia === '/api/usuarios') return respuestaExito([...dbMock.usuarios]);
  if (metodo === 'GET' && urlLimpia === '/api/ambientes') return mockListarAmbientes();
  if (metodo === 'POST' && urlLimpia === '/api/ambientes') return mockCrearAmbiente(cuerpo);
  const matchAmbEstado = urlLimpia.match(/^\/api\/ambientes\/([^/]+)\/estado$/);
  if (metodo === 'PATCH' && matchAmbEstado) return mockCambiarEstadoAmbiente(matchAmbEstado[1], cuerpo);
  const matchAmb = urlLimpia.match(/^\/api\/ambientes\/([^/]+)$/);
  if (metodo === 'PUT' && matchAmb) return mockActualizarAmbiente(matchAmb[1], cuerpo);
  const matchDisp = urlLimpia.match(/^\/api\/ambientes\/([^/]+)\/disponibilidad$/);
  if (metodo === 'GET' && matchDisp) return mockObtenerDisponibilidad(matchDisp[1], parametros.get('fecha') || '');
  if (metodo === 'GET' && urlLimpia === '/api/reservas') {
    return mockListarReservas({ estado: parametros.get('estado') || '', tipo: parametros.get('tipo') || '', texto: parametros.get('texto') || '' });
  }
  if (metodo === 'POST' && urlLimpia === '/api/reservas') return mockCrearReserva(cuerpo);
  const matchEstado = urlLimpia.match(/^\/api\/reservas\/([^/]+)\/estado$/);
  if (metodo === 'PATCH' && matchEstado) return mockCambiarEstadoReserva(matchEstado[1], cuerpo);
  const matchRes = urlLimpia.match(/^\/api\/reservas\/([^/]+)$/);
  if (metodo === 'GET' && matchRes) return mockObtenerReserva(matchRes[1]);
  if (metodo === 'GET' && urlLimpia === '/api/dashboard') return mockObtenerDashboard();
  return respuestaError(404, 'Ruta no encontrada en el adaptador mock.');
}

export async function ejecutarPeticionMock(ruta, { metodo = 'GET', cuerpo = null, signal } = {}) {
  await esperarLatencia(dbMock.latenciaMs, signal);
  if (dbMock.falloSimulado !== null) {
    const codigo = dbMock.falloSimulado;
    dbMock.falloSimulado = null;
    if (codigo === 0) return { estado: 0, datos: null };
    if (codigo === 429) return respuestaError(429, MENSAJES.LIMITE_INTENTOS);
    if (codigo === 500) return respuestaError(500, MENSAJES.ERROR_SERVIDOR);
    return respuestaError(codigo, MENSAJES.ERROR_SERVIDOR);
  }
  const [urlLimpia, query = ''] = ruta.split('?');
  return despacharRutaMock(metodo.toUpperCase(), urlLimpia, new URLSearchParams(query), cuerpo);
}

export { dbMock, reiniciarBaseMock, configurarFalloMock, guardarIdSesionMock, CUENTAS_DEMO };
