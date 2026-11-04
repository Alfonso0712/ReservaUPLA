// RF-08 · WCAG 2.2 AA · Shneiderman 1 · E-30
import { Link } from 'react-router-dom';
import Icono from './Icono';

export default function CardIndicador({
  titulo,
  valor,
  subtitulo = '',
  icono = 'CalendarDays',
  destino = '/reservas',
  textoAccion = 'Ver reservas'
}) {
  const nombreAccesible = `${titulo}: ${valor}${subtitulo ? ` (${subtitulo})` : ''}. ${textoAccion}`;

  return (
    <Link
      to={destino}
      aria-label={nombreAccesible}
      className="flex flex-col justify-between h-full min-h-[9.5rem] p-5 rounded-tarjeta border border-borde bg-superficie hover:bg-superficie-2 transition-colors no-underline text-texto"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-base font-semibold text-texto-suave">{titulo}</span>
        <span className="p-2 rounded-control bg-superficie-2 text-primario shrink-0">
          <Icono nombre={icono} className="w-5 h-5" />
        </span>
      </div>

      <div className="my-3">
        <div className="text-2xl font-bold text-texto cifra-tabular break-words whitespace-normal leading-snug">
          {valor}
        </div>
        {subtitulo && (
          <p className="text-sm text-texto-suave mt-1">{subtitulo}</p>
        )}
      </div>

      <div className="flex items-center gap-1 text-sm font-semibold text-primario-enlace pt-2 border-t border-borde">
        <span>{textoAccion}</span>
        <Icono nombre="ChevronRight" className="w-4 h-4" />
      </div>
    </Link>
  );
}
