// Gráfica de dona accesible SVG de reservas por estado · Cambio 5
import Icono from '../ui/Icono';
import { ESTADOS_RESERVA } from '../../constants/estados';

const CONFIG_ESTADOS = [
  { clave: 'pendientes', label: 'Pendiente', estado: ESTADOS_RESERVA.PENDIENTE, color: '#d97706', icono: 'Clock' },
  { clave: 'aprobadas', label: 'Aprobada', estado: ESTADOS_RESERVA.APROBADA, color: '#059669', icono: 'CircleCheck' },
  { clave: 'rechazadas', label: 'Rechazada', estado: ESTADOS_RESERVA.RECHAZADA, color: '#dc2626', icono: 'CircleX' },
  { clave: 'canceladas', label: 'Cancelada', estado: ESTADOS_RESERVA.CANCELADA, color: '#64748b', icono: 'Ban' }
];

export default function GraficaReservasEstado({ indicadores }) {
  const total = indicadores?.total || 0;
  const items = CONFIG_ESTADOS.map((cfg) => {
    const cant = indicadores?.[cfg.clave] ?? 0;
    const pct = total > 0 ? Math.round((cant / total) * 100) : 0;
    return { ...cfg, cantidad: cant, porcentaje: pct };
  });

  const resumenAria = `Reservas por estado: Total ${total}. ${items.map((i) => `${i.label} ${i.cantidad} (${i.porcentaje}%)`).join(', ')}`;
  const circ = 251.327; // 2 * PI * 40
  let acumulado = 0;

  return (
    <div className="p-4 sm:p-5 rounded-tarjeta border border-borde bg-superficie shadow-sm space-y-4 h-full flex flex-col">
      <h2 className="text-base sm:text-lg font-bold text-texto">Reservas por estado</h2>
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-auto">
        <div className="relative w-36 h-36 shrink-0" role="img" aria-label={resumenAria}>
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-borde/40" />
            {total > 0 && items.map((item) => {
              const len = (item.cantidad / total) * circ;
              const offset = acumulado;
              acumulado += len;
              return item.cantidad > 0 ? (
                <circle key={item.clave} cx="50" cy="50" r="40" fill="transparent" stroke={item.color} strokeWidth="12" strokeDasharray={`${len} ${circ}`} strokeDashoffset={-offset} className="transition-all duration-300" />
              ) : null;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-texto leading-none cifra-tabular">{total}</span>
            <span className="text-[10px] uppercase font-semibold text-texto-suave mt-0.5 tracking-wider">Total</span>
          </div>
        </div>
        <div className="space-y-2 w-full sm:w-auto">
          {items.map((i) => (
            <div key={i.clave} className="flex items-center justify-between sm:justify-start gap-3 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1.5 min-w-[7rem]">
                <Icono nombre={i.icono} className="w-4 h-4 shrink-0" style={{ color: i.color }} />
                <span className="font-medium text-texto">{i.label}</span>
              </span>
              <span className="font-semibold text-texto cifra-tabular">{i.cantidad}</span>
              <span className="text-texto-suave cifra-tabular text-xs">({i.porcentaje}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
