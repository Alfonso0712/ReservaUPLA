// Nielsen 3 · Nielsen 9 · Vista de ruta no encontrada con acción de retorno · E-25
import { Link } from 'react-router-dom';
import { RUTAS } from '../constants/rutas';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import EstadoVacio from '../components/ui/EstadoVacio';

export default function NoEncontrada() {
  return (
    <div>
      <EncabezadoPagina
        migas={[{ etiqueta: 'Inicio', ruta: RUTAS.PANEL }, { etiqueta: 'Página no encontrada' }]}
        titulo="Página no encontrada"
        descripcion="La dirección solicitada no existe o fue trasladada dentro del sistema."
      />
      <EstadoVacio
        icono="AlertTriangle"
        titulo="No pudimos encontrar esta página"
        descripcion="Verifique la dirección escrita o regrese al panel principal para continuar con su gestión."
        accion={
          <Link
            to={RUTAS.PANEL}
            className="min-h-control px-4 py-2.5 rounded-control bg-primario text-sobre-primario font-semibold inline-flex items-center justify-center no-underline"
          >
            Volver al panel
          </Link>
        }
      />
    </div>
  );
}
