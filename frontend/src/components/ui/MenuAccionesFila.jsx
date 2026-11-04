// ISO 9241-110 · WCAG 2.2 AA · Menú desplegable de fila accesible con teclado
import { useRef, useEffect } from 'react';
import { useMenuDesplegable } from '../../hooks/useMenuDesplegable';
import { MAPA_ICONOS } from '../../constants/iconos';
import Button from './Button';
import Icono from './Icono';

export default function MenuAccionesFila({ items = [], ariaLabel = 'Más acciones' }) {
  const { abierto, alternar, cerrar, botonRef, contenedorRef } = useMenuDesplegable();
  const elsRef = useRef([]);

  useEffect(() => {
    if (abierto && elsRef.current[0]) elsRef.current[0].focus();
  }, [abierto]);

  const manejarTeclado = (e) => {
    const total = items.length;
    if (!total) return;
    const i = elsRef.current.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); elsRef.current[(i + 1) % total]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); elsRef.current[(i - 1 + total) % total]?.focus(); }
    else if (e.key === 'Home') { e.preventDefault(); elsRef.current[0]?.focus(); }
    else if (e.key === 'End') { e.preventDefault(); elsRef.current[total - 1]?.focus(); }
    else if (e.key === 'Tab') cerrar(false);
  };

  if (!items.length) return null;

  return (
    <div className="relative inline-block text-left" ref={contenedorRef}>
      <Button ref={botonRef} variante="secondary" tamano="sm" iconOnly icono={MAPA_ICONOS.MAS_ACCIONES} aria-label={ariaLabel} aria-haspopup="menu" aria-expanded={abierto} onClick={alternar} />
      {abierto && (
        <div role="menu" tabIndex={-1} aria-label={ariaLabel} onKeyDown={manejarTeclado} className="absolute right-0 top-full mt-1.5 z-50 min-w-[11rem] py-1 rounded-control border border-borde bg-superficie shadow-lg outline-none">
          {items.map((it, idx) => (
            <button
              key={it.etiqueta || idx}
              ref={(el) => { elsRef.current[idx] = el; }}
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => { cerrar(true); it.onClick?.(); }}
              className={`w-full px-3 py-2 text-left text-sm font-medium flex items-center gap-2 hover:bg-superficie-2 focus:bg-superficie-2 focus:outline-none transition-colors ${it.peligro ? 'text-rechazada-texto' : 'text-texto'}`}
            >
              {it.icono && <Icono nombre={it.icono} className="w-4 h-4 shrink-0" />}
              <span>{it.etiqueta}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
