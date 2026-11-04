// WCAG 2.2 AA · Nielsen 1 · Paginación accesible para tablas de datos
import Icono from './Icono';

export default function PaginacionTabla({
  paginaActual = 1, totalPaginas = 1, totalRegistros = 0,
  tamanoPagina = 10, alCambiarPagina
}) {
  const inicio = totalRegistros === 0 ? 0 : (paginaActual - 1) * tamanoPagina + 1;
  const fin = Math.min(paginaActual * tamanoPagina, totalRegistros);
  const deshabilitarAnterior = paginaActual <= 1;
  const deshabilitarSiguiente = paginaActual >= totalPaginas;

  return (
    <nav aria-label="Paginación de la tabla" className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-borde bg-superficie text-xs text-texto-suave">
      <div className="flex items-center gap-1.5 font-medium">
        <span className="font-semibold text-texto">{`Página ${paginaActual} de ${totalPaginas}`}</span>
        <span>·</span>
        <span>{`Mostrando ${inicio}–${fin} de ${totalRegistros} registros`}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => alCambiarPagina?.(paginaActual - 1)}
          disabled={deshabilitarAnterior}
          aria-label="Ir a la página anterior"
          className="min-h-[32px] h-8 px-3 rounded-control border border-borde bg-superficie text-texto hover:bg-superficie-2 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
        >
          <Icono nombre="ChevronLeft" className="w-3.5 h-3.5" />
          <span>Anterior</span>
        </button>
        <button
          type="button"
          onClick={() => alCambiarPagina?.(paginaActual + 1)}
          disabled={deshabilitarSiguiente}
          aria-label="Ir a la página siguiente"
          className="min-h-[32px] h-8 px-3 rounded-control border border-borde bg-superficie text-texto hover:bg-superficie-2 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
        >
          <span>Siguiente</span>
          <Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
}
