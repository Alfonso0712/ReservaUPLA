// Nielsen 1 · Nielsen 4 · Shneiderman 1 · Shneiderman 2 · Norman · E-50 · E-52
import { Link } from 'react-router-dom';
import Icono from './Icono';
import { TONOS_ESTADO } from '../../constants/estados';

export default function CardIndicador({
  etiqueta, titulo, valor, descripcion, subtitulo, icono = 'CalendarDays',
  tono = 'primario', destino = '', textoAccion = 'Ver más',
  compacto = false, acentoAmbar = false, ariaLabel = ''
}) {
  const txtEtiqueta = etiqueta || titulo || '';
  const txtDescripcion = descripcion || subtitulo || '';
  const tonoConfig = TONOS_ESTADO[tono] || TONOS_ESTADO.primario;
  const chipClases = tonoConfig.chip || `${tonoConfig.fondo} ${tonoConfig.texto}`;
  const esNumero = typeof valor === 'number' || /^\d+$/.test(String(valor));
  const nombreAccesible = ariaLabel || `${txtEtiqueta}: ${valor}. ${textoAccion}`;

  if (compacto) {
    const acento = acentoAmbar ? 'border-l-4 border-l-pendiente-texto' : '';
    return (
      <div className={`card-indicador relative flex flex-col justify-between p-4 rounded-tarjeta border border-borde bg-superficie hover:border-primario focus-within:ring-2 focus-within:ring-anillo-foco focus-within:border-primario transition-colors ${acento}`.trim()}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs sm:text-sm font-semibold text-texto-suave truncate">{txtEtiqueta}</span>
          <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${chipClases}`} aria-hidden="true">
            <Icono nombre={icono} className="w-4 h-4 shrink-0" />
          </span>
        </div>
        <div className="mt-3 text-2xl sm:text-3xl font-bold text-texto leading-none [font-variant-numeric:tabular-nums]">
          {valor}
        </div>
        {destino && <Link to={destino} aria-label={nombreAccesible} className="focus:outline-none after:absolute after:inset-0 after:content-['']" />}
      </div>
    );
  }

  return (
    <div className="card-indicador relative flex flex-col h-full px-5 py-[1.125rem] rounded-tarjeta border border-borde bg-superficie hover:border-primario focus-within:ring-2 focus-within:ring-anillo-foco focus-within:border-primario transition-colors motion-reduce:transition-none">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[1rem] font-semibold text-texto-suave leading-snug">{txtEtiqueta}</span>
        <span className={`w-10 h-10 rounded-[0.5rem] flex items-center justify-center shrink-0 ${chipClases}`} aria-hidden="true">
          <Icono nombre={icono} className="w-5 h-5 shrink-0" />
        </span>
      </div>
      <div className="min-h-[2.5rem] flex items-center mt-2.5">
        <div className={esNumero ? "text-[2.25rem] font-bold text-texto leading-none [font-variant-numeric:tabular-nums]" : "text-[1.3125rem] font-semibold text-texto leading-snug line-clamp-2 break-words"}>
          {valor}
        </div>
      </div>
      <p className="mt-1 text-[0.9375rem] text-texto-suave leading-snug">{txtDescripcion}</p>
      <div className="mt-auto pt-2.5 border-t border-borde">
        {destino ? (
          <Link to={destino} aria-label={nombreAccesible} className="inline-flex items-center gap-1.5 text-[1rem] font-semibold text-primario-enlace hover:underline focus:outline-none after:absolute after:inset-0 after:content-['']">
            <span>{textoAccion}</span>
            <Icono nombre="ChevronRight" className="w-4 h-4 shrink-0" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[1rem] font-semibold text-texto-suave"><span>{textoAccion}</span></span>
        )}
      </div>
    </div>
  );
}
