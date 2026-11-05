// RF-02 · Nielsen 1 · Nielsen 6 · Filtros integrados de ambientes con feedback · E-26
import { LISTA_TIPOS_AMBIENTE } from '../../constants/tiposAmbiente';
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
    <section aria-label="Filtros de catálogo de ambientes" className="p-3.5 rounded-tarjeta border border-borde bg-superficie space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextInput
          nombre="filtro-texto-ambientes"
          etiqueta="Buscar"
          obligatorio={false}
          tipo="search"
          valor={texto}
          alCambiar={(e) => alCambiarTexto?.(e.target.value)}
          placeholder="Nombre o ubicación"
        />
        <SelectInput
          nombre="filtro-tipo-ambientes"
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
