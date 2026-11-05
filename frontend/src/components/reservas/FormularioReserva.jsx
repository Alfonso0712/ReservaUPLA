// RF-03 · RF-04 · RN-01..04 · RV-08..14 · Modal accesible de nueva reserva · E-12..17 · E-22 · E-42
import { useState, useEffect, useId } from 'react';
import { useFormulario } from '../../hooks/useFormulario';
import { useTrampaFoco } from '../../hooks/useTrampaFoco';
import { validarReserva } from '../../validation/validadores';
import { interpretarRespuesta } from '../../validation/interpretarRespuesta';
import { listarAmbientesApi, consultarDisponibilidadApi } from '../../services/ambienteService';
import { crearReservaApi } from '../../services/reservaService';
import { MENSAJES } from '../../constants/mensajes';
import { obtenerFechaHoyIso } from '../../utils/formatearFecha';
import SelectInput from '../formulario/SelectInput';
import DateInput from '../formulario/DateInput';
import TimeInput from '../formulario/TimeInput';
import TextAreaInput from '../formulario/TextAreaInput';
import PanelDisponibilidad from './PanelDisponibilidad';
import Button from '../ui/Button';
import AlertMessage from '../ui/AlertMessage';
import Icono from '../ui/Icono';

export default function FormularioReserva({ abierto, ambientePreseleccionadoId = '', alCerrar, alExito }) {
  const idTitulo = useId();
  const [catalogo, setCatalogo] = useState({ ambientes: [], ocupados: [], cargandoDisponibilidad: false });
  const form = useFormulario({
    valoresIniciales: { ambienteId: ambientePreseleccionadoId || '', fecha: '', horaInicio: '', horaFin: '', motivo: '' },
    validar: (vals) => validarReserva(vals),
    alEnviar: async (vals, { setErrores, setErrorGeneral, enfocarPrimerError }) => {
      const res = interpretarRespuesta(await crearReservaApi(vals));
      if (res.ok) { alExito?.(MENSAJES.RESERVA_CREADA_EXITO, res.datos); return; }
      const errs = res.accion === 'conflicto' && !Object.keys(res.errores).length ? { horaFin: res.errorGeneral || MENSAJES.RESERVA_SOLAPE_HORARIO } : res.errores;
      if (Object.keys(errs).length > 0) { setErrores(errs); enfocarPrimerError(errs); return; }
      setErrorGeneral(res.errorGeneral);
    }
  });
  const modalRef = useTrampaFoco(abierto, () => { if (!form.enProceso) alCerrar?.(); }, 'select, input');
  const ambSeleccionado = catalogo.ambientes.find((a) => a.id === form.valores.ambienteId);
  const esDisponible = ambSeleccionado?.estado === 'Disponible';
  useEffect(() => {
    if (!abierto) return undefined;
    form.setValores({ ambienteId: ambientePreseleccionadoId || '', fecha: '', horaInicio: '', horaFin: '', motivo: '' });
    form.setErrores({}); form.setErrorGeneral('');
    const ctrl = new AbortController();
    listarAmbientesApi(ctrl.signal).then((rA) => {
      if (!ctrl.signal.aborted) { const iA = interpretarRespuesta(rA); setCatalogo((p) => ({ ...p, ambientes: iA.ok && Array.isArray(iA.datos) ? iA.datos : [] })); }
    });
    return () => ctrl.abort();
  }, [abierto, ambientePreseleccionadoId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!abierto || !form.valores.ambienteId || !form.valores.fecha || !esDisponible) { setCatalogo((p) => ({ ...p, ocupados: [] })); return undefined; }
    const ctrl = new AbortController();
    setCatalogo((p) => ({ ...p, cargandoDisponibilidad: true }));
    consultarDisponibilidadApi(form.valores.ambienteId, form.valores.fecha, ctrl.signal).then((r) => {
      if (!ctrl.signal.aborted) { const i = interpretarRespuesta(r); setCatalogo((p) => ({ ...p, ocupados: i.ok && Array.isArray(i.datos?.ocupados) ? i.datos.ocupados : [], cargandoDisponibilidad: false })); }
    });
    return () => ctrl.abort();
  }, [abierto, form.valores.ambienteId, form.valores.fecha, esDisponible]);
  if (!abierto) return null;
  const opcionesAmb = catalogo.ambientes.map((a) => ({
    valor: a.id, etiqueta: `${a.nombre}${a.estado === 'Disponible' ? ` (${a.capacidad} personas)` : ` (en ${a.estado.toLowerCase()})`}`,
    deshabilitada: a.estado !== 'Disponible'
  }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fondo-modal">
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby={idTitulo} className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-tarjeta border border-borde bg-superficie text-texto">
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-borde"><h2 id={idTitulo} className="text-xl font-semibold text-texto">Nueva reserva</h2><button type="button" onClick={alCerrar} disabled={form.enProceso} aria-label="Cerrar ventana de nueva reserva" className="h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] p-2 inline-flex items-center justify-center rounded-full text-texto-suave hover:bg-superficie-2"><Icono nombre="X" className="w-5 h-5" /></button></div>
        <div role="status" aria-live="polite" className="sr-only">{form.resumenEstado}</div>
        {form.errorGeneral && <div className="mb-4"><AlertMessage variante="error" rol="alert" mensaje={form.errorGeneral} enfocarAlAparecer /></div>}
        <form onSubmit={form.manejarEnvio} noValidate className="space-y-4">
          <SelectInput ref={form.registrarRef('ambienteId')} nombre="ambienteId" etiqueta="Ambiente" obligatorio valor={form.valores.ambienteId} alCambiar={(e) => form.cambiarValor('ambienteId', e.target.value)} alSalir={() => form.manejarBlur('ambienteId')} opciones={opcionesAmb} placeholder="Seleccione un ambiente" ayuda={MENSAJES.AYUDA_AMBIENTE} error={form.errores.ambienteId} soloLectura={form.enProceso} />
          <DateInput ref={form.registrarRef('fecha')} nombre="fecha" etiqueta="Fecha" obligatorio min={obtenerFechaHoyIso()} valor={form.valores.fecha} alCambiar={(e) => form.cambiarValor('fecha', e.target.value)} alSalir={() => form.manejarBlur('fecha')} ayuda={MENSAJES.AYUDA_FECHA} error={form.errores.fecha} soloLectura={form.enProceso} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><TimeInput ref={form.registrarRef('horaInicio')} nombre="horaInicio" etiqueta="Hora de inicio" obligatorio valor={form.valores.horaInicio} alCambiar={(e) => form.cambiarValor('horaInicio', e.target.value)} alSalir={() => form.manejarBlur('horaInicio')} ayuda={MENSAJES.AYUDA_HORARIO} error={form.errores.horaInicio} soloLectura={form.enProceso} /><TimeInput ref={form.registrarRef('horaFin')} nombre="horaFin" etiqueta="Hora de fin" obligatorio valor={form.valores.horaFin} alCambiar={(e) => form.cambiarValor('horaFin', e.target.value)} alSalir={() => form.manejarBlur('horaFin')} ayuda={MENSAJES.AYUDA_HORARIO} error={form.errores.horaFin} soloLectura={form.enProceso} /></div>
          <PanelDisponibilidad ambienteSeleccionado={Boolean(form.valores.ambienteId)} fechaSeleccionada={Boolean(form.valores.fecha)} cargando={catalogo.cargandoDisponibilidad} ocupados={catalogo.ocupados} horaInicio={form.valores.horaInicio} horaFin={form.valores.horaFin} />
          <TextAreaInput ref={form.registrarRef('motivo')} nombre="motivo" etiqueta="Motivo" obligatorio filas={3} valor={form.valores.motivo} alCambiar={(e) => form.cambiarValor('motivo', e.target.value)} alSalir={() => form.manejarBlur('motivo')} ayuda={MENSAJES.AYUDA_MOTIVO} error={form.errores.motivo} placeholder="Describa la actividad académica a realizar" soloLectura={form.enProceso} />
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-borde"><Button variante="secundario" disabled={form.enProceso} onClick={alCerrar}>Cancelar</Button><Button tipo="submit" variante="primario" enProceso={form.enProceso}>Registrar solicitud</Button></div>
        </form>
      </div>
    </div>
  );
}
