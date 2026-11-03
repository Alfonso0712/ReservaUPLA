import { IconoDashboard, IconoReservas, IconoMas, IconoAmbiente } from './Iconos';

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
        <IconoDashboard size={18} />
        <span>Dashboard</span>
      </button>
      <button
        type="button"
        className={`nav-enlace ${vistaActiva === 'reservas' ? 'nav-activo' : ''}`}
        onClick={() => alCambiarVista('reservas')}
        aria-current={vistaActiva === 'reservas' ? 'page' : undefined}
      >
        <IconoReservas size={18} />
        <span>{rol === 'Solicitante' ? 'Mis Reservas' : 'Listado Reservas'}</span>
      </button>
      {rol === 'Solicitante' && (
        <button
          type="button"
          className={`nav-enlace ${vistaActiva === 'nueva-reserva' ? 'nav-activo' : ''}`}
          onClick={() => alCambiarVista('nueva-reserva')}
          aria-current={vistaActiva === 'nueva-reserva' ? 'page' : undefined}
        >
          <IconoMas size={18} />
          <span>Nueva Reserva</span>
        </button>
      )}
      <button
        type="button"
        className={`nav-enlace ${vistaActiva === 'ambientes' ? 'nav-activo' : ''}`}
        onClick={() => alCambiarVista('ambientes')}
        aria-current={vistaActiva === 'ambientes' ? 'page' : undefined}
      >
        <IconoAmbiente size={18} />
        <span>Ambientes</span>
      </button>
    </nav>
  );
}
