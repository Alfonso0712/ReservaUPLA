// Definición declarativa de rutas protegidas por permisos · E-25 · E-45 · E-48
import { Routes, Route, Navigate } from 'react-router-dom';
import { RUTAS } from '../constants/rutas';
import { PERMISOS } from '../constants/permisos';
import RutaProtegida from './RutaProtegida';
import LayoutAutenticacion from '../layouts/LayoutAutenticacion';
import LayoutPrincipal from '../layouts/LayoutPrincipal';
import FormularioReserva from '../components/reservas/FormularioReserva';
import Ingresar from '../pages/Ingresar';
import RegistroSolicitante from '../pages/RegistroSolicitante';
import Panel from '../pages/Panel';
import ListadoReservas from '../pages/ListadoReservas';
import DetalleReserva from '../pages/DetalleReserva';
import Ambientes from '../pages/Ambientes';
import Usuarios from '../pages/Usuarios';
import NoEncontrada from '../pages/NoEncontrada';

export default function RutasApp() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={RUTAS.INGRESAR} replace />} />
      <Route element={<LayoutAutenticacion />}>
        <Route path={RUTAS.INGRESAR} element={<Ingresar />} />
        <Route path={RUTAS.REGISTRO} element={<RegistroSolicitante />} />
      </Route>
      <Route element={<RutaProtegida />}>
        <Route element={<LayoutPrincipal renderModalReserva={(props) => <FormularioReserva {...props} />} />}>
          <Route path={RUTAS.PANEL} element={<RutaProtegida permiso={PERMISOS.DASHBOARD_VER}><Panel /></RutaProtegida>} />
          <Route path={RUTAS.RESERVAS} element={<RutaProtegida permiso={PERMISOS.RESERVAS_VER}><ListadoReservas /></RutaProtegida>} />
          <Route path={RUTAS.DETALLE_RESERVA} element={<RutaProtegida permiso={PERMISOS.RESERVAS_VER}><DetalleReserva /></RutaProtegida>} />
          <Route path={RUTAS.AMBIENTES} element={<RutaProtegida permiso={PERMISOS.AMBIENTES_VER}><Ambientes /></RutaProtegida>} />
          <Route path={RUTAS.USUARIOS} element={<RutaProtegida permiso={PERMISOS.USUARIOS_LISTAR}><Usuarios /></RutaProtegida>} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Route>
    </Routes>
  );
}
