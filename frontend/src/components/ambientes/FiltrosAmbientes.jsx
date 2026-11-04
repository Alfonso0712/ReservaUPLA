// RF-02 · Nielsen 1 · Nielsen 6 · Filtros etiquetados de ambientes con conteo en aria-live · E-26
import { LISTA_TIPOS_AMBIENTE } from '../../constants/tiposAmbiente';
import { MENSAJES } from '../../constants/mensajes';
import TextInput from '../formulario/TextInput';
import SelectInput from '../formulario/SelectInput';
import Button from '../ui/Button';

export default function FiltrosAmbientes({
  texto = '',
  tipo = '',
  totalResultados = 0,
  alCambiarTexto,
  alCambiarTipo,
  alLimpiar
}) {
  const hayFiltrosActivos = Boolean(texto.trim() || tipo);
  const etiquetaConteo = totalResultados === 1 ? '1 ambiente encontrado' : `${totalResultados} ambientes encontrados`;

  return (
    <section aria-label="Filtros de catálogo de ambientes" className="mb-5 p-4 rounded-tarjeta border border-borde bg-superficie space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          nombre="filtro-texto-ambientes"
          etiqueta="Buscar ambiente"
          obligatorio={false}
          tipo="search"
          valor={texto}
          alCambiar={(e) => alCambiarTexto?.(e.target.value)}
          placeholder="Nombre o ubicación del ambiente"
          ayuda={MENSAJES.AYUDA_FILTRO_BUSCAR_AMBIENTE}
        />
        <SelectInput
          nombre="filtro-tipo-ambientes"
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
