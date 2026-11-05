// RF-05 · Nielsen 1 · Nielsen 6 · Barra compacta de filtros en una sola fila con TextInput y DateInput · E-26
import TextInput from '../formulario/TextInput';
import DateInput from '../formulario/DateInput';
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
        <div className="flex-1 min-w-[200px]">
          <TextInput
            id="campo-filtro-texto-reservas"
            nombre="filtro-texto-reservas"
            etiqueta=""
            aria-label="Buscar"
            obligatorio={false}
            tipo="search"
            tamano="sm"
            valor={texto}
            alCambiar={(e) => alCambiarTexto?.(e.target.value)}
            placeholder="Solicitante o ambiente"
          />
        </div>
        <div className="flex items-center gap-1.5 shrink-0" role="group" aria-label="Rango de fechas">
          <DateInput
            id="filtro-fecha-desde"
            aria-label="Fecha desde"
            etiqueta=""
            ayuda=""
            obligatorio={false}
            tamano="sm"
            valor={fechaDesde}
            alCambiar={(e) => alCambiarFechaDesde?.(e.target.value)}
          />
          <span className="text-xs text-texto-suave" aria-hidden="true">—</span>
          <DateInput
            id="filtro-fecha-hasta"
            aria-label="Fecha hasta"
            etiqueta=""
            ayuda=""
            obligatorio={false}
            tamano="sm"
            valor={fechaHasta}
            alCambiar={(e) => alCambiarFechaHasta?.(e.target.value)}
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
