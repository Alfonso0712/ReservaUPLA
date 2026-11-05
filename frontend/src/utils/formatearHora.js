// Nielsen 2 · Shneiderman 1
export function formatearHora(hora) {
  if (!hora || typeof hora !== 'string') return '—';
  return hora.slice(0, 5);
}

export function formatearRangoHorario(horaInicio, horaFin) {
  if (!horaInicio || !horaFin) return '—';
  return `${formatearHora(horaInicio)} – ${formatearHora(horaFin)}`;
}

export function calcularDuracionHoras(horaInicio, horaFin) {
  if (!horaInicio || !horaFin) return '';
  const [h1, m1] = horaInicio.split(':').map(Number);
  const [h2, m2] = horaFin.split(':').map(Number);
  const min = (h2 * 60 + (m2 || 0)) - (h1 * 60 + (m1 || 0));
  if (min <= 0) return '';
  const horas = Math.floor(min / 60);
  const restoMin = min % 60;
  if (restoMin === 0) return `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  if (horas === 0) return `${restoMin} min`;
  return `${horas} h ${restoMin} min`;
}
