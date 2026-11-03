import Logo from './Logo';
import Button from './Button';

// Shell principal · Nielsen 3 · Shneiderman 2 · ISO 9241-11
export default function Shell({
  usuario,
  vistaActiva,
  alCambiarVista,
  alCerrarSesion,
  tema,
  alAlternarTema,
  children
}) {
  const rol = usuario?.rol || 'Solicitante';

  return (
    <div className="shell-contenedor">
      <aside className="shell-lateral" aria-label="Navegación principal">
        <div className="shell-logo">
          <Logo ancho={110} />
        </div>
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
      </aside>

      <div className="shell-principal">
        <header className="shell-cabecera">
          <div className="usuario-info">
            <span className="usuario-nombre">{usuario?.nombreCompleto}</span>
            <span className="usuario-rol badge-rol">{rol}</span>
          </div>
          <div className="cabecera-acciones">
            <button
              type="button"
              className="boton-tema"
              onClick={alAlternarTema}
              aria-label={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {tema === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
            </button>
            <Button variante="secundario" onClick={alCerrarSesion}>
              Cerrar sesión
            </Button>
          </div>
        </header>

        <main className="shell-contenido">{children}</main>
      </div>
    </div>
  );
}
