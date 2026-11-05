// Encabezado del Panel con descripción heurística · RF-08 · WCAG 2.2 AA
import { useFocoAlMontar } from '../../hooks/useFocoAlMontar';
import Button from '../ui/Button';
import Icono from '../ui/Icono';

export default function EncabezadoPanel({ puedeReservar = false, alNuevaReserva }) {
  const refTitulo = useFocoAlMontar(true, 'Panel');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
      <div>
        <h1 ref={refTitulo} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-texto tracking-tight outline-none">
          Panel
        </h1>
        <p className="mt-1 text-sm sm:text-base text-texto-suave leading-relaxed">
          Resumen general del estado de las reservas y uso de ambientes académicos.
        </p>
      </div>
      {puedeReservar && (
        <div className="flex items-center gap-2.5 shrink-0">
          <Button variante="primary" onClick={alNuevaReserva}>
            <Icono nombre="Plus" className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Nueva reserva</span>
          </Button>
        </div>
      )}
    </div>
  );
}
