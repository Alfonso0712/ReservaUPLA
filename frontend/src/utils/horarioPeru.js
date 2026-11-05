// Utilidades de fecha, saludo contextual y rangos semanales en zona horaria America/Lima
export function obtenerSaludoHoraPeru(fecha = new Date()) {
  const horaStr = new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    hour: 'numeric',
    hour12: false
  }).format(fecha);
  const hora = parseInt(horaStr, 10);
  if (hora >= 5 && hora < 12) return 'Buenos días';
  if (hora >= 12 && hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function obtenerPrimerNombre(nombreCompleto = '') {
  if (!nombreCompleto) return 'Usuario';
  return String(nombreCompleto).trim().split(/\s+/)[0];
}

export function obtenerRangoSemanaPeru(fechaRef = new Date()) {
  const formateador = new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const partes = formateador.formatToParts(fechaRef);
  const ano = parseInt(partes.find((p) => p.type === 'year').value, 10);
  const mes = parseInt(partes.find((p) => p.type === 'month').value, 10) - 1;
  const dia = parseInt(partes.find((p) => p.type === 'day').value, 10);

  const local = new Date(ano, mes, dia);
  const diaSemana = local.getDay();
  const diffLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
  const lunes = new Date(local);
  lunes.setDate(local.getDate() + diffLunes);

  const domingo = new Date(lunes);
  domingo.setDate(lunes.getDate() + 6);

  const iso = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return { hoy: iso(local), lunes: iso(lunes), domingo: iso(domingo) };
}
