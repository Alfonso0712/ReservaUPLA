import logoUpla from '../assets/logo-upla.png';

// Componente unico de Logo con area de reserva y ancho minimo >= 25 px
export default function Logo({ ancho = 120, className = '' }) {
  const anchoFinal = Math.max(25, ancho);

  return (
    <div
      className={`logo-contenedor ${className}`}
      style={{ padding: '4px', display: 'inline-flex', alignItems: 'center' }}
    >
      <img
        src={logoUpla}
        alt="Universidad Peruana Los Andes"
        width={anchoFinal}
        style={{ minWidth: '25px', height: 'auto', display: 'block', objectFit: 'contain' }}
      />
    </div>
  );
}
