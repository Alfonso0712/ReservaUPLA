// Nielsen 1 · Shneiderman 2 · ISO 9241-11 · E-54
import { NavLink } from 'react-router-dom';
import Icono from '../ui/Icono';

export default function ItemNavegacion({ item, alCerrarMenuMovil }) {
  return (
    <NavLink
      to={item.ruta}
      onClick={() => alCerrarMenuMovil?.()}
      className={({ isActive }) =>
        `w-full min-h-[2.75rem] px-4 py-2.5 rounded-control flex items-center gap-3 text-[1rem] transition-colors no-underline text-left outline-none focus-visible:ring-2 focus-visible:ring-acento-sobre-oscuro ${
          isActive
            ? 'bg-lateral-activo-fondo text-white font-semibold border-l-[3px] border-acento-sobre-oscuro'
            : 'text-lateral-texto font-medium hover:bg-lateral-hover'
        }`
      }
    >
      <Icono nombre={item.icono} className="w-5 h-5 shrink-0" />
      <span>{item.etiqueta}</span>
    </NavLink>
  );
}
