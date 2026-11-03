import { useState } from 'react';

// ISO 9241-11 Eficiencia · Solo recuerda correo en localStorage con try/catch seguro
export function useCorreoRecordado() {
  const [correoRecordado, setCorreoRecordado] = useState(() => {
    try {
      return window.localStorage.getItem('reservaupla_correo_recordado') || '';
    } catch {
      return '';
    }
  });

  const guardarCorreo = (correo) => {
    try {
      if (correo) {
        window.localStorage.setItem('reservaupla_correo_recordado', correo);
      } else {
        window.localStorage.removeItem('reservaupla_correo_recordado');
      }
      setCorreoRecordado(correo || '');
    } catch {
      // Ignorar fallo de almacenamiento
    }
  };

  return { correoRecordado, guardarCorreo };
}
