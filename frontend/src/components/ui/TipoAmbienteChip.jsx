// Shneiderman 1 · Tono neutro único con ícono propio por tipo de ambiente
import Icono from './Icono';
import { ICONO_POR_TIPO_AMBIENTE } from '../../constants/tiposAmbiente';

export default function TipoAmbienteChip({ tipo }) {
  const nombreIcono = ICONO_POR_TIPO_AMBIENTE[tipo] || 'Building2';

  return (
    <span className="inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-control border border-borde bg-superficie-2 text-texto text-sm font-medium leading-tight">
      <Icono nombre={nombreIcono} className="w-4 h-4 shrink-0 text-texto-suave" />
      <span>{tipo}</span>
    </span>
  );
}
