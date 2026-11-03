import CardIndicador from '../components/CardIndicador';
import AlertMessage from '../components/AlertMessage';
import { useDashboard } from '../hooks/useDashboard';

// RF-08 · E-30
export default function DashboardPage() {
  const { estadisticas, cargando, error } = useDashboard();

  return (
    <div className="pagina-dashboard">
      <h1 className="pagina-titulo">Panel General de Indicadores</h1>
      <AlertMessage tipo="error" mensaje={error} />
      {cargando && <p role="status">Cargando métricas...</p>}
      {estadisticas && (
        <div className="cuadricula-cards">
          <CardIndicador titulo="Total Reservas" valor={estadisticas.totalReservas} icono="📊" />
          <CardIndicador titulo="Pendientes" valor={estadisticas.reservasPendientes} icono="⏳" tipo="pendiente" />
          <CardIndicador titulo="Aprobadas" valor={estadisticas.reservasAprobadas} icono="✅" tipo="aprobada" />
          <CardIndicador titulo="Rechazadas" valor={estadisticas.reservasRechazadas} icono="❌" tipo="rechazada" />
          <CardIndicador titulo="Canceladas" valor={estadisticas.reservasCanceladas} icono="🚫" tipo="cancelada" />
          <CardIndicador
            titulo="Ambiente Más Solicitado"
            valor={estadisticas.ambienteMasUtilizado}
            descripcion={`${estadisticas.cantidadUsoAmbienteMasUtilizado} reservas registradas`}
            icono="🏛️"
          />
        </div>
      )}
    </div>
  );
}
