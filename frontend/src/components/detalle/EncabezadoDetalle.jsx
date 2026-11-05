// Cabecera normativa con título, descripción y acción Volver a reservas a la derecha · Nielsen 4
import { Link } from 'react-router-dom';
import EncabezadoPagina from '../navegacion/EncabezadoPagina';
import Icono from '../ui/Icono';
import { RUTAS } from '../../constants/rutas';

export default function EncabezadoDetalle({ search = '', reservaId = null }) {
  const accionVolver = (
    <Link
      to={`${RUTAS.RESERVAS}${search}`}
      state={reservaId ? { enfocarId: reservaId } : undefined}
      className="min-h-control px-3.5 py-2 rounded-control border border-borde bg-superficie hover:bg-superficie-2 text-texto font-medium text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-anillo-foco outline-none shadow-sm"
    >
      <Icono nombre="ArrowLeft" className="w-4 h-4 shrink-0" />
      <span>Volver a reservas</span>
    </Link>
  );

  return (
    <EncabezadoPagina
      titulo="Detalle de reserva"
      descripcion="Información completa de la solicitud, estado actual y acciones permitidas."
      accionPrimaria={accionVolver}
    />
  );
}
