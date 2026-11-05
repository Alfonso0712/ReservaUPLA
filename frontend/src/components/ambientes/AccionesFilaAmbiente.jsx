// ISO 9241-110 · Botones icon-only con tooltip dinámico y sin menú para ambientes
import Button from '../ui/Button';
import Icono from '../ui/Icono';
import { MAPA_ICONOS } from '../../constants/iconos';

export default function AccionesFilaAmbiente({
  ambiente, puedeEditar, puedeCambiarEstado, puedeCrearReserva,
  alEditar, alCambiarEstado, alReservar
}) {
  if (puedeEditar || puedeCambiarEstado) {
    const tooltipEstado = ambiente.estado === 'Disponible' ? 'Marcar como no disponible' : 'Marcar como disponible';

    return (
      <div className="flex items-center justify-center gap-2">
        {puedeEditar && (
          <Button
            variante="neutral-info"
            tamano="sm"
            iconOnly
            icono={MAPA_ICONOS.EDITAR}
            tooltip="Editar"
            aria-label="Editar"
            onClick={() => alEditar(ambiente)}
          />
        )}
        {puedeCambiarEstado && (
          <Button
            variante="warning"
            tamano="sm"
            iconOnly
            icono="Power"
            tooltip={tooltipEstado}
            aria-label={tooltipEstado}
            onClick={() => alCambiarEstado(ambiente)}
          />
        )}
      </div>
    );
  }

  if (puedeCrearReserva) {
    if (ambiente.estado === 'Disponible') {
      return (
        <Button variante="success" tamano="sm" icono="CalendarPlus" aria-label={`Reservar ${ambiente.nombre}`} onClick={() => alReservar(ambiente.id)}>
          Reservar
        </Button>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-texto-suave">
        <Icono nombre={MAPA_ICONOS.CANCELAR} className="w-4 h-4 text-cancelada-texto" />
        <span>{`No disponible por ${ambiente.estado.toLowerCase()}`}</span>
      </span>
    );
  }

  return null;
}
