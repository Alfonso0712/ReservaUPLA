import { useState, useEffect, useRef } from 'react';
import { reservaService } from '../services/reservaService';
import { ambienteService } from '../services/ambienteService';
import { validarReserva } from '../validation/validarReserva';
import { interpretarRespuesta } from '../utils/interpretarRespuesta';

// RF-03 · RF-04 · RN-01 a RN-04 · Shneiderman 8 · E-12 a E-17 · E-22
export function useReservaForm({ alCrearExitoso, ambienteIdInicial = '' }) {
  const [ambienteId, setAmbienteId] = useState(ambienteIdInicial);
  const [fecha, setFecha] = useState(() => {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 1);
    return hoy.toISOString().split('T')[0];
  });
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFin, setHoraFin] = useState('10:00');
  const [motivo, setMotivo] = useState('');
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [cargandoDisponibilidad, setCargandoDisponibilidad] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);

  const fechaRef = useRef(null);
  const horaInicioRef = useRef(null);
  const motivoRef = useRef(null);

  useEffect(() => {
    if (!ambienteId || !fecha) return;
    let cancelado = false;
    setCargandoDisponibilidad(true);
    ambienteService.consultarDisponibilidad(ambienteId, fecha).then((res) => {
      if (!cancelado && res.ok && res.datos) {
        setDisponibilidad(res.datos.reservas || []);
      }
      if (!cancelado) setCargandoDisponibilidad(false);
    });
    return () => { cancelado = true; };
  }, [ambienteId, fecha]);

  const enviar = async () => {
    if (cargando) return;
    setErrorGeneral('');
    const validacion = validarReserva({ ambienteId, fecha, horaInicio, horaFin, motivo });
    if (!validacion.valido) {
      setErrores(validacion.errores);
      if (validacion.errores.fecha) fechaRef.current?.focus();
      else if (validacion.errores.horas || validacion.errores.horaFin) horaInicioRef.current?.focus();
      else if (validacion.errores.motivo) motivoRef.current?.focus();
      return;
    }
    setErrores({});
    setCargando(true);

    const res = await reservaService.crearReserva({ ambienteId, fecha, horaInicio, horaFin, motivo });
    const inter = interpretarRespuesta(res);
    if (inter.accion === 'exito') {
      alCrearExitoso?.(inter.datos);
    } else {
      setErrorGeneral(inter.errorGeneral);
      if (res.estado === 409) horaInicioRef.current?.focus();
    }
    setCargando(false);
  };

  return {
    ambienteId, setAmbienteId,
    fecha, setFecha,
    horaInicio, setHoraInicio,
    horaFin, setHoraFin,
    motivo, setMotivo,
    disponibilidad, cargandoDisponibilidad,
    errores, errorGeneral, cargando,
    fechaRef, horaInicioRef, motivoRef,
    enviar
  };
}
