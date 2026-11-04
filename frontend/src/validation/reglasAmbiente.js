// RF-02 · RV-04 · RV-05 · RV-06 · RV-07 · E-10 · E-11
import {
  MIN_LONGITUD_NOMBRE_AMBIENTE,
  MAX_LONGITUD_NOMBRE_AMBIENTE,
  MIN_CAPACIDAD_AMBIENTE,
  MAX_CAPACIDAD_AMBIENTE,
  MIN_LONGITUD_UBICACION,
  MAX_LONGITUD_UBICACION
} from '../constants/reglas';
import { LISTA_TIPOS_AMBIENTE } from '../constants/tiposAmbiente';
import { MENSAJES } from '../constants/mensajes';
import { normalizarTexto } from '../utils/normalizarTexto';

export function validarNombreAmbiente(nombre) {
  const limpio = normalizarTexto(nombre);
  if (!limpio) return MENSAJES.AMBIENTE_NOMBRE_OBLIGATORIO;
  if (limpio.length < MIN_LONGITUD_NOMBRE_AMBIENTE || limpio.length > MAX_LONGITUD_NOMBRE_AMBIENTE) {
    return MENSAJES.AMBIENTE_NOMBRE_LONGITUD;
  }
  return '';
}

export function validarTipoAmbiente(tipo) {
  const limpio = normalizarTexto(tipo);
  if (!limpio || !LISTA_TIPOS_AMBIENTE.includes(limpio)) {
    return MENSAJES.AMBIENTE_TIPO_OBLIGATORIO;
  }
  return '';
}

export function validarCapacidadAmbiente(capacidad) {
  if (capacidad === '' || capacidad === null || capacidad === undefined) {
    return MENSAJES.AMBIENTE_CAPACIDAD_OBLIGATORIA;
  }
  const texto = String(capacidad).trim();
  if (!/^-?\d+$/.test(texto)) return MENSAJES.AMBIENTE_CAPACIDAD_INVALIDA;
  const numero = Number(texto);
  if (!Number.isInteger(numero) || numero < MIN_CAPACIDAD_AMBIENTE || numero > MAX_CAPACIDAD_AMBIENTE) {
    return MENSAJES.AMBIENTE_CAPACIDAD_INVALIDA;
  }
  return '';
}

export function validarUbicacionAmbiente(ubicacion) {
  const limpio = normalizarTexto(ubicacion);
  if (!limpio) return MENSAJES.AMBIENTE_UBICACION_OBLIGATORIA;
  if (limpio.length < MIN_LONGITUD_UBICACION || limpio.length > MAX_LONGITUD_UBICACION) {
    return MENSAJES.AMBIENTE_UBICACION_LONGITUD;
  }
  return '';
}

export function validarAmbiente({ nombre = '', tipo = '', capacidad = '', ubicacion = '', responsableId = '' } = {}) {
  const errores = {};
  const errorNombre = validarNombreAmbiente(nombre);
  const errorTipo = validarTipoAmbiente(tipo);
  const errorCapacidad = validarCapacidadAmbiente(capacidad);
  const errorUbicacion = validarUbicacionAmbiente(ubicacion);
  if (errorNombre) errores.nombre = errorNombre;
  if (errorTipo) errores.tipo = errorTipo;
  if (errorCapacidad) errores.capacidad = errorCapacidad;
  if (errorUbicacion) errores.ubicacion = errorUbicacion;
  return {
    valido: Object.keys(errores).length === 0,
    errores,
    datosNormalizados: {
      nombre: normalizarTexto(nombre),
      tipo: normalizarTexto(tipo),
      capacidad: Number(String(capacidad).trim()),
      ubicacion: normalizarTexto(ubicacion),
      responsableId: normalizarTexto(responsableId)
    }
  };
}
