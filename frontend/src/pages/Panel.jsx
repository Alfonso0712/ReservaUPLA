// RF-08 · Panel con indicadores desde constants/indicadores.js · E-30 · E-51 · E-53
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import { usePermisos } from '../hooks/usePermisos';
import { useDashboard } from '../hooks/useDashboard';
import { PERMISOS } from '../constants/permisos';
import { RUTAS } from '../constants/rutas';
import { construirIndicadores } from '../constants/indicadores';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import CardIndicador from '../components/ui/CardIndicador';
import AlertMessage from '../components/ui/AlertMessage';
import Cargando from '../components/ui/Cargando';
import EstadoVacio from '../components/ui/EstadoVacio';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';

export default function Panel() {
  const { puede } = usePermisos();
  const ctx = useOutletContext() || {};
  const ubicacion = useLocation();
  const { indicadores, cargando, error } = useDashboard(ctx.versionDatos || 0);
  const puedeReservar = puede(PERMISOS.RESERVAS_CREAR);
  const puedeAprobar = puede(PERMISOS.RESERVAS_APROBAR);
  const pendientes = indicadores?.pendientes ?? 0;
  const alertaRuta = ubicacion.state?.alertaSinPermiso;

  const accionNuevaReserva = puedeReservar ? (
    <Button variante="primario" onClick={() => ctx.abrirModalReserva?.('')}>
      <Icono nombre="CalendarPlus" className="w-5 h-5" />
      <span>Nueva reserva</span>
    </Button>
  ) : null;

  const listaTarjetas = indicadores ? construirIndicadores(indicadores, puede) : [];

  return (
    <div className="space-y-6">
      <EncabezadoPagina
        titulo="Panel"
        descripcion="Resumen general del estado de las reservas y uso de ambientes académicos."
        accionPrimaria={accionNuevaReserva}
      />
      {alertaRuta && <AlertMessage variante="error" rol="alert" mensaje={alertaRuta} enfocarAlAparecer />}
      {ctx.mensajeGlobal && <AlertMessage variante="exito" rol="status" mensaje={ctx.mensajeGlobal} enfocarAlAparecer alCerrar={ctx.limpiarMensajeGlobal} />}
      {error && <AlertMessage variante="error" rol="alert" mensaje={error} enfocarAlAparecer />}
      {cargando && <Cargando />}

      {!cargando && indicadores && (
        <>
          {puedeAprobar && pendientes > 0 && (
            <AlertMessage
              variante="advertencia"
              rol="status"
              mensaje={`Hay ${pendientes} ${pendientes === 1 ? 'reserva pendiente' : 'reservas pendientes'} de aprobación.`}
              accion={<Link to={`${RUTAS.RESERVAS}?estado=Pendiente`} className="font-semibold text-primario-enlace">Revisar pendientes</Link>}
            />
          )}

          <section aria-labelledby="titulo-indicadores-reservas">
            <h2 id="titulo-indicadores-reservas" className="sr-only">Indicadores de reservas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 [grid-auto-rows:1fr]">
              {listaTarjetas.map((item) => (
                <CardIndicador key={item.clave} {...item} />
              ))}
            </div>
          </section>

          {indicadores.total === 0 && (
            <EstadoVacio
              titulo="No hay reservas registradas todavía"
              descripcion="Registre la primera solicitud de reserva para visualizar la actividad académica."
              accion={accionNuevaReserva}
            />
          )}
        </>
      )}
    </div>
  );
}
