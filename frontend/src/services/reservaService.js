// Servicio HTTP de reservas · RF-03 · RF-05 · RF-06 · RF-07 · E-12..21
import { solicitarApi } from './apiClient';

export async function listarReservasApi({ estado = '', tipo = '', texto = '' } = {}, signal) {
  const params = new URLSearchParams({ tamanoPagina: '100' });
  if (estado) params.set('estado', estado);
  if (tipo) params.set('tipo', tipo);
  if (texto) params.set('texto', texto);
  const query = params.toString();
  const ruta = query ? `/api/reservas?${query}` : '/api/reservas';
  return solicitarApi(ruta, { metodo: 'GET', signal });
}

export async function obtenerReservaPorIdApi(id, signal) {
  return solicitarApi(`/api/reservas/${encodeURIComponent(id)}`, {
    metodo: 'GET',
    signal
  });
}

export async function crearReservaApi(datosReserva, signal) {
  return solicitarApi('/api/reservas', {
    metodo: 'POST',
    cuerpo: datosReserva,
    signal
  });
}

export async function cambiarEstadoReservaApi(id, nuevoEstado, motivoOSignal, signalParam) {
  const esSignal = motivoOSignal && (typeof motivoOSignal.addEventListener === 'function' || motivoOSignal.aborted !== undefined);
  const motivo = esSignal ? '' : (typeof motivoOSignal === 'string' ? motivoOSignal : '');
  const signal = esSignal ? motivoOSignal : signalParam;
  const cuerpo = { estado: nuevoEstado };
  if (motivo) cuerpo.motivo = motivo;
  return solicitarApi(`/api/reservas/${encodeURIComponent(id)}/estado`, {
    metodo: 'PATCH',
    cuerpo,
    signal
  });
}
