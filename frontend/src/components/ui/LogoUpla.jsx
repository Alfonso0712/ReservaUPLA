// Nielsen 4 · Único componente que expone el logo institucional existente
import logoPng from '../../assets/logo-upla.png';
import logoSvg from '../../assets/logo-upla.svg';

export default function LogoUpla({
  variante = 'marca',
  usarSvg = false,
  alt = 'Logo de la Universidad Peruana Los Andes',
  className = ''
}) {
  const clasesTamano = {
    marca: 'w-16 h-auto object-contain',
    lateral: 'w-10 h-10 object-contain',
    compacto: 'w-9 h-9 object-contain'
  };

  return (
    <img
      src={usarSvg ? logoSvg : logoPng}
      alt={alt}
      className={`${clasesTamano[variante] || clasesTamano.marca} ${className}`.trim()}
    />
  );
}
