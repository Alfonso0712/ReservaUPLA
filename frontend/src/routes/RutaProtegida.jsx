// RN-05 · Ruta protegida por sesión y permiso obligatorio · E-18 · E-48
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermisos } from '../hooks/usePermisos';
import { RUTAS } from '../constants/rutas';
import Cargando from '../components/ui/Cargando';

export default function RutaProtegida({ permiso = null, children }) {
  const { usuario, autenticado, cargandoSesion } = useAuth();
  const { puede } = usePermisos();

  if (cargandoSesion) return <Cargando />;
  if (!autenticado || !usuario) return <Navigate to={RUTAS.INGRESAR} replace />;

  if (permiso && typeof puede === 'function' && !puede(permiso)) {
    return (
      <Navigate
        to={RUTAS.PANEL}
        state={{ alertaSinPermiso: 'No tiene permiso para acceder a esa sección.' }}
        replace
      />
    );
  }

  return children || <Outlet />;
}
