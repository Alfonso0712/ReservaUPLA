import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useLogin } from './hooks/useLogin';
import { useTema } from './hooks/useTema';
import Shell from './components/Shell';
import LoginPage from './pages/LoginPage';
import RegistroSolicitantePage from './pages/RegistroSolicitantePage';
import DashboardPage from './pages/DashboardPage';
import ListadoReservasPage from './pages/ListadoReservasPage';
import NuevaReservaPage from './pages/NuevaReservaPage';
import DetalleReservaPage from './pages/DetalleReservaPage';
import AmbientesPage from './pages/AmbientesPage';

export default function App() {
  const { usuario, setUsuario, cargandoAuth, cerrarSesion } = useAuth();
  const { tema, alternarTema } = useTema();
  const [pantallaAuth, setPantallaAuth] = useState('login');
  const [vista, setVista] = useState('dashboard');
  const [reservaSeleccionadaId, setReservaSeleccionadaId] = useState(null);
  const [ambientePreseleccionadoId, setAmbientePreseleccionadoId] = useState('');

  const loginProps = useLogin({
    alIniciarExitoso: (u) => { setUsuario(u); setVista('dashboard'); }
  });

  if (cargandoAuth) {
    return <div className="cargando-pantalla" role="status">Cargando aplicación...</div>;
  }

  if (!usuario) {
    return pantallaAuth === 'login' ? (
      <LoginPage {...loginProps} alEnviar={loginProps.iniciarSesion} alIrARegistro={() => setPantallaAuth('registro')} />
    ) : (
      <RegistroSolicitantePage alRegistrarExitoso={() => setPantallaAuth('login')} alIrALogin={() => setPantallaAuth('login')} />
    );
  }

  return (
    <Shell
      usuario={usuario}
      vistaActiva={vista}
      alCambiarVista={(v) => { setVista(v); setReservaSeleccionadaId(null); }}
      alCerrarSesion={async () => { await cerrarSesion(); setPantallaAuth('login'); }}
      tema={tema}
      alAlternarTema={alternarTema}
    >
      {vista === 'dashboard' && <DashboardPage />}
      {vista === 'reservas' && (
        <ListadoReservasPage alVerDetalle={(id) => { setReservaSeleccionadaId(id); setVista('detalle-reserva'); }} />
      )}
      {vista === 'nueva-reserva' && (
        <NuevaReservaPage ambienteIdInicial={ambientePreseleccionadoId} alCrearExitoso={() => setVista('reservas')} />
      )}
      {vista === 'detalle-reserva' && (
        <DetalleReservaPage id={reservaSeleccionadaId} rol={usuario.rol} usuarioId={usuario.id} alVolver={() => setVista('reservas')} />
      )}
      {vista === 'ambientes' && (
        <AmbientesPage
          esAdmin={usuario.rol === 'Administrador'}
          alSeleccionarParaReservar={(id) => { setAmbientePreseleccionadoId(id); setVista('nueva-reserva'); }}
        />
      )}
    </Shell>
  );
}
