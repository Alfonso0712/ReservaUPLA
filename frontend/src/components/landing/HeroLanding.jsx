// Sección Hero principal de la Landing Page con valor, llamadas a la acción e insignias
import { Link } from 'react-router-dom';
import { RUTAS } from '../../constants/rutas';
import { INSIGNIAS_HERO } from '../../constants/datosLanding';
import Icono from '../ui/Icono';
import heroBg from '../../assets/hero-bg.jpg';

export default function HeroLanding() {
  return (
    <section id="inicio" aria-labelledby="titulo-hero" className="relative isolate py-16 sm:py-24 overflow-hidden scroll-mt-20">
      {/* Fondo con imagen institucional y degradado de contraste */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`
        }}
        aria-hidden="true"
      >
        {/* Capa de contraste que resalta la imagen institucional garantizando legibilidad */}
        <div className="absolute inset-0 bg-[#071c3d]/65 dark:bg-[#071c3d]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071c3d]/40 via-transparent to-fondo" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
        {/* Etiqueta superior */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-semibold text-white mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span>Plataforma Oficial de Ambientes · UPLA</span>
        </div>

        {/* Único h1 de la página */}
        <h1
          id="titulo-hero"
          className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6 drop-shadow-sm"
        >
          Gestión y reserva eficiente de ambientes universitarios
        </h1>

        {/* Frase corta de valor */}
        <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-sm">
          Coordine y asegure el uso de laboratorios, auditorios y salas académicas en la Universidad Peruana Los Andes sin cruces de horario y con validación inmediata de disponibilidad.
        </p>

        {/* Acciones principales */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <Link
            to={RUTAS.INGRESAR}
            className="h-12 inline-flex items-center justify-center px-6 rounded-control bg-primario hover:bg-primario-hover text-white text-base font-semibold shadow-md transition-colors cursor-pointer"
          >
            Iniciar sesión
          </Link>
          <a
            href="#como-funciona"
            className="h-12 inline-flex items-center justify-center gap-2 px-6 rounded-control border border-white/25 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md text-base font-semibold transition-colors cursor-pointer"
          >
            <span>Ver cómo funciona</span>
            <Icono nombre="ChevronDown" className="w-4 h-4 text-blue-200" />
          </a>
          <Link
            to={RUTAS.REGISTRO}
            className="h-12 inline-flex items-center justify-center px-5 rounded-control text-white hover:text-acento-sobre-oscuro text-base font-semibold transition-colors cursor-pointer"
          >
            Crear cuenta de estudiante
          </Link>
        </div>

        {/* Tres insignias breves */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {INSIGNIAS_HERO.map((insignia) => (
            <div
              key={insignia.id}
              className="p-4 rounded-tarjeta border border-white/20 bg-white/15 dark:bg-black/30 backdrop-blur-md shadow-lg flex items-start gap-3 text-white"
            >
              <div className="w-9 h-9 rounded-control bg-white/20 text-white flex items-center justify-center shrink-0">
                <Icono nombre={insignia.icono} className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white leading-snug">
                  {insignia.titulo}
                </h3>
                <p className="text-xs text-blue-100/90 mt-0.5 leading-snug">
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
