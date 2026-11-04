// Nielsen 3 · WCAG 2.2 AA · Layout principal con barra lateral fija, cabecera y contenedor semántico · E-25
import { useState, useRef, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SaltarAlContenido from '../components/navegacion/SaltarAlContenido';
import Sidebar from '../components/navegacion/Sidebar';
import Header from '../components/navegacion/Header';
import PageContainer from '../components/navegacion/PageContainer';

export default function LayoutPrincipal({ children, renderModalReserva = null }) {
  const { usuario } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalReserva, setModalReserva] = useState({ abierto: false, ambienteId: '' });
  const [mensajeGlobal, setMensajeGlobal] = useState('');
  const [versionDatos, setVersionDatos] = useState(0);
  const botonMenuRef = useRef(null);

  const abrirModalReserva = useCallback((ambienteId = '') => {
    setModalReserva({ abierto: true, ambienteId: String(ambienteId || '') });
  }, []);

  const cerrarModalReserva = useCallback(() => {
    setModalReserva({ abierto: false, ambienteId: '' });
  }, []);

  const manejarReservaCreada = useCallback((mensaje) => {
    setModalReserva({ abierto: false, ambienteId: '' });
    setMensajeGlobal(mensaje);
    setVersionDatos((v) => v + 1);
  }, []);

  const contextoOutlet = {
    abrirModalReserva,
    mensajeGlobal,
    limpiarMensajeGlobal: () => setMensajeGlobal(''),
    versionDatos,
    recargarDatos: () => setVersionDatos((v) => v + 1)
  };

  return (
    <div className="min-h-screen flex bg-fondo text-texto">
      <SaltarAlContenido />
      <Sidebar
        usuario={usuario}
        abiertoMovil={menuAbierto}
        alCerrarMovil={() => setMenuAbierto(false)}
        alAbrirNuevaReserva={() => abrirModalReserva('')}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          menuAbierto={menuAbierto}
          alAlternarMenu={() => setMenuAbierto((prev) => !prev)}
          botonMenuRef={botonMenuRef}
        />
        <PageContainer>
          {children || <Outlet context={contextoOutlet} />}
        </PageContainer>
      </div>
      {renderModalReserva?.({
        abierto: modalReserva.abierto,
        ambientePreseleccionadoId: modalReserva.ambienteId,
        alCerrar: cerrarModalReserva,
        alExito: manejarReservaCreada
      })}
    </div>
  );
}
