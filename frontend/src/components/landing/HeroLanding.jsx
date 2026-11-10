// Sección Hero principal de la Landing Page con valor, llamadas a la acción e insignias
import { Link } from 'react-router-dom';
import { RUTAS } from '../../constants/rutas';
import { INSIGNIAS_HERO } from '../../constants/datosLanding';
import Icono from '../ui/Icono';

export default function HeroLanding() {
  return (
    <section id="inicio" aria-labelledby="titulo-hero" className="relative py-16 sm:py-24 overflow-hidden scroll-mt-20">
      {/* Fondo sutil con gradiente institucional */}
      <div
        className="absolute inset-0 -z-10 opacity-30 dark:opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 20%, var(--primario-suave), transparent 70%)'
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Etiqueta superior */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-borde bg-superficie-2 text-xs font-semibold text-texto-suave mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span>Plataforma Oficial de Ambientes · UPLA</span>
        </div>

        {/* Único h1 de la página */}
        <h1
          id="titulo-hero"
          className="text-3xl sm:text-5xl font-extrabold text-texto tracking-tight leading-tight mb-6"
        >
          Gestión y reserva eficiente de ambientes universitarios
        </h1>

        {/* Frase corta de valor */}
        <p className="text-base sm:text-xl text-texto-suave max-w-2xl mx-auto leading-relaxed mb-8">
          Coordine y asegure el uso de laboratorios, auditorios y salas académicas en la Universidad Peruana Los Andes sin cruces de horario y con validación inmediata de disponibilidad.
        </p>

        {/* Acciones principales */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <Link
            to={RUTAS.INGRESAR}
            className="h-12 inline-flex items-center justify-center px-6 rounded-control bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] text-base font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Iniciar sesión
          </Link>
          <a
            href="#como-funciona"
            className="h-12 inline-flex items-center justify-center gap-2 px-6 rounded-control border border-borde bg-superficie text-texto hover:bg-superficie-2 hover:border-borde-control text-base font-semibold transition-colors cursor-pointer"
          >
            <span>Ver cómo funciona</span>
            <Icono nombre="ChevronDown" className="w-4 h-4 text-texto-suave" />
          </a>
          <Link
            to={RUTAS.REGISTRO}
            className="h-12 inline-flex items-center justify-center px-5 rounded-control text-primario-enlace hover:bg-primario-suave/60 text-base font-semibold transition-colors cursor-pointer"
          >
            Crear cuenta de estudiante
          </Link>
        </div>

        {/* Tres insignias breves */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {INSIGNIAS_HERO.map((insignia) => (
            <div
              key={insignia.id}
              className="p-4 rounded-tarjeta border border-borde bg-superficie shadow-sm flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-control bg-primario-suave text-primario dark:text-primario-enlace flex items-center justify-center shrink-0">
                <Icono nombre={insignia.icono} className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-texto leading-snug">
                  {insignia.titulo}
                </h3>
                <p className="text-xs text-texto-suave mt-0.5 leading-snug">
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
