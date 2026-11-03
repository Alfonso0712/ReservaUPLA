import Logo from './Logo';
import Button from './Button';
import ShellNav from './ShellNav';
import { IconoSol, IconoLuna } from './Iconos';

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
        <ShellNav rol={rol} vistaActiva={vistaActiva} alCambiarVista={alCambiarVista} />
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
              {tema === 'dark' ? (
                <>
                  <IconoSol size={16} /> Claro
                </>
              ) : (
                <>
                  <IconoLuna size={16} /> Oscuro
                </>
              )}
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
