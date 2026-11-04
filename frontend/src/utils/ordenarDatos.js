// ISO 9241-110 · Función pura para ordenación accesible de tablas
export function ordenarDatos(datos, clave, direccion = 'asc') {
  if (!clave || !datos?.length) return datos;
  return [...datos].sort((a, b) => {
    let va = a[clave];
    let vb = b[clave];
    if (va && typeof va === 'object') va = va.nombreCompleto || va.nombre || '';
    if (vb && typeof vb === 'object') vb = vb.nombreCompleto || vb.nombre || '';
    if (typeof va === 'number' && typeof vb === 'number') {
      return direccion === 'asc' ? va - vb : vb - va;
    }
    const sa = String(va ?? '').toLowerCase();
    const sb = String(vb ?? '').toLowerCase();
    const cmp = sa.localeCompare(sb, 'es', { numeric: true });
    return direccion === 'asc' ? cmp : -cmp;
  });
}
