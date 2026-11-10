// Permisos del sistema ReservaUPLA (fuente de verdad sincronizada con backend)
export const PERMISOS = Object.freeze({
  DASHBOARD_VER: 'dashboard.ver',
  RESERVAS_VER: 'reservas.ver',
  RESERVAS_CREAR: 'reservas.crear',
  RESERVAS_APROBAR: 'reservas.aprobar',
  RESERVAS_RECHAZAR: 'reservas.rechazar',
  RESERVAS_CANCELAR_PROPIAS: 'reservas.cancelarPropias',
  RESERVAS_CANCELAR_CUALQUIERA: 'reservas.cancelarCualquiera',
  AMBIENTES_VER: 'ambientes.ver',
  AMBIENTES_CREAR: 'ambientes.crear',
  AMBIENTES_EDITAR: 'ambientes.editar',
  AMBIENTES_CAMBIAR_ESTADO: 'ambientes.cambiarEstado',
  USUARIOS_LISTAR_RESPONSABLES: 'usuarios.listarResponsables',

  // Gestión de Usuarios (Admin)
  USUARIOS_LISTAR: 'usuarios.listar',
  USUARIOS_CREAR: 'usuarios.crear',
  USUARIOS_EDITAR: 'usuarios.editar',
  USUARIOS_CAMBIAR_ESTADO: 'usuarios.cambiarEstado'
});
