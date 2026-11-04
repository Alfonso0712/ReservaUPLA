// Nielsen 1 · Visibilidad del estado del sistema
import Icono from './Icono';
import { MENSAJES } from '../../constants/mensajes';

export default function Cargando({ mensaje = MENSAJES.CARGANDO }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-3 p-8 rounded-tarjeta border border-borde bg-superficie text-texto"
    >
      <Icono nombre="Loader2" className="w-5 h-5 animate-spin text-primario" />
      <span className="text-base font-medium">{mensaje}</span>
    </div>
  );
}
