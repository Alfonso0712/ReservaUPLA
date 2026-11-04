// Composición raíz de la aplicación (< 20 líneas)
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import RutasApp from './routes/rutas';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RutasApp />
      </AuthProvider>
    </BrowserRouter>
  );
}
