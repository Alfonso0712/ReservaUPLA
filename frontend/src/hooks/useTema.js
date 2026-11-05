// Shneiderman 2 · ISO 9241-11 · E-29
import { useContext, useState, useEffect, useCallback } from 'react';
import { ContextoPreferencias } from '../context/PreferenciasContext';

const CLAVE_TEMA = 'reservaupla_tema';

export function useTema() {
  const ctx = useContext(ContextoPreferencias);
  const [temaLocal, setTemaLocal] = useState(() => {
    try { return localStorage.getItem(CLAVE_TEMA) || 'claro'; } catch { return 'claro'; }
  });

  useEffect(() => {
    if (ctx) return;
    document.documentElement.setAttribute('data-tema', temaLocal);
  }, [ctx, temaLocal]);

  const alternarLocal = useCallback(() => {
    setTemaLocal((t) => (t === 'oscuro' ? 'claro' : 'oscuro'));
  }, []);

  if (ctx) {
    return { tema: ctx.tema, setTema: ctx.setTema, alternarTema: ctx.alternarTema };
  }
  return { tema: temaLocal, setTema: setTemaLocal, alternarTema: alternarLocal };
}
