// WCAG 2.2 AA · Landmarks semánticos main y footer sin scroll horizontal a 320 px · E-25 · E-27
export default function PageContainer({ children }) {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-fondo text-texto">
      <main
        id="contenido-principal"
        tabIndex={-1}
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 outline-none"
      >
        {children}
      </main>
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-4 border-t border-borde bg-superficie text-sm text-texto-suave">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Universidad Peruana Los Andes © 2026</span>
          <span>Gestión de ambientes universitarios · Huancayo</span>
        </div>
      </footer>
    </div>
  );
}
