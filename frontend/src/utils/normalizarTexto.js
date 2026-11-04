// RV-01 · Nielsen 5 · E-06
export function normalizarTexto(valor) {
  if (typeof valor !== 'string') return '';
  return valor.trim().replace(/\s+/g, ' ');
}

export function normalizarCorreo(valor) {
  if (typeof valor !== 'string') return '';
  return valor.trim().toLowerCase();
}
