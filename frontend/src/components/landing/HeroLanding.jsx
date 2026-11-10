// Sección Hero principal de la Landing Page con valor, llamadas a la acción e insignias
import { Link } from 'react-router-dom';
import { RUTAS } from '../../constants/rutas';
import { INSIGNIAS_HERO } from '../../constants/datosLanding';
import Icono from '../ui/Icono';
import heroBg from '../../assets/hero-bg.jpg';

export default function HeroLanding() {
  return (
    <section id="inicio" aria-labelledby="titulo-hero" className="relative isolate pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden scroll-mt-16">
      {/* Fondo con imagen institucional y degradado refinado */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`
        }}
        aria-hidden="true"
      >
        {/* Tinte azul noche institucional homogéneo que permite apreciar la imagen */}
        <div className="absolute inset-0 bg-[#071c3d]/60 dark:bg-[#071c3d]/75" />
        {/* Suave difuminado únicamente al final absoluto para unir con la siguiente sección */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-fondo to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
        {/* Etiqueta superior */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-semibold text-white mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span>Plataforma Oficial de Ambientes · UPLA</span>
        </div>

        {/* Único h1 de la página */}
        <h1
          id="titulo-hero"
          className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6 drop-shadow-md"
        >
          Gestión y reserva eficiente de ambientes universitarios
        </h1>

        {/* Frase corta de valor */}
        <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-sm font-normal">
          Coordine y asegure el uso de laboratorios, auditorios y salas académicas en la Universidad Peruana Los Andes sin cruces de horario y con validación inmediata de disponibilidad.
        </p>

        {/* Acciones principales con alto contraste y clara jerarquía */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            to={RUTAS.INGRESAR}
            className="h-12 inline-flex items-center justify-center px-7 rounded-control bg-white text-[#071c3d] hover:bg-blue-50 text-base font-bold shadow-lg shadow-black/25 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            Iniciar sesión
          </Link>
          <a
            href="#como-funciona"
            className="h-12 inline-flex items-center justify-center gap-2 px-6 rounded-control border border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md text-base font-semibold shadow-sm transition-all cursor-pointer"
          >
            <span>Ver cómo funciona</span>
            <Icono nombre="ChevronDown" className="w-4 h-4 text-blue-200" />
          </a>
          <Link
            to={RUTAS.REGISTRO}
            className="h-12 inline-flex items-center justify-center px-5 rounded-control text-white hover:text-blue-200 text-base font-semibold underline underline-offset-4 transition-colors cursor-pointer"
          >
            Crear cuenta de estudiante
          </Link>
        </div>

        {/* Tres insignias con tarjetas nítidas sin niebla cortada */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {INSIGNIAS_HERO.map((insignia) => (
            <div
              key={insignia.id}
              className="p-4 rounded-tarjeta border border-white/20 bg-[#071c3d]/70 dark:bg-black/40 backdrop-blur-md shadow-lg flex items-start gap-3.5 text-white transition-transform hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-control bg-white/15 text-white flex items-center justify-center shrink-0 border border-white/10">
                <Icono nombre={insignia.icono} className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white leading-snug">
                  {insignia.titulo}
                </h3>
                <p className="text-xs text-blue-100/90 mt-1 leading-relaxed">
                  {insignia.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
