// RF-08 · Panel con indicadores según alcance del servidor y permisos · E-30 · E-48 · E-49
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import { usePermisos } from '../hooks/usePermisos';
import { useDashboard } from '../hooks/useDashboard';
import { PERMISOS } from '../constants/permisos';
import { RUTAS } from '../constants/rutas';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import CardIndicador from '../components/ui/CardIndicador';
import AlertMessage from '../components/ui/AlertMessage';
import Cargando from '../components/ui/Cargando';
import EstadoVacio from '../components/ui/EstadoVacio';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';

function obtenerTextosPorAlcance(alcance) {
  if (alcance === 'propio') return { total: 'Mis solicitudes', verTotal: 'Ver mis reservas' };
  if (alcance === 'asignado') return { total: 'Reservas asignadas', verTotal: 'Ver reservas asignadas' };
  return { total: 'Total de reservas', verTotal: 'Ver todas las reservas' };
}

export default function Panel() {
  const { puede } = usePermisos();
  const ctx = useOutletContext() || {};
  const ubicacion = useLocation();
  const { indicadores, cargando, error } = useDashboard(ctx.versionDatos || 0);
  const puedeReservar = puede(PERMISOS.RESERVAS_CREAR);
  const puedeAprobar = puede(PERMISOS.RESERVAS_APROBAR);
  const pendientes = indicadores?.pendientes ?? 0;
  const textosAlcance = obtenerTextosPorAlcance(indicadores?.alcance);
  const alertaRuta = ubicacion.state?.alertaSinPermiso;

  const accionNuevaReserva = puedeReservar ? (
    <Button variante="primario" onClick={() => ctx.abrirModalReserva?.('')}>
      <Icono nombre="CalendarPlus" className="w-5 h-5" />
      <span>Nueva reserva</span>
    </Button>
  ) : null;

  return (
    <div className="space-y-6">
      <EncabezadoPagina titulo="Panel" descripcion="Resumen general del estado de las reservas y uso de ambientes académicos." accionPrimaria={accionNuevaReserva} />
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

          <section aria-label="Indicadores de reservas" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CardIndicador titulo={textosAlcance.total} valor={indicadores.total} icono="CalendarDays" destino={RUTAS.RESERVAS} textoAccion={textosAlcance.verTotal} />
            <CardIndicador titulo="Reservas pendientes" valor={indicadores.pendientes} icono="Clock" destino={`${RUTAS.RESERVAS}?estado=Pendiente`} textoAccion="Ver reservas pendientes" />
            <CardIndicador titulo="Reservas aprobadas" valor={indicadores.aprobadas} icono="CircleCheck" destino={`${RUTAS.RESERVAS}?estado=Aprobada`} textoAccion="Ver reservas aprobadas" />
            <CardIndicador titulo="Reservas rechazadas" valor={indicadores.rechazadas} icono="CircleX" destino={`${RUTAS.RESERVAS}?estado=Rechazada`} textoAccion="Ver reservas rechazadas" />
            <CardIndicador titulo="Reservas canceladas" valor={indicadores.canceladas ?? 0} icono="Ban" destino={`${RUTAS.RESERVAS}?estado=Cancelada`} textoAccion="Ver reservas canceladas" />
            <CardIndicador titulo="Ambiente más utilizado" valor={indicadores.ambienteMasUtilizado?.nombre || 'Sin registros'} subtitulo={`${indicadores.ambienteMasUtilizado?.cantidad ?? 0} reservas registradas`} icono="Building2" destino={RUTAS.AMBIENTES} textoAccion="Consultar ambientes" />
          </section>

          {indicadores.total === 0 && (
            <EstadoVacio titulo="No hay reservas registradas todavía" descripcion="Registre la primera solicitud de reserva para visualizar la actividad académica." accion={accionNuevaReserva} />
          )}
        </>
      )}
    </div>
  );
}
