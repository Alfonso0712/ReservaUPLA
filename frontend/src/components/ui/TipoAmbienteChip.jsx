// ISO 9241-110 · Metadato de tipo de ambiente: texto e ícono discreto sin fondo ni borde
import Icono from './Icono';
import { ICONO_POR_TIPO_AMBIENTE } from '../../constants/tiposAmbiente';

const MAPA_ETIQUETAS = {
  LaboratorioComputo: 'Laboratorio de cómputo',
  Auditorio: 'Auditorio',
  SalaReuniones: 'Sala de reuniones',
  LaboratorioEspecializado: 'Laboratorio especializado'
};

export default function TipoAmbienteChip({ tipo }) {
  if (!tipo) return null;
  const etiqueta = MAPA_ETIQUETAS[tipo] || tipo;
  const nombreIcono = ICONO_POR_TIPO_AMBIENTE[etiqueta] || ICONO_POR_TIPO_AMBIENTE[tipo] || 'Building2';

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-texto whitespace-nowrap" title={etiqueta}>
      <Icono nombre={nombreIcono} className="w-3.5 h-3.5 text-texto-suave shrink-0" />
      <span>{etiqueta}</span>
    </span>
  );
}
