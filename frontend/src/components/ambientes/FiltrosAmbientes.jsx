// RF-02 · Nielsen 1 · Nielsen 4 · Nielsen 6 · Barra compacta de filtros en una sola fila · E-26
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
    <section aria-label="Filtros de catálogo de ambientes" className="p-2 sm:p-2.5 rounded-tarjeta border border-borde bg-superficie">
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3">
        <div className="flex-1 min-w-[200px]">
          <TextInput
            id="campo-filtro-texto-ambientes"
            nombre="filtro-texto-ambientes"
            etiqueta=""
            aria-label="Buscar"
            obligatorio={false}
            tipo="search"
            tamano="sm"
            valor={texto}
            alCambiar={(e) => alCambiarTexto?.(e.target.value)}
            placeholder="Nombre o ubicación"
          />
        </div>
        <div className="w-full sm:w-56 shrink-0">
          <SelectInput
            id="filtro-tipo-ambientes"
            nombre="filtro-tipo-ambientes"
            etiqueta=""
            aria-label="Tipo de ambiente"
            obligatorio={false}
            tamano="sm"
            valor={tipo}
            alCambiar={(e) => alCambiarTipo?.(e.target.value)}
            opciones={LISTA_TIPOS_AMBIENTE}
            placeholder="Todos los tipos"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <span role="status" aria-live="polite" className="text-xs font-semibold text-texto-suave cifra-tabular">
            {etiquetaConteo}
          </span>
          {hayFiltrosActivos && (
            <Button variante="ghost" tamano="sm" icono="RotateCcw" aria-label="Limpiar filtros" onClick={alLimpiar}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
