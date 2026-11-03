// Navegacion lateral de Shell segmentada por rol
export default function ShellNav({ rol, vistaActiva, alCambiarVista }) {
  return (
    <nav className="shell-nav">
      <button
        type="button"
        className={`nav-enlace ${vistaActiva === 'dashboard' ? 'nav-activo' : ''}`}
        onClick={() => alCambiarVista('dashboard')}
        aria-current={vistaActiva === 'dashboard' ? 'page' : undefined}
      >
        📊 Dashboard
      </button>
      <button
        type="button"
        className={`nav-enlace ${vistaActiva === 'reservas' ? 'nav-activo' : ''}`}
        onClick={() => alCambiarVista('reservas')}
        aria-current={vistaActiva === 'reservas' ? 'page' : undefined}
      >
        📋 {rol === 'Solicitante' ? 'Mis Reservas' : 'Listado Reservas'}
      </button>
      {rol === 'Solicitante' && (
        <button
          type="button"
          className={`nav-enlace ${vistaActiva === 'nueva-reserva' ? 'nav-activo' : ''}`}
          onClick={() => alCambiarVista('nueva-reserva')}
          aria-current={vistaActiva === 'nueva-reserva' ? 'page' : undefined}
        >
          ➕ Nueva Reserva
        </button>
      )}
      <button
        type="button"
        className={`nav-enlace ${vistaActiva === 'ambientes' ? 'nav-activo' : ''}`}
        onClick={() => alCambiarVista('ambientes')}
        aria-current={vistaActiva === 'ambientes' ? 'page' : undefined}
      >
        🏛️ Ambientes
      </button>
    </nav>
  );
}
