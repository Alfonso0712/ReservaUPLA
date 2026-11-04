// ISO 9241-110 · Jerarquía de acciones por fila en catálogo de ambientes
import Button from '../ui/Button';
import Icono from '../ui/Icono';
import MenuAccionesFila from '../ui/MenuAccionesFila';
import { MAPA_ICONOS } from '../../constants/iconos';

export default function AccionesFilaAmbiente({
  ambiente, puedeEditar, puedeCambiarEstado, puedeCrearReserva,
  alEditar, alCambiarEstado, alReservar
}) {
  if (puedeEditar || puedeCambiarEstado) {
    const itemsMenu = [];
    if (puedeCambiarEstado) {
      itemsMenu.push({
        etiqueta: 'Cambiar estado',
        icono: MAPA_ICONOS.CAMBIAR_ESTADO,
        onClick: () => alCambiarEstado(ambiente)
      });
    }

    return (
      <div className="flex items-center gap-2">
        {puedeEditar && (
          <Button
            variante="secondary"
            tamano="sm"
            iconOnly
            icono={MAPA_ICONOS.EDITAR}
            tooltip={`Editar ${ambiente.nombre}`}
            aria-label="Editar"
            onClick={() => alEditar(ambiente)}
          />
        )}
        {itemsMenu.length > 0 && (
          <MenuAccionesFila
            items={itemsMenu}
            ariaLabel={`Más acciones para ${ambiente.nombre}`}
          />
        )}
      </div>
    );
  }

  if (puedeCrearReserva) {
    if (ambiente.estado === 'Disponible') {
      return (
        <Button
          variante="success"
          tamano="sm"
          icono="CalendarPlus"
          aria-label={`Reservar ${ambiente.nombre}`}
          onClick={() => alReservar(ambiente.id)}
        >
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
