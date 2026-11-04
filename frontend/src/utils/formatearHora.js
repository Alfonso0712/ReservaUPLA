// Nielsen 2 · Shneiderman 1
export function formatearHora(hora) {
  if (!hora || typeof hora !== 'string') return '—';
  return hora.slice(0, 5);
}

export function formatearRangoHorario(horaInicio, horaFin) {
  if (!horaInicio || !horaFin) return '—';
  return `${formatearHora(horaInicio)} – ${formatearHora(horaFin)}`;
}
