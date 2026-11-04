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

export function obtenerTextoRelativoFecha(fechaIso) {
  if (!fechaIso || typeof fechaIso !== 'string') return '';
  const [anio, mes, dia] = fechaIso.split('T')[0].split('-').map(Number);
  if (!anio || !mes || !dia) return '';
  const diffDias = Math.round((new Date(anio, mes - 1, dia) - new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) / 86400000);
  if (diffDias === 0) return 'Hoy';
  if (diffDias === 1) return 'Mañana';
  if (diffDias === -1) return 'Ayer';
  return diffDias > 1 ? `En ${diffDias} días` : `Hace ${Math.abs(diffDias)} días`;
}
