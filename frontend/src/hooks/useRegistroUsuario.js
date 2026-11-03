import { useState, useRef } from 'react';
import { usuarioService } from '../services/usuarioService';
import { validarRegistroUsuario } from '../validation/validarUsuario';
import { interpretarRespuesta } from '../utils/interpretarRespuesta';

// RF-01 · RV-01 a RV-03 · ISO 9241-11 · Nielsen 5 · E-01 a E-06 · E-22
export function useRegistroUsuario({ alRegistrarExitoso }) {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);

  const nombreRef = useRef(null);
  const correoRef = useRef(null);
  const contrasenaRef = useRef(null);

  const enfocarPrimerError = (errs) => {
    if (errs.nombreCompleto) nombreRef.current?.focus();
    else if (errs.correo) correoRef.current?.focus();
    else if (errs.contrasena) contrasenaRef.current?.focus();
  };

  const registrar = async () => {
    if (cargando) return;
    setErrorGeneral('');
    const validacion = validarRegistroUsuario({ nombreCompleto, correo, contrasena });
    if (!validacion.valido) {
      setErrores(validacion.errores);
      enfocarPrimerError(validacion.errores);
      return;
    }
    setErrores({});
    setCargando(true);

    const res = await usuarioService.registrarSolicitante({ nombreCompleto, correo, contrasena });
    const interpretacion = interpretarRespuesta(res);
    if (interpretacion.accion === 'exito') {
      alRegistrarExitoso?.(interpretacion.datos);
    } else {
      setErrorGeneral(interpretacion.errorGeneral);
      if (res.estado === 409) correoRef.current?.focus();
    }
    setCargando(false);
  };

  return {
    nombreCompleto, setNombreCompleto,
    correo, setCorreo,
    contrasena, setContrasena,
    errores, errorGeneral, cargando,
    nombreRef, correoRef, contrasenaRef,
    registrar
  };
}
