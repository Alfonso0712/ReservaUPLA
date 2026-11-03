import logoUpla from '../assets/logo-upla.png';
import { IconoSol, IconoLuna } from './Iconos';

// Panel decorativo institucional con fondo fotográfico y contenido transparente integrado
export default function LoginPanelDecorativo({ tema = 'light', alAlternarTema }) {
  return (
    <aside className="login-panel-decorativo" aria-label="Información institucional ReservaUPLA">
      {/* Botón para alternar tema en la esquina superior sobre la imagen */}
      {alAlternarTema && (
        <button
          type="button"
          className="boton-tema-imagen"
          onClick={alAlternarTema}
          aria-label={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {tema === 'dark' ? (
            <>
              <IconoSol size={15} /> Modo Claro
            </>
          ) : (
            <>
              <IconoLuna size={15} /> Modo Oscuro
            </>
          )}
        </button>
      )}

      {/* Cabecera institucional superior */}
      <div className="login-brand-header">
        <div className="login-brand-badge">
          <img src={logoUpla} alt="Logo UPLA" className="login-brand-logo" />
        </div>
        <div className="login-brand-texto">
          <span className="login-brand-institucion">UNIVERSIDAD PERUANA LOS ANDES</span>
          <span className="login-brand-lema">EDUCACIÓN CON VALORES Y TRASCENDENCIA</span>
        </div>
      </div>

      {/* Contenido transparente integrado naturalmente con la fotografía */}
      <div className="login-hero-card">
        <span className="login-hero-tag">SISTEMA INSTITUCIONAL</span>
        <h1 className="login-hero-title" aria-label="ReservaUPLA">
          Reserva<span className="titulo-upla-acento">UPLA</span>
        </h1>
        <p className="login-hero-desc">
          Plataforma oficial para la gestión, reserva y trazabilidad en tiempo real 
          de laboratorios de cómputo, auditorios y salas académicas especializadas.
        </p>
      </div>

      {/* Pie institucional inferior */}
      <div className="login-panel-pie">
        <span>Universidad Peruana Los Andes © 2026</span>
        <span>Gestión de Ambientes Universitarios</span>
      </div>
    </aside>
  );
}
