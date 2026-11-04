// Nielsen 1 · Nielsen 4 · Shneiderman 1 · Shneiderman 2 · Norman · E-50 · E-52
import { Link } from 'react-router-dom';
import Icono from './Icono';
import { TONOS_ESTADO } from '../../constants/estados';

export default function CardIndicador({
  etiqueta,
  titulo,
  valor,
  descripcion,
  subtitulo,
  icono = 'CalendarDays',
  tono = 'primario',
  destino = '',
  textoAccion = 'Ver más'
}) {
  const txtEtiqueta = etiqueta || titulo || '';
  const txtDescripcion = descripcion || subtitulo || '';
  const tonoConfig = TONOS_ESTADO[tono] || TONOS_ESTADO.primario;
  const chipClases = tonoConfig.chip || `${tonoConfig.fondo} ${tonoConfig.texto}`;
  const esNumero = typeof valor === 'number' || /^\d+$/.test(String(valor));
  const nombreAccesible = `${txtEtiqueta}: ${valor}. ${textoAccion}`;

  return (
    <div className="card-indicador relative flex flex-col h-full p-5 rounded-tarjeta border border-borde bg-superficie hover:border-primario focus-within:ring-2 focus-within:ring-anillo-foco focus-within:border-primario transition-colors motion-reduce:transition-none">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[1rem] font-semibold text-texto-suave leading-snug">
          {txtEtiqueta}
        </span>
        <span
          className={`w-10 h-10 rounded-[0.5rem] flex items-center justify-center shrink-0 ${chipClases}`}
          aria-hidden="true"
        >
          <Icono nombre={icono} className="w-5 h-5 shrink-0" />
        </span>
      </div>

      <div className="min-h-[3.5rem] flex items-center my-2">
        {esNumero ? (
          <div className="text-[2.5rem] font-bold text-texto leading-[1.1] [font-variant-numeric:tabular-nums]">
            {valor}
          </div>
        ) : (
          <div className="text-[1.375rem] font-bold text-texto leading-[1.25] line-clamp-2 break-words">
            {valor}
          </div>
        )}
      </div>

      <p className="text-[0.9375rem] text-texto-suave leading-normal">
        {txtDescripcion}
      </p>

      <div className="mt-auto pt-3 border-t border-borde">
        {destino ? (
          <Link
            to={destino}
            aria-label={nombreAccesible}
            className="inline-flex items-center gap-1.5 text-[1rem] font-semibold text-primario-enlace hover:underline focus:outline-none after:absolute after:inset-0 after:content-['']"
          >
            <span>{textoAccion}</span>
            <Icono nombre="ChevronRight" className="w-4 h-4 shrink-0" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[1rem] font-semibold text-texto-suave">
            <span>{textoAccion}</span>
          </span>
        )}
      </div>
    </div>
  );
}
