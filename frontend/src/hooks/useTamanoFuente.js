// Shneiderman 2 · WCAG 2.2 AA · E-29
import { useState, useEffect, useCallback } from 'react';

const CLAVE_FUENTE = 'reservaupla_tamano_fuente';

export const ESCALAS_FUENTE = [
  { id: 'normal', etiqueta: 'A−', porcentaje: '100%', descripcion: 'Tamaño de fuente estándar (100 %)' },
  { id: 'grande', etiqueta: 'A', porcentaje: '112.5%', descripcion: 'Tamaño de fuente mediano (112.5 %)' },
  { id: 'extra', etiqueta: 'A+', porcentaje: '125%', descripcion: 'Tamaño de fuente grande (125 %)' }
];

function leerEscalaInicial() {
  try {
    const guardada = localStorage.getItem(CLAVE_FUENTE);
    if (ESCALAS_FUENTE.some((item) => item.porcentaje === guardada)) return guardada;
  } catch {
    // Almacenamiento bloqueado
  }
  return '100%';
}

export function useTamanoFuente() {
  const [tamanoFuente, setTamanoFuente] = useState(leerEscalaInicial);

  useEffect(() => {
    document.documentElement.style.fontSize = tamanoFuente;
    try {
      localStorage.setItem(CLAVE_FUENTE, tamanoFuente);
    } catch {
      // Almacenamiento bloqueado
    }
  }, [tamanoFuente]);

  const cambiarTamanoFuente = useCallback((nuevoPorcentaje) => {
    if (ESCALAS_FUENTE.some((item) => item.porcentaje === nuevoPorcentaje)) {
      setTamanoFuente(nuevoPorcentaje);
    }
  }, []);

  return { tamanoFuente, cambiarTamanoFuente, escalas: ESCALAS_FUENTE };
}
