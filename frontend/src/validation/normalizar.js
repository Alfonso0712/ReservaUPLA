// Nielsen 5 · Prevencion de errores y normalizacion de entradas
export function normalizarCorreo(correo) {
  if (!correo || typeof correo !== 'string') return '';
  return correo.trim().toLowerCase();
}

export function normalizarTexto(texto) {
  if (!texto || typeof texto !== 'string') return '';
  return texto.trim();
}
