// WCAG 2.2 AA · Landmark semántico main sin scroll horizontal a 320 px · E-25 · E-27
export default function PageContainer({ children, ancho = 'completo' }) {
  const claseAncho = ancho === 'estandar'
    ? 'max-w-[80rem] mx-auto'
    : 'w-full max-w-7xl mx-auto';

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-fondo text-texto">
      <main
        id="contenido-principal"
        tabIndex={-1}
        className={`flex-1 flex flex-col w-full ${claseAncho} px-4 sm:px-6 py-3.5 sm:py-4 outline-none`}
      >
        {children}
      </main>
    </div>
  );
}
