// RF-05 · Nielsen 1 · Nielsen 6 · Barra compacta de filtros en una sola fila · E-26
import Icono from '../ui/Icono';
import Button from '../ui/Button';

export default function FiltrosReservas({
  texto = '',
  estado = '',
  fechaDesde = '',
  fechaHasta = '',
  totalResultados = 0,
  alCambiarTexto,
  alCambiarFechaDesde,
  alCambiarFechaHasta,
  alLimpiar
}) {
  const hayFiltros = Boolean(texto.trim() || estado || fechaDesde || fechaHasta);
  const etiqueta = totalResultados === 1 ? '1 reserva encontrada' : `${totalResultados} reservas encontradas`;

  return (
    <section aria-label="Filtros de reservas" className="p-2 sm:p-2.5 rounded-tarjeta border border-borde bg-superficie">
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <label htmlFor="campo-filtro-texto-reservas" className="sr-only">Buscar</label>
          <Icono nombre="Search" className="w-4 h-4 text-texto-suave absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="campo-filtro-texto-reservas"
            name="filtro-texto-reservas"
            type="search"
            value={texto}
            onChange={(e) => alCambiarTexto?.(e.target.value)}
            placeholder="Solicitante o ambiente"
            className="w-full h-9 pl-9 pr-3 rounded-control border border-borde bg-superficie text-texto text-xs sm:text-sm hover:border-borde-control focus:border-primario-enlace focus:ring-2 focus:ring-primario/20 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5 shrink-0" role="group" aria-label="Rango de fechas">
          <input
            id="filtro-fecha-desde"
            aria-label="Fecha desde"
            type="date"
            value={fechaDesde}
            onChange={(e) => alCambiarFechaDesde?.(e.target.value)}
            className="h-9 px-2 rounded-control border border-borde bg-superficie text-texto text-xs hover:border-borde-control focus:border-primario-enlace focus:outline-none"
          />
          <span className="text-xs text-texto-suave" aria-hidden="true">—</span>
          <input
            id="filtro-fecha-hasta"
            aria-label="Fecha hasta"
            type="date"
            value={fechaHasta}
            onChange={(e) => alCambiarFechaHasta?.(e.target.value)}
            className="h-9 px-2 rounded-control border border-borde bg-superficie text-texto text-xs hover:border-borde-control focus:border-primario-enlace focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <span role="status" aria-live="polite" className="text-xs font-semibold text-texto-suave cifra-tabular">
            {etiqueta}
          </span>
          {hayFiltros && (
            <Button variante="ghost" tamano="sm" icono="RotateCcw" aria-label="Limpiar filtros" onClick={alLimpiar}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
