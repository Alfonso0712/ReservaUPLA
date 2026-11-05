// Enrutador del adaptador mock con latencia y simulación de fallos · E-04 · E-08 · E-09 · E-23 · E-24 · E-39..44
import { MENSAJES } from '../constants/mensajes';
import { dbMock, reiniciarBaseMock, configurarFalloMock, guardarIdSesionMock, respuestaExito, respuestaError } from './estadoMock';
import { CUENTAS_DEMO } from './datosSemilla';
import { mockLogin, mockLogout, mockObtenerYo, mockRegistrarUsuario, mockListarResponsables, mockActualizarPreferencias } from './manejadoresAuthAmbientes';
import { mockListarAmbientes, mockCrearAmbiente, mockActualizarAmbiente, mockCambiarEstadoAmbiente } from './manejadoresAmbientes';
import { mockObtenerDisponibilidad, mockListarReservas, mockObtenerReserva, mockCrearReserva, mockCambiarEstadoReserva, mockObtenerDashboard } from './manejadoresReservasDashboard';

function esperarLatencia(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Error('AbortError'));
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => { clearTimeout(timer); reject(new Error('AbortError')); }, { once: true });
  });
}

const RUTAS_ESTATICAS = {
  'POST /api/auth/login': (_, cuerpo) => mockLogin(cuerpo),
  'POST /api/auth/logout': () => mockLogout(),
  'GET /api/auth/yo': () => mockObtenerYo(),
  'POST /api/usuarios': (_, cuerpo) => mockRegistrarUsuario(cuerpo),
  'PATCH /api/usuarios/preferencias': (_, cuerpo) => mockActualizarPreferencias(cuerpo),
  'GET /api/usuarios/responsables': () => mockListarResponsables(),
  'GET /api/usuarios': () => respuestaExito([...dbMock.usuarios]),
  'GET /api/ambientes': () => mockListarAmbientes(),
  'POST /api/ambientes': (_, cuerpo) => mockCrearAmbiente(cuerpo),
  'GET /api/reservas': (params) => mockListarReservas({
    estado: params.get('estado') || '', tipo: params.get('tipo') || '', texto: params.get('texto') || ''
  }),
  'POST /api/reservas': (_, cuerpo) => mockCrearReserva(cuerpo),
  'GET /api/dashboard': () => mockObtenerDashboard()
};

const RUTAS_DINAMICAS = [
  { regex: /^PATCH \/api\/ambientes\/([^/]+)\/estado$/, handler: (m, _, cuerpo) => mockCambiarEstadoAmbiente(m[1], cuerpo) },
  { regex: /^PUT \/api\/ambientes\/([^/]+)$/, handler: (m, _, cuerpo) => mockActualizarAmbiente(m[1], cuerpo) },
  { regex: /^GET \/api\/ambientes\/([^/]+)\/disponibilidad$/, handler: (m, params) => mockObtenerDisponibilidad(m[1], params.get('fecha') || '') },
  { regex: /^PATCH \/api\/reservas\/([^/]+)\/estado$/, handler: (m, _, cuerpo) => mockCambiarEstadoReserva(m[1], cuerpo) },
  { regex: /^GET \/api\/reservas\/([^/]+)$/, handler: (m) => mockObtenerReserva(m[1]) }
];

function despacharRutaMock(metodo, urlLimpia, parametros, cuerpo) {
  const clave = `${metodo} ${urlLimpia}`;
  const estatica = RUTAS_ESTATICAS[clave];
  if (estatica) return estatica(parametros, cuerpo);
  for (const { regex, handler } of RUTAS_DINAMICAS) {
    const match = clave.match(regex);
    if (match) return handler(match, parametros, cuerpo);
  }
  return respuestaError(404, 'Ruta no encontrada en el adaptador mock.');
}

export async function ejecutarPeticionMock(ruta, { metodo = 'GET', cuerpo = null, signal } = {}) {
  await esperarLatencia(dbMock.latenciaMs, signal);
  if (dbMock.falloSimulado !== null) {
    const codigo = dbMock.falloSimulado;
    dbMock.falloSimulado = null;
    if (codigo === 0) return { estado: 0, datos: null };
    return respuestaError(codigo, codigo === 429 ? MENSAJES.LIMITE_INTENTOS : MENSAJES.ERROR_SERVIDOR);
  }
  const [urlLimpia, query = ''] = ruta.split('?');
  return despacharRutaMock(metodo.toUpperCase(), urlLimpia, new URLSearchParams(query), cuerpo);
}

export { dbMock, reiniciarBaseMock, configurarFalloMock, guardarIdSesionMock, CUENTAS_DEMO };
