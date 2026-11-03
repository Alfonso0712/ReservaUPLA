import { MENSAJES } from '../constants/mensajes';

// E-23 · Timeout 10s con AbortController y estado 0 ante fallo de red
export async function peticionHttp(url, opciones = {}) {
  const controlador = new AbortController();
  const idTemporizador = setTimeout(() => controlador.abort(), 10000);

  try {
    const respuesta = await fetch(url, {
      ...opciones,
      credentials: 'include',
      signal: controlador.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(opciones.headers || {})
      }
    });
    clearTimeout(idTemporizador);

    let datos = null;
    const tipoContenido = respuesta.headers.get('content-type') || '';
    if (tipoContenido.includes('application/json')) {
      datos = await respuesta.json();
    }

    return { estado: respuesta.status, datos, ok: respuesta.ok };
  } catch (err) {
    clearTimeout(idTemporizador);
    return {
      estado: 0,
      datos: { error: MENSAJES.ERROR_CONEXION },
      ok: false,
      esAborto: err.name === 'AbortError'
    };
  }
}
