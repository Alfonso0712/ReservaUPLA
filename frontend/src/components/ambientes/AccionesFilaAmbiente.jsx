// Acciones de fila en catálogo de ambientes con íconos de color y tamaño armonizado · E-39..44
import Button from '../ui/Button';
import Icono from '../ui/Icono';

export default function AccionesFilaAmbiente({
  ambiente, puedeEditar, puedeCambiarEstado, puedeCrearReserva,
  alEditar, alCambiarEstado, alReservar
}) {
  if (puedeEditar || puedeCambiarEstado) {
    return (
      <div className="flex items-center gap-1.5">
        {puedeEditar && (
          <Button variante="secundario" tamano="sm" className="border-borde hover:border-primario" onClick={() => alEditar(ambiente)}>
            <Icono nombre="Pencil" className="w-3.5 h-3.5 text-primario" />
            <span>Editar</span>
          </Button>
        )}
        {puedeCambiarEstado && (
          <Button variante="secundario" tamano="sm" className="border-borde hover:border-pendiente-texto" onClick={() => alCambiarEstado(ambiente)}>
            <Icono nombre="ArrowRightLeft" className="w-3.5 h-3.5 text-pendiente-texto" />
            <span>Cambiar estado</span>
          </Button>
        )}
      </div>
    );
  }

  if (puedeCrearReserva) {
    if (ambiente.estado === 'Disponible') {
      return (
        <Button variante="secundario" tamano="sm" className="border-aprobada-texto text-aprobada-texto hover:bg-aprobada-fondo" aria-label={`Reservar ${ambiente.nombre}`} onClick={() => alReservar(ambiente.id)}>
          <Icono nombre="CalendarPlus" className="w-3.5 h-3.5 text-aprobada-texto" />
          <span>Reservar</span>
        </Button>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-texto-suave">
        <Icono nombre="Ban" className="w-3.5 h-3.5 text-cancelada-texto" />
        <span>{`No disponible por ${ambiente.estado.toLowerCase()}`}</span>
      </span>
    );
  }

  return null;
}
