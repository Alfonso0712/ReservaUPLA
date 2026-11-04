// RF-05 · Nielsen 1 · Nielsen 6 · Filtros integrados compactos con feedback inmediato · E-26
import { LISTA_TIPOS_AMBIENTE } from '../../constants/tiposAmbiente';
import TextInput from '../formulario/TextInput';
import SelectInput from '../formulario/SelectInput';
import Button from '../ui/Button';

export default function FiltrosReservas({
  texto = '',
  estado = '',
  tipo = '',
  totalResultados = 0,
  alCambiarTexto,
  alCambiarTipo,
  alLimpiar
}) {
  const hayFiltrosActivos = Boolean(texto.trim() || estado || tipo);
  const etiquetaConteo = totalResultados === 1 ? '1 reserva encontrada' : `${totalResultados} reservas encontradas`;

  return (
    <section aria-label="Filtros de reservas" className="p-3.5 rounded-tarjeta border border-borde bg-superficie space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextInput
          nombre="filtro-texto-reservas"
          etiqueta="Buscar"
          obligatorio={false}
          tipo="search"
          valor={texto}
          alCambiar={(e) => alCambiarTexto?.(e.target.value)}
          placeholder="Solicitante o ambiente"
        />
        <SelectInput
          nombre="filtro-tipo-reservas"
          etiqueta="Tipo de ambiente"
          obligatorio={false}
          valor={tipo}
          alCambiar={(e) => alCambiarTipo?.(e.target.value)}
          opciones={LISTA_TIPOS_AMBIENTE}
          placeholder="Todos los tipos"
        />
      </div>

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-borde/60">
        <p role="status" aria-live="polite" className="text-xs sm:text-sm font-semibold text-texto-suave cifra-tabular">
          {etiquetaConteo}
        </p>
        {hayFiltrosActivos && (
          <Button variante="ghost" tamano="sm" icono="RotateCcw" onClick={alLimpiar}>
            Limpiar filtros
          </Button>
        )}
      </div>
    </section>
  );
}
