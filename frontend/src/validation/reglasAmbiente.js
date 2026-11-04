// RF-02 · RV-04..07 · RV-17..18 · E-10 · E-11 · E-39..40
import {
  MIN_LONGITUD_NOMBRE_AMBIENTE, MAX_LONGITUD_NOMBRE_AMBIENTE,
  MIN_CAPACIDAD_AMBIENTE, MAX_CAPACIDAD_AMBIENTE,
  MIN_LONGITUD_UBICACION, MAX_LONGITUD_UBICACION
} from '../constants/reglas';
import { LISTA_TIPOS_AMBIENTE } from '../constants/tiposAmbiente';
import { LISTA_ESTADOS_AMBIENTE } from '../constants/estados';
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

export function validarNombreAmbienteUnico(nombre, idActual = '', listaAmbientes = []) {
  const limpio = normalizarTexto(nombre).toLowerCase();
  if (!limpio) return '';
  const existe = listaAmbientes.some((a) => a.id !== idActual && normalizarTexto(a.nombre).toLowerCase() === limpio);
  return existe ? MENSAJES.AMBIENTE_NOMBRE_DUPLICADO : '';
}

export function validarTipoAmbiente(tipo) {
  const limpio = normalizarTexto(tipo);
  return !limpio || !LISTA_TIPOS_AMBIENTE.includes(limpio) ? MENSAJES.AMBIENTE_TIPO_OBLIGATORIO : '';
}

export function validarCapacidadAmbiente(capacidad) {
  if (capacidad === '' || capacidad === null || capacidad === undefined) return MENSAJES.AMBIENTE_CAPACIDAD_OBLIGATORIA;
  const texto = String(capacidad).trim();
  if (!/^-?\d+$/.test(texto)) return MENSAJES.AMBIENTE_CAPACIDAD_INVALIDA;
  const numero = Number(texto);
  return (!Number.isInteger(numero) || numero < MIN_CAPACIDAD_AMBIENTE || numero > MAX_CAPACIDAD_AMBIENTE) ? MENSAJES.AMBIENTE_CAPACIDAD_INVALIDA : '';
}

export function validarUbicacionAmbiente(ubicacion) {
  const limpio = normalizarTexto(ubicacion);
  if (!limpio) return MENSAJES.AMBIENTE_UBICACION_OBLIGATORIA;
  return (limpio.length < MIN_LONGITUD_UBICACION || limpio.length > MAX_LONGITUD_UBICACION) ? MENSAJES.AMBIENTE_UBICACION_LONGITUD : '';
}

export function validarEstadoAmbiente(estado) {
  const limpio = normalizarTexto(estado);
  return (!limpio || !LISTA_ESTADOS_AMBIENTE.includes(limpio)) ? MENSAJES.AMBIENTE_ESTADO_INVALIDO : '';
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
