// Composición raíz de la aplicación (< 20 líneas)
import { BrowserRouter, useInRouterContext } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import RutasApp from './routes/rutas';

function ContenidoApp() {
  return (
    <AuthProvider>
      <RutasApp />
    </AuthProvider>
  );
}

export default function App() {
  const enRouter = useInRouterContext();
  if (enRouter) return <ContenidoApp />;
  return (
    <BrowserRouter>
      <ContenidoApp />
    </BrowserRouter>
  );
}
