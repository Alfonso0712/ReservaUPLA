// WCAG 2.2 AA · ISO 9241-110 · Utilidad para generar iniciales de avatar de usuario
export function obtenerIniciales(nombre = '') {
  if (!nombre || typeof nombre !== 'string') return '';
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return '';
  if (palabras.length === 1) return palabras[0].charAt(0).toUpperCase();
  return (palabras[0].charAt(0) + palabras[1].charAt(0)).toUpperCase();
}
