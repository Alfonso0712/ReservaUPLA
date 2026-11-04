// Definición declarativa de rutas · /ingresar · /registro · /panel · /reservas · /reservas/:id · /ambientes · * · E-25
import { Routes, Route, Navigate } from 'react-router-dom';
import { RUTAS } from '../constants/rutas';
import RutaProtegida from './RutaProtegida';
import LayoutAutenticacion from '../layouts/LayoutAutenticacion';
import LayoutPrincipal from '../layouts/LayoutPrincipal';
import Ingresar from '../pages/Ingresar';
import RegistroSolicitante from '../pages/RegistroSolicitante';
import Panel from '../pages/Panel';
import ListadoReservas from '../pages/ListadoReservas';
import DetalleReserva from '../pages/DetalleReserva';
import Ambientes from '../pages/Ambientes';
import NoEncontrada from '../pages/NoEncontrada';

export default function RutasApp({ renderModalReserva = null }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={RUTAS.INGRESAR} replace />} />
      <Route element={<LayoutAutenticacion />}>
        <Route path={RUTAS.INGRESAR} element={<Ingresar />} />
        <Route path={RUTAS.REGISTRO} element={<RegistroSolicitante />} />
      </Route>
      <Route element={<RutaProtegida />}>
        <Route element={<LayoutPrincipal renderModalReserva={renderModalReserva} />}>
          <Route path={RUTAS.PANEL} element={<Panel />} />
          <Route path={RUTAS.RESERVAS} element={<ListadoReservas />} />
          <Route path={RUTAS.DETALLE_RESERVA} element={<DetalleReserva />} />
          <Route path={RUTAS.AMBIENTES} element={<Ambientes />} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Route>
    </Routes>
  );
}
