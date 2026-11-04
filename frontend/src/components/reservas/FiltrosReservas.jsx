// RF-05 · Nielsen 1 · Nielsen 6 · Filtros etiquetados con un único contador en región aria-live="polite" · E-26
import { LISTA_ESTADOS_RESERVA } from '../../constants/estados';
import { LISTA_TIPOS_AMBIENTE } from '../../constants/tiposAmbiente';
import { MENSAJES } from '../../constants/mensajes';
import TextInput from '../formulario/TextInput';
import SelectInput from '../formulario/SelectInput';
import Button from '../ui/Button';

export default function FiltrosReservas({
  texto = '',
  estado = '',
  tipo = '',
  totalResultados = 0,
  alCambiarTexto,
  alCambiarEstado,
  alCambiarTipo,
  alLimpiar
}) {
  const hayFiltrosActivos = Boolean(texto.trim() || estado || tipo);
  const etiquetaConteo = totalResultados === 1 ? '1 resultado encontrado' : `${totalResultados} resultados encontrados`;

  return (
    <section aria-label="Filtros de búsqueda de reservas" className="mb-5 p-4 rounded-tarjeta border border-borde bg-superficie space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextInput
          nombre="filtro-texto-reservas"
          etiqueta="Buscar"
          obligatorio={false}
          tipo="search"
          valor={texto}
          alCambiar={(e) => alCambiarTexto?.(e.target.value)}
          placeholder="Solicitante, ambiente o motivo"
          ayuda={MENSAJES.AYUDA_FILTRO_BUSCAR_RESERVA}
        />
        <SelectInput
          nombre="filtro-estado-reservas"
          etiqueta="Estado"
          obligatorio={false}
          valor={estado}
          alCambiar={(e) => alCambiarEstado?.(e.target.value)}
          opciones={LISTA_ESTADOS_RESERVA}
          placeholder="Todos los estados"
          ayuda={MENSAJES.AYUDA_FILTRO_ESTADO}
        />
        <SelectInput
          nombre="filtro-tipo-reservas"
          etiqueta="Tipo de ambiente"
          obligatorio={false}
          valor={tipo}
          alCambiar={(e) => alCambiarTipo?.(e.target.value)}
          opciones={LISTA_TIPOS_AMBIENTE}
          placeholder="Todos los tipos"
          ayuda={MENSAJES.AYUDA_FILTRO_TIPO}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-borde">
        <p role="status" aria-live="polite" className="text-sm font-semibold text-texto cifra-tabular">
          {etiquetaConteo}
        </p>
        {hayFiltrosActivos && (
          <Button variante="secundario" onClick={alLimpiar}>
            Limpiar filtros
          </Button>
        )}
      </div>
    </section>
  );
}
