// WCAG 2.2 AA · ISO 9241-110 · Paginación accesible con selector de filas y números
import Icono from './Icono';

function obtenerItems(actual, total) {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  if (actual <= 3) return [1, 2, 3, 4, '…', total];
  if (actual >= total - 2) return [1, '…', total - 3, total - 2, total - 1, total];
  return [1, '…', actual - 1, actual, actual + 1, '…', total];
}

export default function PaginacionTabla({
  paginaActual = 1, totalPaginas = 1, totalRegistros = 0,
  tamanoPagina = 10, alCambiarPagina, alCambiarTamanoPagina
}) {
  const inicio = totalRegistros === 0 ? 0 : (paginaActual - 1) * tamanoPagina + 1;
  const fin = Math.min(paginaActual * tamanoPagina, totalRegistros);
  const items = obtenerItems(paginaActual, totalPaginas);
  const desAnt = paginaActual <= 1; const desSig = paginaActual >= totalPaginas;

  return (
    <nav aria-label="Paginación de la tabla" className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-borde bg-superficie text-xs text-texto-suave">
      <div className="flex items-center gap-3 font-medium">
        <span className="text-texto font-semibold cifra-tabular">{`Mostrando ${inicio}–${fin} de ${totalRegistros} registros`}</span>
        <label className="flex items-center gap-1.5 ml-2 cursor-pointer">
          <span className="hidden md:inline">Mostrar:</span>
          <select
            value={tamanoPagina}
            onChange={(e) => alCambiarTamanoPagina?.(Number(e.target.value))}
            aria-label="Registros por página"
            className="h-8 px-2 rounded-control border border-borde bg-superficie text-texto text-xs font-semibold focus:outline-none focus:border-primario-enlace"
          >
            {[10, 20, 50].map((n) => <option key={n} value={n}>{n} / pág.</option>)}
          </select>
        </label>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button" onClick={() => !desAnt && alCambiarPagina?.(paginaActual - 1)} disabled={desAnt}
            aria-disabled={desAnt} aria-label="Página anterior"
            className="h-8 px-2.5 rounded-control border border-borde text-texto hover:bg-superficie-2 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 font-semibold transition-colors"
          >
            <Icono nombre="ChevronLeft" className="w-3.5 h-3.5" /><span>Anterior</span>
          </button>
          <div className="hidden sm:flex items-center gap-1">
            {items.map((it, idx) => typeof it === 'number' ? (
              <button
                key={it} type="button" onClick={() => alCambiarPagina?.(it)}
                aria-current={it === paginaActual ? 'page' : undefined}
                className={`h-8 min-w-[2rem] px-2 rounded-control border text-xs font-semibold transition-colors ${it === paginaActual ? 'bg-primario text-sobre-primario border-primario' : 'border-borde text-texto hover:bg-superficie-2'}`}
              >
                {it}
              </button>
            ) : <span key={`sep-${idx}`} className="px-1 text-texto-suave">…</span>)}
          </div>
          <button
            type="button" onClick={() => !desSig && alCambiarPagina?.(paginaActual + 1)} disabled={desSig}
            aria-disabled={desSig} aria-label="Página siguiente"
            className="h-8 px-2.5 rounded-control border border-borde text-texto hover:bg-superficie-2 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 font-semibold transition-colors"
          >
            <span>Siguiente</span><Icono nombre="ChevronRight" className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </nav>
  );
}
