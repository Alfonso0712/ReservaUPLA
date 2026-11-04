// RN-05 · Ruta protegida por sesión activa y por rol permitido · E-18
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RUTAS } from '../constants/rutas';
import { MENSAJES } from '../constants/mensajes';
import Cargando from '../components/ui/Cargando';
import AlertMessage from '../components/ui/AlertMessage';

export default function RutaProtegida({ rolesPermitidos = [], children }) {
  const { usuario, autenticado, cargandoSesion } = useAuth();

  if (cargandoSesion) {
    return <Cargando />;
  }

  if (!autenticado || !usuario) {
    return <Navigate to={RUTAS.INGRESAR} replace />;
  }

  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.rol)) {
    return (
      <div className="p-6">
        <AlertMessage
          variante="error"
          rol="alert"
          titulo="Acceso no autorizado"
          mensaje={MENSAJES.ACCION_SOLO_ADMINISTRADOR}
        />
      </div>
    );
  }

  return children || <Outlet />;
}
