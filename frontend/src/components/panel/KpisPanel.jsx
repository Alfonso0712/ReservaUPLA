// Fila de KPIs compactos del Panel · Cambio 2 · E-50
import CardIndicador from '../ui/CardIndicador';
import { RUTAS } from '../../constants/rutas';
import { ESTADOS_RESERVA } from '../../constants/estados';

export default function KpisPanel({ indicadores }) {
  const total = indicadores?.total ?? 0;
  const pendientes = indicadores?.pendientes ?? 0;
  const aprobadas = indicadores?.aprobadas ?? 0;
  const rechazadas = indicadores?.rechazadas ?? 0;
  const alcance = indicadores?.alcance;

  const etiquetaTotal = alcance === 'propio'
    ? 'Mis solicitudes'
    : alcance === 'asignado'
      ? 'Reservas asignadas'
      : 'Total de reservas';

  const kpis = [
    { clave: 'total', etiqueta: etiquetaTotal, valor: total, icono: 'CalendarDays', tono: 'primario', destino: RUTAS.RESERVAS, ariaLabel: `${etiquetaTotal}: ${total}. Ver ${total} reservas totales` },
    { clave: 'pendientes', etiqueta: 'Pendientes', valor: pendientes, icono: 'Clock', tono: ESTADOS_RESERVA.PENDIENTE, destino: `${RUTAS.RESERVAS}?estado=Pendiente`, acentoAmbar: pendientes > 0, ariaLabel: `Reservas pendientes: ${pendientes}. Ver ${pendientes} reservas pendientes` },
    { clave: 'aprobadas', etiqueta: 'Aprobadas', valor: aprobadas, icono: 'CircleCheck', tono: ESTADOS_RESERVA.APROBADA, destino: `${RUTAS.RESERVAS}?estado=Aprobada`, ariaLabel: `Reservas aprobadas: ${aprobadas}. Ver ${aprobadas} reservas aprobadas` },
    { clave: 'rechazadas', etiqueta: 'Rechazadas', valor: rechazadas, icono: 'CircleX', tono: ESTADOS_RESERVA.RECHAZADA, destino: `${RUTAS.RESERVAS}?estado=Rechazada`, ariaLabel: `Reservas rechazadas: ${rechazadas}. Ver ${rechazadas} reservas rechazadas` }
  ];

  return (
    <section aria-label="Indicadores clave de reservas" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <CardIndicador key={kpi.clave} compacto {...kpi} />
      ))}
    </section>
  );
}
