// Barra compacta de filtros para catálogo de usuarios
import TextInput from '../formulario/TextInput';
import SelectInput from '../formulario/SelectInput';
import Button from '../ui/Button';

const OPCIONES_ROL = [
  { valor: 'Responsable', etiqueta: 'Responsable' },
  { valor: 'Solicitante', etiqueta: 'Solicitante' }
];

const OPCIONES_ESTADO = [
  { valor: 'activos', etiqueta: 'Activos' },
  { valor: 'inactivos', etiqueta: 'Inactivos' }
];

export default function FiltrosUsuarios({
  texto = '',
  rol = '',
  estado = '',
  totalResultados = 0,
  alCambiarTexto,
  alCambiarRol,
  alCambiarEstado,
  alLimpiar
}) {
  const hayFiltrosActivos = Boolean(texto.trim() || rol || estado);
  const etiquetaConteo = totalResultados === 1 ? '1 usuario encontrado' : `${totalResultados} usuarios encontrados`;

  return (
    <section aria-label="Filtros de catálogo de usuarios" className="p-2 sm:p-2.5 rounded-tarjeta border border-borde bg-superficie">
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3">
        <div className="flex-1 min-w-[200px]">
          <TextInput
            id="campo-filtro-texto-usuarios"
            nombre="filtro-texto-usuarios"
            etiqueta=""
            aria-label="Buscar"
            obligatorio={false}
            tipo="search"
            tamano="sm"
            valor={texto}
            alCambiar={(e) => alCambiarTexto?.(e.target.value)}
            placeholder="Nombre o correo"
          />
        </div>
        <div className="w-full sm:w-48 shrink-0">
          <SelectInput
            id="filtro-rol-usuarios"
            nombre="filtro-rol-usuarios"
            etiqueta=""
            aria-label="Rol de usuario"
            obligatorio={false}
            tamano="sm"
            valor={rol}
            alCambiar={(e) => alCambiarRol?.(e.target.value)}
            opciones={OPCIONES_ROL}
            placeholder="Todos los roles"
          />
        </div>
        <div className="w-full sm:w-44 shrink-0">
          <SelectInput
            id="filtro-estado-usuarios"
            nombre="filtro-estado-usuarios"
            etiqueta=""
            aria-label="Estado de usuario"
            obligatorio={false}
            tamano="sm"
            valor={estado}
            alCambiar={(e) => alCambiarEstado?.(e.target.value)}
            opciones={OPCIONES_ESTADO}
            placeholder="Todos los estados"
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
