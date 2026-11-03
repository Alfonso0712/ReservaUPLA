import {
  MAX_LONGITUD_NOMBRE_AMBIENTE,
  MIN_CAPACIDAD,
  MAX_CAPACIDAD,
  MAX_LONGITUD_UBICACION
} from '../constants/reglas';
import { MENSAJES } from '../constants/mensajes';
import { normalizarTexto } from './normalizar';

const TIPOS_VALIDOS = ['LaboratorioComputo', 'Auditorio', 'SalaReuniones', 'LaboratorioEspecializado'];

// RV-04 a RV-07 · E-10 · E-11
export function validarAmbiente({ nombre, tipo, capacidad, ubicacion }) {
  const errores = {};
  const nombreLimpio = normalizarTexto(nombre);
  const ubicacionLimpia = normalizarTexto(ubicacion);
  const capNumero = Number(capacidad);

  if (!nombreLimpio || nombreLimpio.length > MAX_LONGITUD_NOMBRE_AMBIENTE) {
    errores.nombre = MENSAJES.AMBIENTE_NOMBRE_REQUERIDO;
  }

  if (!tipo || !TIPOS_VALIDOS.includes(tipo)) {
    errores.tipo = MENSAJES.AMBIENTE_TIPO_INVALIDO;
  }

  if (!capacidad || isNaN(capNumero) || !Number.isInteger(capNumero) || capNumero < MIN_CAPACIDAD || capNumero > MAX_CAPACIDAD) {
    errores.capacidad = MENSAJES.AMBIENTE_CAPACIDAD_INVALIDA;
  }

  if (!ubicacionLimpia || ubicacionLimpia.length > MAX_LONGITUD_UBICACION) {
    errores.ubicacion = MENSAJES.AMBIENTE_UBICACION_REQUERIDA;
  }

  return { valido: Object.keys(errores).length === 0, errores };
}
