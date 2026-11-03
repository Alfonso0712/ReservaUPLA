import { useState } from 'react';

// Nielsen 10 · Shneiderman 8 · Panel de ayuda accesible con aria-expanded y aria-controls
export default function PanelAyuda({
  id = 'panel-ayuda-general',
  titulo = 'Guía y Horarios Permitidos',
  children
}) {
  const [expandido, setExpandido] = useState(false);
  const contenidoId = `${id}-contenido`;

  return (
    <aside className="panel-ayuda" aria-label="Ayuda contextual">
      <button
        type="button"
        id={`${id}-boton`}
        className="boton-ayuda-desplegable"
        aria-expanded={expandido}
        aria-controls={contenidoId}
        onClick={() => setExpandido((prev) => !prev)}
        style={{ minHeight: '44px' }}
      >
        <span>ℹ️ {titulo}</span>
        <span aria-hidden="true">{expandido ? ' ▲' : ' ▼'}</span>
      </button>

      {expandido && (
        <div id={contenidoId} className="panel-ayuda-contenido" role="region">
          {children || (
            <div>
              <p><strong>Horario de atención:</strong> Las reservas se admiten exclusivamente entre las <strong>07:00</strong> y las <strong>22:00</strong> (RN-04).</p>
              <p><strong>Regla de disponibilidad:</strong> No se permiten solapamientos con reservas ya aprobadas (RN-01).</p>
              <p><strong>Antelación:</strong> La fecha debe ser igual o posterior a la fecha actual (RV-08).</p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
