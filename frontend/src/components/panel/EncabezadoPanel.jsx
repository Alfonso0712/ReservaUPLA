// Encabezado del Panel con saludo contextual y accesos rápidos · Cambio 1
import { useNavigate } from 'react-router-dom';
import { useFocoAlMontar } from '../../hooks/useFocoAlMontar';
import Button from '../ui/Button';
import Icono from '../ui/Icono';
import { RUTAS } from '../../constants/rutas';
import { obtenerSaludoHoraPeru, obtenerPrimerNombre } from '../../utils/horarioPeru';

export default function EncabezadoPanel({ usuario, pendientes = 0, puedeReservar, puedeCrearAmbiente, alNuevaReserva }) {
  const navigate = useNavigate();
  const refTitulo = useFocoAlMontar(true, 'Panel');
  const saludo = obtenerSaludoHoraPeru();
  const primerNombre = obtenerPrimerNombre(usuario?.nombreCompleto);
  const subtitulo = pendientes > 0
    ? `${saludo}, ${primerNombre}. Tienes ${pendientes} ${pendientes === 1 ? 'reserva' : 'reservas'} por resolver.`
    : 'Todo al día: no hay reservas por resolver.';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
      <div>
        <h1 ref={refTitulo} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-texto tracking-tight outline-none">Panel</h1>
        <p className="mt-1 text-sm sm:text-base text-texto-suave leading-relaxed">{subtitulo}</p>
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        {puedeReservar && (
          <Button variante="primary" onClick={alNuevaReserva}>
            <Icono nombre="Plus" className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Nueva reserva</span>
          </Button>
        )}
        {puedeCrearAmbiente && (
          <Button variante="secondary" className="hidden sm:inline-flex" onClick={() => navigate(RUTAS.AMBIENTES)}>
            <Icono nombre="Plus" className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Nuevo ambiente</span>
          </Button>
        )}
      </div>
    </div>
  );
}
