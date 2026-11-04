// Nielsen 3 · Nielsen 6 · Shneiderman 8 · Migas de pan orientativas · E-25
import { Link, useLocation } from 'react-router-dom';
import { RUTAS } from '../../constants/rutas';
import Icono from '../ui/Icono';

function construirMigasPorRuta(pathname) {
  const base = [{ etiqueta: 'Inicio', ruta: RUTAS.PANEL }];
  if (pathname.startsWith('/reservas/')) {
    return [...base, { etiqueta: 'Reservas', ruta: RUTAS.RESERVAS }, { etiqueta: 'Detalle' }];
  }
  if (pathname.startsWith(RUTAS.RESERVAS)) {
    return [...base, { etiqueta: 'Reservas' }];
  }
  if (pathname.startsWith(RUTAS.AMBIENTES)) {
    return [...base, { etiqueta: 'Ambientes' }];
  }
  if (pathname === RUTAS.PANEL) {
    return [...base, { etiqueta: 'Panel' }];
  }
  return [...base, { etiqueta: 'Página no encontrada' }];
}

export default function MigasDePan({ items = null, idNav = 'migas-navegacion' }) {
  const { pathname } = useLocation();
  const lista = items && items.length > 0 ? items : construirMigasPorRuta(pathname);

  return (
    <nav aria-label={idNav === 'migas-cabecera' ? 'Ubicación actual en cabecera' : 'Migas de pan'} className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-texto-suave">
        {lista.map((item, indice) => {
          const esUltimo = indice === lista.length - 1;
          return (
            <li key={`${item.etiqueta}-${indice}`} className="inline-flex items-center gap-1.5">
              {indice > 0 && <Icono nombre="ChevronRight" className="w-4 h-4 text-texto-suave" />}
              {esUltimo || !item.ruta ? (
                <span aria-current="page" className="font-semibold text-texto">
                  {item.etiqueta}
                </span>
              ) : (
                <Link to={item.ruta} className="text-primario-enlace font-medium hover:underline">
                  {item.etiqueta}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
