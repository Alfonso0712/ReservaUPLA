// Nielsen 4 · Shneiderman 1 · E-29
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        fondo: 'var(--fondo)',
        superficie: 'var(--superficie)',
        'superficie-2': 'var(--superficie-2)',
        borde: 'var(--borde)',
        'borde-control': 'var(--borde-control)',
        texto: 'var(--texto)',
        'texto-suave': 'var(--texto-suave)',
        primario: 'var(--primario)',
        'primario-hover': 'var(--primario-hover)',
        'primario-enlace': 'var(--primario-enlace)',
        'primario-suave': 'var(--primario-suave)',
        'sobre-primario': 'var(--sobre-primario)',
        'lateral-fondo': 'var(--lateral-fondo)',
        'lateral-texto': 'var(--lateral-texto)',
        'lateral-activo-fondo': 'var(--lateral-activo-fondo)',
        'acento-sobre-oscuro': 'var(--acento-sobre-oscuro)',
        'anillo-foco': 'var(--anillo-foco)',
        'pendiente-texto': 'var(--pendiente-texto)',
        'pendiente-fondo': 'var(--pendiente-fondo)',
        'aprobada-texto': 'var(--aprobada-texto)',
        'aprobada-fondo': 'var(--aprobada-fondo)',
        'rechazada-texto': 'var(--rechazada-texto)',
        'rechazada-fondo': 'var(--rechazada-fondo)',
        'cancelada-texto': 'var(--cancelada-texto)',
        'cancelada-fondo': 'var(--cancelada-fondo)'
      },
      fontFamily: {
        sans: ['"Montserrat Variable"', '"Segoe UI"', 'system-ui', 'Arial', 'sans-serif']
      },
      borderRadius: {
        control: 'var(--radio-control)',
        tarjeta: 'var(--radio-tarjeta)'
      }
    }
  },
  plugins: []
};
