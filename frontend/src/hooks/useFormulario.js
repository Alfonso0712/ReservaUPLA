// Nielsen 5 · Nielsen 9 · Shneiderman 6 · Estado de formulario, reversión de errores y bloqueo de doble envío · E-22 · E-25
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

  const registrarRef = useCallback((nombre) => (elemento) => {
    if (elemento) camposRef.current[nombre] = elemento;
  }, []);

  const enfocarPrimerError = useCallback((mapaErrores) => {
    const primerCampo = Object.keys(mapaErrores).find((clave) => Boolean(mapaErrores[clave]));
    if (primerCampo && camposRef.current[primerCampo]?.focus) {
      camposRef.current[primerCampo].focus();
    }
  }, []);

  const cambiarValor = useCallback((nombre, valor) => {
    if (enProcesoRef.current) return;
    setValores((prev) => ({ ...prev, [nombre]: valor }));
    setErrores((prev) => (prev[nombre] ? { ...prev, [nombre]: '' } : prev));
    setErrorGeneral('');
    setResumenEstado('');
  }, []);

  const manejarBlur = useCallback((nombre) => {
    if (enProcesoRef.current) return;
    setTocados((prev) => ({ ...prev, [nombre]: true }));
    if (typeof validar === 'function') {
      const resultado = validar(valores);
      setErrores((prev) => ({ ...prev, [nombre]: resultado.errores?.[nombre] || '' }));
    }
  }, [validar, valores]);

  const manejarEnvio = useCallback(async (evento) => {
    evento?.preventDefault();
    if (enProcesoRef.current) return;
    if (typeof validar === 'function') {
      const validacion = validar(valores);
      if (!validacion.valido) {
        setErrores(validacion.errores);
        setResumenEstado(MENSAJES.RESUMEN_ERRORES_FORMULARIO);
        enfocarPrimerError(validacion.errores);
        return;
      }
    }
    enProcesoRef.current = true;
    setEnProceso(true);
    setErrorGeneral('');
    setResumenEstado('');
    try {
      await alEnviar?.(valores, { setErrores, setErrorGeneral, setValores, enfocarPrimerError, camposRef });
    } finally {
      enProcesoRef.current = false;
      setEnProceso(false);
    }
  }, [validar, valores, alEnviar, enfocarPrimerError]);

  return {
    valores, setValores, errores, setErrores, tocados, enProceso,
    errorGeneral, setErrorGeneral, resumenEstado, cambiarValor,
    manejarBlur, manejarEnvio, registrarRef, camposRef
  };
}
