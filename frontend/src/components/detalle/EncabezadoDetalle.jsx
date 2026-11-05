// Cabecera de Detalle de reserva · Enlace volver discreto y título sin subtítulo
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icono from '../ui/Icono';
import { RUTAS } from '../../constants/rutas';
import { useFocoAlMontar } from '../../hooks/useFocoAlMontar';

export default function EncabezadoDetalle({ search = '', reservaId = null }) {
  const refTitulo = useFocoAlMontar(true, 'Detalle de reserva');
  useEffect(() => { document.title = 'ReservaUPLA'; }, []);

  return (
    <header className="space-y-0.5">
      <Link
        to={`${RUTAS.RESERVAS}${search}`}
        state={reservaId ? { enfocarId: reservaId } : undefined}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-texto-suave hover:text-texto transition-colors focus-visible:ring-2 focus-visible:ring-anillo-foco outline-none rounded-sm py-1 min-h-[36px]"
      >
        <Icono nombre="ArrowLeft" className="w-4 h-4 shrink-0" />
        <span>Volver a reservas</span>
      </Link>
      <h1 ref={refTitulo} tabIndex={-1} className="text-xl sm:text-2xl font-bold text-texto outline-none leading-tight">
        Detalle de reserva
      </h1>
    </header>
  );
}
