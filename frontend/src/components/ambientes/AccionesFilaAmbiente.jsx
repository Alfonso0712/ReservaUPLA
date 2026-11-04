// Acciones de fila en catálogo de ambientes según permisos RBAC · E-39..44
import Button from '../ui/Button';

export default function AccionesFilaAmbiente({
  ambiente, puedeEditar, puedeCambiarEstado, puedeCrearReserva,
  alEditar, alCambiarEstado, alReservar
}) {
  if (puedeEditar || puedeCambiarEstado) {
    return (
      <div className="flex items-center gap-2">
        {puedeEditar && (
          <Button variante="secundario" className="text-sm px-3" onClick={() => alEditar(ambiente)}>
            Editar
          </Button>
        )}
        {puedeCambiarEstado && (
          <Button variante="secundario" className="text-sm px-3" onClick={() => alCambiarEstado(ambiente)}>
            Cambiar estado
          </Button>
        )}
      </div>
    );
  }

  if (puedeCrearReserva) {
    if (ambiente.estado === 'Disponible') {
      return (
        <Button variante="secundario" aria-label={`Reservar ${ambiente.nombre}`} onClick={() => alReservar(ambiente.id)} className="text-sm px-3">
          Reservar
        </Button>
      );
    }
    return <span className="text-sm text-texto-suave">{`No disponible por ${ambiente.estado.toLowerCase()}`}</span>;
  }

  return null;
}
