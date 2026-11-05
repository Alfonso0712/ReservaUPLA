// Franja compacta de resumen de ocupación en zona America/Lima · Cambio 3
import { Link } from 'react-router-dom';
import Icono from '../ui/Icono';
import { RUTAS } from '../../constants/rutas';
import { ESTADOS_RESERVA } from '../../constants/estados';
import { obtenerRangoSemanaPeru } from '../../utils/horarioPeru';

export default function ResumenOcupacion({ reservas = [] }) {
  const { hoy, lunes, domingo } = obtenerRangoSemanaPeru();
  const aprobadas = reservas.filter((r) => r.estado === ESTADOS_RESERVA.APROBADA);
  const cantHoy = aprobadas.filter((r) => r.fecha === hoy).length;
  const cantSemana = aprobadas.filter((r) => r.fecha >= lunes && r.fecha <= domingo).length;

  const textoHoy = cantHoy === 0 ? 'Sin reservas aprobadas hoy' : `Hoy: ${cantHoy} ${cantHoy === 1 ? 'reserva aprobada' : 'reservas aprobadas'}`;
  const textoSemana = `Esta semana: ${cantSemana} ${cantSemana === 1 ? 'reserva aprobada' : 'reservas aprobadas'}`;

  const enlaceHoy = `${RUTAS.RESERVAS}?estado=Aprobada&desde=${hoy}&hasta=${hoy}`;
  const enlaceSemana = `${RUTAS.RESERVAS}?estado=Aprobada&desde=${lunes}&hasta=${domingo}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4 sm:py-2.5 rounded-tarjeta border border-borde bg-superficie text-xs sm:text-sm">
      <div className="flex items-center gap-2 text-texto-suave">
        <Icono nombre="CalendarDays" className="w-4 h-4 text-primario shrink-0" />
        <span className="font-semibold text-texto">Resumen de ocupación:</span>
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <Link to={enlaceHoy} className="inline-flex items-center gap-1.5 font-medium text-texto hover:text-primario-enlace hover:underline focus:outline-none focus:underline">
          <span className="w-2 h-2 rounded-full bg-aprobada-texto shrink-0" aria-hidden="true" />
          <span>{textoHoy}</span>
        </Link>
        <span className="text-borde select-none" aria-hidden="true">|</span>
        <Link to={enlaceSemana} className="inline-flex items-center gap-1.5 font-medium text-texto hover:text-primario-enlace hover:underline focus:outline-none focus:underline">
          <span className="w-2 h-2 rounded-full bg-primario shrink-0" aria-hidden="true" />
          <span>{textoSemana}</span>
        </Link>
      </div>
    </div>
  );
}
