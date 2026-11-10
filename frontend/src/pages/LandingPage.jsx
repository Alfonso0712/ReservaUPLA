// Landing page pública, estática, accesible y modular de ReservaUPLA
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RUTAS } from '../constants/rutas';
import SaltarAlContenido from '../components/navegacion/SaltarAlContenido';
import NavbarLanding from '../components/landing/NavbarLanding';
import HeroLanding from '../components/landing/HeroLanding';
import SeccionQueEs from '../components/landing/SeccionQueEs';
import SeccionComoFunciona from '../components/landing/SeccionComoFunciona';
import SeccionAmbientes from '../components/landing/SeccionAmbientes';
import SeccionReglas from '../components/landing/SeccionReglas';
import FooterLanding from '../components/landing/FooterLanding';

export default function LandingPage() {
  const { autenticado } = useAuth();

  // Si el usuario ya cuenta con sesión activa, preserva el flujo hacia el panel
  if (autenticado) {
    return <Navigate to={RUTAS.PANEL} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-fondo text-texto scroll-smooth">
      <SaltarAlContenido destinoId="contenido-principal" />
      <NavbarLanding />
      <main id="contenido-principal" tabIndex={-1} className="flex-1 outline-none">
        <HeroLanding />
        <SeccionQueEs />
        <SeccionComoFunciona />
        <SeccionAmbientes />
        <SeccionReglas />
      </main>
      <FooterLanding />
    </div>
  );
}
