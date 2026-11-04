// Nielsen 1 · ISO 9241-110 · Estado vacío con acción siguiente sugerida
import Icono from './Icono';

export default function EstadoVacio({
  icono = 'Info',
  titulo = 'Sin resultados para mostrar',
  descripcion = '',
  accion = null
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-tarjeta border border-borde bg-superficie">
      <div className="p-3 mb-3 rounded-control bg-superficie-2 text-primario">
        <Icono nombre={icono} className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-semibold text-texto mb-1">{titulo}</h2>
      {descripcion && <p className="text-base text-texto-suave mb-4">{descripcion}</p>}
      {accion && <div className="mt-1">{accion}</div>}
    </div>
  );
}
