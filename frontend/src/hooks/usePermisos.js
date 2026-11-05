// Hook para consulta de permisos · E-45..49
import { useContext } from 'react';
import { ContextoAuth } from './useAuth';

export function usePermisos() {
  const contexto = useContext(ContextoAuth);
  if (!contexto) return { puede: () => true, permisos: [] };
  return { puede: contexto.puede, permisos: contexto.permisos || [] };
}
