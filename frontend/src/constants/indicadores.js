// Nielsen 1 · Nielsen 2 · Nielsen 4 · Shneiderman 1 · E-51 · E-53
import { ESTADOS_RESERVA } from './estados';
import { RUTAS } from './rutas';
import { PERMISOS } from './permisos';

export const INDICADORES = [
  { clave: 'total', etiqueta: 'Total de reservas', descripcion: 'Registradas en el sistema', icono: 'CalendarDays', tono: 'primario', destino: RUTAS.RESERVAS, textoAccion: 'Ver todas las reservas' },
  { clave: 'pendientes', etiqueta: 'Reservas pendientes', descripcion: 'En espera de aprobación', icono: 'Clock', tono: ESTADOS_RESERVA.PENDIENTE, destino: `${RUTAS.RESERVAS}?estado=Pendiente`, textoAccion: 'Ver reservas pendientes' },
  { clave: 'aprobadas', etiqueta: 'Reservas aprobadas', descripcion: 'Con horario confirmado', icono: 'CircleCheck', tono: ESTADOS_RESERVA.APROBADA, destino: `${RUTAS.RESERVAS}?estado=Aprobada`, textoAccion: 'Ver reservas aprobadas' },
  { clave: 'rechazadas', etiqueta: 'Reservas rechazadas', descripcion: 'Solicitudes no aprobadas', icono: 'CircleX', tono: ESTADOS_RESERVA.RECHAZADA, destino: `${RUTAS.RESERVAS}?estado=Rechazada`, textoAccion: 'Ver reservas rechazadas' },
  { clave: 'canceladas', etiqueta: 'Reservas canceladas', descripcion: 'Anuladas por el solicitante o el administrador', icono: 'Ban', tono: ESTADOS_RESERVA.CANCELADA, destino: `${RUTAS.RESERVAS}?estado=Cancelada`, textoAccion: 'Ver reservas canceladas' },
  { clave: 'ambiente', etiqueta: 'Ambiente más utilizado', descripcion: 'Se calculará con las primeras reservas', icono: 'Building2', tono: 'primario', destino: RUTAS.AMBIENTES, textoAccion: 'Ver ambientes' }
];

export const CONFIG_INDICADORES = INDICADORES;

export function construirIndicadores(datos = {}, puede = () => true) {
  const pReservas = puede(PERMISOS.RESERVAS_VER);
  const pAmbientes = puede(PERMISOS.AMBIENTES_VER);
  const alc = datos.alcance;
  const amb = datos.ambienteMasUtilizado;
  const hayAmb = Boolean(amb && amb.nombre);
  const cant = amb?.cantidad ?? 0;

  const totalTxt = alc === 'propio' ? { e: 'Mis solicitudes', a: 'Ver mis reservas' }
    : alc === 'asignado' ? { e: 'Reservas asignadas', a: 'Ver reservas asignadas' }
    : { e: 'Total de reservas', a: 'Ver todas las reservas' };

  return INDICADORES.map((c) => {
    if (c.clave === 'total') return { ...c, etiqueta: totalTxt.e, valor: datos.total ?? 0, textoAccion: totalTxt.a, destino: pReservas ? c.destino : null };
    if (c.clave === 'pendientes') return { ...c, valor: datos.pendientes ?? 0, destino: pReservas ? c.destino : null };
    if (c.clave === 'aprobadas') return { ...c, valor: datos.aprobadas ?? 0, destino: pReservas ? c.destino : null };
    if (c.clave === 'rechazadas') return { ...c, valor: datos.rechazadas ?? 0, destino: pReservas ? c.destino : null };
    if (c.clave === 'canceladas') return { ...c, valor: datos.canceladas ?? 0, destino: pReservas ? c.destino : null };
    if (c.clave === 'ambiente') {
      return {
        ...c,
        valor: hayAmb ? amb.nombre : 'Aún sin datos',
        descripcion: hayAmb ? `${cant} ${cant === 1 ? 'reserva registrada' : 'reservas registradas'}` : 'Se calculará con las primeras reservas',
        textoAccion: hayAmb ? 'Ver reservas de este ambiente' : 'Ver ambientes',
        destino: hayAmb ? (pReservas ? `${RUTAS.RESERVAS}?texto=${encodeURIComponent(amb.nombre)}` : null) : (pAmbientes ? RUTAS.AMBIENTES : null)
      };
    }
    return c;
  });
}
