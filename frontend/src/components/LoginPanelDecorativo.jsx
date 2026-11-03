import logoUpla from '../assets/logo-upla.png';

// Panel decorativo institucional con recuadro enmarcado para apreciar la imagen de fondo
export default function LoginPanelDecorativo() {
  return (
    <aside className="login-panel-decorativo" aria-label="Información institucional ReservaUPLA">
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

      {/* Recuadro enmarcado que contiene el texto para destacar y apreciar la foto */}
      <div className="login-hero-card">
        <span className="login-hero-tag">SISTEMA INSTITUCIONAL</span>
        <h1 className="login-hero-title">ReservaUPLA</h1>
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
