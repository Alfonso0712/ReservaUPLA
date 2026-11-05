// Utilidades de mapeo y persistencia de preferencias · E-29
export const TEMA_DEFECTO = 'claro';
export const TAMANO_DEFECTO = '100%';
export const ESCALAS_FUENTE = [
  { id: 'normal', etiqueta: 'A−', porcentaje: '100%', descripcion: 'Tamaño de fuente estándar (100 %)' },
  { id: 'grande', etiqueta: 'A', porcentaje: '112.5%', descripcion: 'Tamaño de fuente mediano (112.5 %)' },
  { id: 'extra', etiqueta: 'A+', porcentaje: '125%', descripcion: 'Tamaño de fuente grande (125 %)' }
];

export const MAPA_LETRA_A_PCT = { pequeno: '100%', normal: '112.5%', grande: '125%' };
export const MAPA_PCT_A_LETRA = { '100%': 'pequeno', '112.5%': 'normal', '125%': 'grande' };

export function aplicarPreferenciasAlDom(tema, tamanoFuente) {
  if (typeof document === 'undefined') return;
  const t = tema === 'oscuro' ? 'oscuro' : 'claro';
  const f = MAPA_PCT_A_LETRA[tamanoFuente] ? tamanoFuente : '100%';
  document.documentElement.setAttribute('data-tema', t);
  document.documentElement.style.fontSize = f;
}

export function obtenerPrefAlmacenadas(usuarioId) {
  try {
    const clave = usuarioId ? `reservaupla_pref_${usuarioId}` : 'reservaupla_pref_invitado';
    const raw = localStorage.getItem(clave);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function guardarPrefAlmacenadas(usuarioId, datos) {
  try {
    const clave = usuarioId ? `reservaupla_pref_${usuarioId}` : 'reservaupla_pref_invitado';
    localStorage.setItem(clave, JSON.stringify(datos));
    if (usuarioId) {
      localStorage.setItem('reservaupla_pref_activa', JSON.stringify({ usuarioId, ...datos }));
    }
    if (datos.tema) localStorage.setItem('reservaupla_tema', datos.tema);
    if (datos.tamanoFuente) localStorage.setItem('reservaupla_tamano_fuente', datos.tamanoFuente);
  } catch {
    // Almacenamiento restringido
  }
}

export function limpiarPrefActiva() {
  try {
    localStorage.removeItem('reservaupla_pref_activa');
  } catch {
    // Almacenamiento restringido
  }
}
