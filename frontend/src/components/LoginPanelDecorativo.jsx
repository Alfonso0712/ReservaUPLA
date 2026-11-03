// Panel decorativo institucional para la pantalla de Login
export default function LoginPanelDecorativo() {
  return (
    <div className="login-panel-decorativo" aria-hidden="true">
      <div className="tarjeta-decorativa">
        <h2>Gestión de Ambientes Universitarios</h2>
        <p>Plataforma para laboratorios, auditorios y salas de reuniones de la UPLA Huancayo.</p>
        <ul className="decorativa-lista">
          <li>🛡️ Validación automática de horarios</li>
          <li>⚡ Consulta de disponibilidad en tiempo real</li>
          <li>🏛️ Respaldo institucional oficial</li>
        </ul>
      </div>
    </div>
  );
}
