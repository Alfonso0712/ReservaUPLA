// Nielsen 5 · Nielsen 9 · Shneiderman 6 · Estado de formulario y bloqueo de doble envío · E-22 · E-25
import { useState, useRef, useCallback } from 'react';
import { MENSAJES } from '../constants/mensajes';

export function useFormulario({ valoresIniciales, validar, alEnviar }) {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const [enProceso, setEnProceso] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [resumenEstado, setResumenEstado] = useState('');
  const enProcesoRef = useRef(false);
  const camposRef = useRef({});

  const registrarRef = useCallback((nombre) => (el) => { if (el) camposRef.current[nombre] = el; }, []);
  const enfocarPrimerError = useCallback((mapa) => {
    const k = Object.keys(mapa).find((c) => Boolean(mapa[c]));
    if (k && camposRef.current[k]?.focus) camposRef.current[k].focus();
  }, []);

  const cambiarValor = useCallback((nombre, valor) => {
    if (enProcesoRef.current) return;
    setValores((prev) => ({ ...prev, [nombre]: valor }));
    setErrores((prev) => (prev[nombre] ? { ...prev, [nombre]: '' } : prev));
    setErrorGeneral(''); setResumenEstado('');
  }, []);

  const cambiarValores = useCallback((nuevos) => {
    if (enProcesoRef.current) return;
    setValores((prev) => ({ ...prev, ...nuevos }));
    setErrores((prev) => {
      const copia = { ...prev };
      Object.keys(nuevos).forEach((k) => delete copia[k]);
      return copia;
    });
    setErrorGeneral(''); setResumenEstado('');
  }, []);

  const manejarBlur = useCallback((nombre) => {
    if (enProcesoRef.current) return;
    setTocados((prev) => ({ ...prev, [nombre]: true }));
    if (typeof validar === 'function') {
      const res = validar(valores);
      setErrores((prev) => ({ ...prev, [nombre]: res.errores?.[nombre] || '' }));
    }
  }, [validar, valores]);

  const manejarEnvio = useCallback(async (e) => {
    e?.preventDefault();
    if (enProcesoRef.current) return;
    if (typeof validar === 'function') {
      const v = validar(valores);
      if (!v.valido) {
        setErrores(v.errores); setResumenEstado(MENSAJES.RESUMEN_ERRORES_FORMULARIO);
        enfocarPrimerError(v.errores); return;
      }
    }
    enProcesoRef.current = true; setEnProceso(true); setErrorGeneral(''); setResumenEstado('');
    try {
      await alEnviar?.(valores, { setErrores, setErrorGeneral, setValores, enfocarPrimerError, camposRef });
    } finally {
      enProcesoRef.current = false; try { setEnProceso(false); } catch {}
    }
  }, [validar, valores, alEnviar, enfocarPrimerError]);

  return {
    valores, setValores, errores, setErrores, tocados, enProceso, errorGeneral,
    setErrorGeneral, resumenEstado, cambiarValor, cambiarValores, manejarBlur,
    manejarEnvio, registrarRef, camposRef
  };
}
