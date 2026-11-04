// Nielsen 4 · ISO 9241-110
import imagenFondoLogin from '../assets/login-bg.jpg';

export const RUTA_IMAGEN_FONDO_LOGIN = imagenFondoLogin;

export const RUTAS = {
  INGRESAR: '/ingresar',
  REGISTRO: '/registro',
  PANEL: '/panel',
  RESERVAS: '/reservas',
  DETALLE_RESERVA: '/reservas/:id',
  AMBIENTES: '/ambientes',
  crearDetalleReserva: (id) => `/reservas/${id}`
};
