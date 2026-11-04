// WCAG 2.2 AA 2.4.1 · Enlace para saltar bloques de navegación repetidos · E-25
export default function SaltarAlContenido({ destinoId = 'contenido-principal' }) {
  return (
    <a
      href={`#${destinoId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:min-h-control focus:inline-flex focus:items-center focus:rounded-control focus:bg-primario focus:text-sobre-primario focus:font-semibold"
    >
      Saltar al contenido
    </a>
  );
}
