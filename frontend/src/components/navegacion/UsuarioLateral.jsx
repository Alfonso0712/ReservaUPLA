// ISO 9241-110 · Perfil de usuario y botón cerrar sesión para barra lateral
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextoAuth } from '../../hooks/useAuth';
import { obtenerIniciales } from '../../utils/obtenerIniciales';
import { RUTAS } from '../../constants/rutas';
import Icono from '../ui/Icono';

export default function UsuarioLateral({ compacto = false, alCerrarMenu, usuario: propUsuario, onCerrarSesion: propLogout }) {
  const auth = useContext(ContextoAuth);
  const navegar = useNavigate();
  const usuario = propUsuario || auth?.usuario;
  const cerrarSesion = propLogout || auth?.cerrarSesion;
  const iniciales = obtenerIniciales(usuario?.nombreCompleto) || 'U';

  const manejarLogout = async () => {
    if (window.__hayCambiosSinGuardar && !window.confirm('Hay cambios sin guardar. ¿Desea salir?')) return;
    alCerrarMenu?.();
    await cerrarSesion?.();
    navegar(RUTAS.INGRESAR, { replace: true });
  };

  if (compacto) {
    return (
      <div className="p-3 border-t border-borde/60 flex flex-col items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-white/15 text-white font-bold text-xs flex items-center justify-center shrink-0" title={`${usuario?.nombreCompleto || 'Usuario'} (${usuario?.rol || 'Administrador'})`}>
          {iniciales}
        </span>
        <button
          type="button" onClick={manejarLogout} aria-label="Cerrar sesión"
          className="group relative h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] p-2 inline-flex items-center justify-center rounded-full text-lateral-texto hover:text-white hover:bg-white/10 transition-colors"
        >
          <Icono nombre="LogOut" className="w-4 h-4" />
          <span role="tooltip" className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded-sm px-2 py-0.5 text-xs bg-lateral-fondo text-white shadow-sm opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
            Cerrar sesión
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-3.5 border-t border-borde/60 bg-lateral-fondo text-lateral-texto space-y-2.5">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-9 h-9 rounded-full bg-white/15 text-white font-bold text-xs flex items-center justify-center shrink-0">
          {iniciales}
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-sm font-semibold text-white truncate">{usuario?.nombreCompleto || 'Usuario'}</p>
          <p className="text-xs text-lateral-texto/80 truncate">{usuario?.rol || 'Administrador'}</p>
        </div>
      </div>
      <button
        type="button" onClick={manejarLogout} aria-label="Cerrar sesión"
        className="w-full h-8 px-2.5 rounded-control inline-flex items-center gap-2 text-xs font-semibold text-lateral-texto hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        <Icono nombre="LogOut" className="w-4 h-4 shrink-0" />
        <span>Cerrar sesión</span>
      </button>
    </div>
  );
}
