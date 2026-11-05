// Barra fija inferior para dispositivos móviles · Cambio 6
import Button from '../ui/Button';
import { ESTADOS_RESERVA } from '../../constants/estados';

export default function BarraInferiorMovil({
  reserva, puedeAprobar, puedeCancelar, enProceso, alAprobar, alRechazar, alCancelar
}) {
  if (!reserva) return null;
  const esPend = reserva.estado === ESTADOS_RESERVA.PENDIENTE;
  const esAprob = reserva.estado === ESTADOS_RESERVA.APROBADA;

  if (esPend && puedeAprobar) {
    return (
      <aside aria-label="Acciones móviles sobre la reserva" className="sm:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-superficie border-t border-borde shadow-lg flex items-center justify-center gap-2">
        <Button variante="success" disabled={enProceso} icono="Check" className="flex-1 justify-center" onClick={() => alAprobar(reserva)}>
          Aprobar
        </Button>
        <Button variante="danger-outline" disabled={enProceso} icono="X" className="flex-1 justify-center" onClick={() => alRechazar(reserva)}>
          Rechazar
        </Button>
      </aside>
    );
  }

  if (esAprob && puedeCancelar) {
    return (
      <aside aria-label="Acciones móviles sobre la reserva" className="sm:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-superficie border-t border-borde shadow-lg flex items-center justify-center">
        <Button variante="danger-outline" disabled={enProceso} icono="Ban" className="w-full justify-center" onClick={() => alCancelar(reserva)}>
          Cancelar reserva
        </Button>
      </aside>
    );
  }

  return null;
}
