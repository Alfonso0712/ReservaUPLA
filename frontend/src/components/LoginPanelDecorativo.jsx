import logoUpla from '../assets/logo-upla.png';

// Panel decorativo institucional para la pantalla de Login inspirado en la referencia visual
export default function LoginPanelDecorativo() {
  return (
    <div className="login-panel-decorativo">
      {/* Encabezado con Logo y Nombre Institucional */}
      <div className="login-brand-header">
        <div className="login-brand-badge">
          <img src={logoUpla} alt="Logo UPLA" className="login-brand-logo" />
        </div>
        <div className="login-brand-texto">
          <span className="login-brand-institucion">UNIVERSIDAD PERUANA LOS ANDES</span>
          <span className="login-brand-lema">EDUCACIÓN CON VALORES Y TRASCENDENCIA</span>
        </div>
      </div>

      {/* Contenido central hero */}
      <div className="login-hero-container">
        <span className="login-hero-tag">BIENVENIDOS A:</span>
        <h1 className="login-hero-title">ReservaUPLA</h1>
        <p className="login-hero-desc">
          Plataforma oficial para la gestión, reserva y disponibilidad en tiempo real de laboratorios de cómputo, 
          auditorios institucionales y salas académicas especializadas.
        </p>
      </div>

      {/* Pie institucional */}
      <div className="login-panel-pie">
        <span>Universidad Peruana Los Andes © 2026</span>
        <span>Gestión de Ambientes Universitarios</span>
      </div>
    </div>
  );
}
