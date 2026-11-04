// RF-08 · Panel de indicadores con alerta accionable de pendientes y tarjetas accesibles · E-30
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { ROLES } from '../constants/roles';
import { RUTAS } from '../constants/rutas';
import EncabezadoPagina from '../components/navegacion/EncabezadoPagina';
import CardIndicador from '../components/ui/CardIndicador';
import AlertMessage from '../components/ui/AlertMessage';
import Cargando from '../components/ui/Cargando';
import EstadoVacio from '../components/ui/EstadoVacio';
import Button from '../components/ui/Button';
import Icono from '../components/ui/Icono';

export default function Panel() {
  const { usuario } = useAuth();
  const ctx = useOutletContext() || {};
  const { indicadores, cargando, error } = useDashboard(ctx.versionDatos || 0);
  const puedeReservar = usuario?.rol === ROLES.ADMINISTRADOR || usuario?.rol === ROLES.SOLICITANTE;
  const esAdmin = usuario?.rol === ROLES.ADMINISTRADOR;
  const pendientes = indicadores?.pendientes ?? 0;

  const accionNuevaReserva = puedeReservar ? (
    <Button variante="primario" onClick={() => ctx.abrirModalReserva?.('')}>
      <Icono nombre="CalendarPlus" className="w-5 h-5" />
      <span>Nueva reserva</span>
    </Button>
  ) : null;

  return (
    <div className="space-y-6">
      <EncabezadoPagina
        migas={[{ etiqueta: 'Inicio', ruta: RUTAS.PANEL }, { etiqueta: 'Panel' }]}
        titulo="Panel"
        descripcion="Resumen general del estado de las reservas y uso de ambientes académicos."
        accionPrimaria={accionNuevaReserva}
      />

      {ctx.mensajeGlobal && (
        <AlertMessage variante="exito" rol="status" mensaje={ctx.mensajeGlobal} enfocarAlAparecer alCerrar={ctx.limpiarMensajeGlobal} />
      )}
      {error && <AlertMessage variante="error" rol="alert" mensaje={error} enfocarAlAparecer />}
      {cargando && <Cargando />}

      {!cargando && indicadores && (
        <>
          {esAdmin && pendientes > 0 && (
            <AlertMessage
              variante="advertencia"
              rol="status"
              mensaje={`Hay ${pendientes} ${pendientes === 1 ? 'reserva pendiente' : 'reservas pendientes'} de aprobación.`}
              accion={<Link to={`${RUTAS.RESERVAS}?estado=Pendiente`} className="font-semibold text-primario-enlace">Revisar pendientes</Link>}
            />
          )}

          <section aria-label="Indicadores de reservas" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CardIndicador titulo="Total de reservas" valor={indicadores.total} icono="CalendarDays" destino={RUTAS.RESERVAS} textoAccion="Ver todas las reservas" />
            <CardIndicador titulo="Reservas pendientes" valor={indicadores.pendientes} icono="Clock" destino={`${RUTAS.RESERVAS}?estado=Pendiente`} textoAccion="Ver reservas pendientes" />
            <CardIndicador titulo="Reservas aprobadas" valor={indicadores.aprobadas} icono="CircleCheck" destino={`${RUTAS.RESERVAS}?estado=Aprobada`} textoAccion="Ver reservas aprobadas" />
            <CardIndicador titulo="Reservas rechazadas" valor={indicadores.rechazadas} icono="CircleX" destino={`${RUTAS.RESERVAS}?estado=Rechazada`} textoAccion="Ver reservas rechazadas" />
            {/* [JUSTIFICADO: se añade "Canceladas" para que los totales de estados sumen el total general] */}
            <CardIndicador titulo="Reservas canceladas" valor={indicadores.canceladas ?? 0} icono="Ban" destino={`${RUTAS.RESERVAS}?estado=Cancelada`} textoAccion="Ver reservas canceladas" />
            <CardIndicador
              titulo="Ambiente más utilizado"
              valor={indicadores.ambienteMasUtilizado?.nombre || 'Sin registros'}
              subtitulo={`${indicadores.ambienteMasUtilizado?.cantidad ?? 0} reservas registradas`}
              icono="Building2"
              destino={RUTAS.AMBIENTES}
              textoAccion="Consultar ambientes"
            />
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
