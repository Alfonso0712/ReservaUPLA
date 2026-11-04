// Nielsen 2 · ISO 9241-11
export function formatearFecha(fechaIso) {
  if (!fechaIso || typeof fechaIso !== 'string') return '—';
  const partes = fechaIso.split('T')[0].split('-');
  if (partes.length !== 3) return fechaIso;
  const [anio, mes, dia] = partes;
  return `${dia}/${mes}/${anio}`;
}

export function obtenerFechaHoyIso() {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}
