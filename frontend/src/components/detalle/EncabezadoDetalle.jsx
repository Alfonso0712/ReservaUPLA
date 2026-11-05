// Cabecera discreta con enlace para volver y foco en h1 · Cambio 1
import { Link } from 'react-router-dom';
import { useFocoAlMontar } from '../../hooks/useFocoAlMontar';
import Icono from '../ui/Icono';
import { RUTAS } from '../../constants/rutas';

export default function EncabezadoDetalle({ search = '', reservaId = null }) {
  const refTitulo = useFocoAlMontar(true, 'Detalle de reserva');

  return (
    <header className="mb-4 space-y-1.5">
      <div>
        <Link
          to={`${RUTAS.RESERVAS}${search}`}
          state={reservaId ? { enfocarId: reservaId } : undefined}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-texto-suave hover:text-primario-enlace transition-colors focus-visible:ring-2 focus-visible:ring-anillo-foco rounded-control outline-none py-1"
        >
          <Icono nombre="ArrowLeft" className="w-4 h-4 shrink-0" />
          <span>Volver a reservas</span>
        </Link>
      </div>
      <h1
        ref={refTitulo}
        tabIndex={-1}
        className="text-2xl sm:text-3xl font-bold text-texto tracking-tight outline-none"
      >
        Detalle de reserva
      </h1>
    </header>
  );
}
