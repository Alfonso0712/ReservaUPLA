// Cliente HTTP con AbortController (10 s), credentials: 'include' y adaptador mock · E-23 · E-24
import { TIMEOUT_PETICION_MS } from '../constants/reglas';
import { ejecutarPeticionMock } from '../mocks/baseDatosMock';

function usarAdaptadorMock() {
  const valor = import.meta.env?.VITE_USAR_MOCK;
  return valor === 'true' || valor === true;


}

function construirUrl(ruta) {
  const base = (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '');
  return `${base}${ruta}`;
}

async function ejecutarFetchReal(ruta, { metodo = 'GET', cuerpo = null, signal } = {}) {
  const controlador = new AbortController();
  const idTimeout = setTimeout(() => controlador.abort(), TIMEOUT_PETICION_MS);
  const abortarExterno = () => controlador.abort();
  signal?.addEventListener('abort', abortarExterno, { once: true });

  try {
    const opciones = {
      method: metodo,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: controlador.signal
    };
    if (cuerpo !== null && metodo !== 'GET') opciones.body = JSON.stringify(cuerpo);
    const resp = await fetch(construirUrl(ruta), opciones);
    const datos = await resp.json().catch(() => null);
    return { estado: resp.status, datos };
  } catch {
    return { estado: 0, datos: null };
  } finally {
    clearTimeout(idTimeout);
    signal?.removeEventListener('abort', abortarExterno);
  }
}

export async function solicitarApi(ruta, opciones = {}) {
  if (usarAdaptadorMock()) {
    try {
      return await ejecutarPeticionMock(ruta, opciones);
    } catch {
      return { estado: 0, datos: null };
    }
  }
  return ejecutarFetchReal(ruta, opciones);
}
