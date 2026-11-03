import { useState, useRef } from 'react';
import { authService } from '../services/authService';
import { interpretarRespuesta } from '../utils/interpretarRespuesta';
import { useCorreoRecordado } from './useCorreoRecordado';
import { useBloqMayus } from './useBloqMayus';

// ISO 9241-11 · Nielsen 5 · E-07 · E-08 · E-22
export function useLogin({ alIniciarExitoso }) {
  const { correoRecordado, guardarCorreo } = useCorreoRecordado();
  const { bloqMayusActivo, verificarBloqMayus } = useBloqMayus();

  const [correo, setCorreo] = useState(correoRecordado);
  const [contrasena, setContrasena] = useState('');
  const [recordar, setRecordar] = useState(Boolean(correoRecordado));
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const correoRef = useRef(null);
  const contrasenaRef = useRef(null);

  const iniciarSesion = async () => {
    if (cargando) return;
    setCargando(true);
    setError('');

    const res = await authService.login(correo, contrasena);
    const interpretacion = interpretarRespuesta(res);

    if (interpretacion.accion === 'exito') {
      if (recordar) guardarCorreo(correo);
      else guardarCorreo('');
      alIniciarExitoso?.(interpretacion.datos);
    } else {
      setError(interpretacion.errorGeneral);
      if (res.estado === 401) {
        contrasenaRef.current?.focus();
        contrasenaRef.current?.select?.();
      }
    }
    setCargando(false);
  };

  return {
    correo, setCorreo,
    contrasena, setContrasena,
    recordar, setRecordar,
    cargando, error, setError,
    bloqMayusActivo, verificarBloqMayus,
    correoRef, contrasenaRef,
    iniciarSesion
  };
}
