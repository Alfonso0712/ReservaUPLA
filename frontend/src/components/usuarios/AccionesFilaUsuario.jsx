// Acciones por fila de usuario (editar y activar/desactivar)
import Button from '../ui/Button';

export default function AccionesFilaUsuario({
  usuario,
  puedeEditar,
  puedeCambiarEstado,
  esUsuarioActual = false,
  alEditar,
  alCambiarEstado
}) {
  const esAdmin = ['Administrador'].includes(usuario?.rol);

  if (esAdmin) {
    return (
      <span className="text-xs text-texto-suave italic px-2">
        Cuenta protegida
      </span>
    );
  }

  const tooltipEstado = usuario.activo ? 'Desactivar usuario' : 'Activar usuario';
  const noPuedeDesactivar = esUsuarioActual && usuario.activo;

  return (
    <div className="inline-flex items-center justify-end gap-2">
      {puedeEditar && (
        <Button
          variante="neutral-info"
          tamano="sm"
          iconOnly
          icono="Pencil"
          tooltip="Editar usuario"
          aria-label={`Editar usuario ${usuario.nombreCompleto}`}
          onClick={() => alEditar(usuario)}
        />
      )}
      {puedeCambiarEstado && (
        <Button
          variante={usuario.activo ? 'warning' : 'success'}
          tamano="sm"
          iconOnly
          icono="Power"
          tooltip={noPuedeDesactivar ? 'No puede desactivarse a sí mismo' : tooltipEstado}
          alineacionTooltip="derecha"
          disabled={noPuedeDesactivar}
          aria-label={`${usuario.activo ? 'Desactivar' : 'Activar'} usuario ${usuario.nombreCompleto}`}
          onClick={() => alCambiarEstado(usuario)}
        />
      )}
    </div>
  );
}
