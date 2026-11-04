// Shneiderman 2 · WCAG 2.2 AA · Conmutador de tema claro/oscuro con persistencia · E-29
import { useTema } from '../../hooks/useTema';
import Icono from '../ui/Icono';

export default function ConmutadorTema({ tema: temaProp, alAlternar, className = '' }) {
  const { tema: temaHook, alternarTema } = useTema();
  const temaActual = temaProp || temaHook;
  const manejarAlternar = alAlternar || alternarTema;
  const esOscuro = temaActual === 'oscuro';
  const etiqueta = esOscuro ? 'Modo claro' : 'Modo oscuro';
  const ariaLabel = esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={manejarAlternar}
      className={`inline-flex items-center gap-2 min-h-control px-3 py-2 rounded-control border border-borde bg-superficie text-texto hover:bg-superficie-2 text-sm font-semibold transition-colors cursor-pointer ${className}`.trim()}
    >
      <Icono nombre={esOscuro ? 'Sun' : 'Moon'} className="w-4 h-4" />
      <span>{etiqueta}</span>
    </button>
  );
}
