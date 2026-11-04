// RF-08 · Vista de panel institucional
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';

export default function Panel() {
  return (
    <div>
      <EncabezadoPagina
        titulo="Panel"
        descripcion="Resumen general del estado de las reservas y uso de ambientes académicos."
      />
    </div>
  );
}
