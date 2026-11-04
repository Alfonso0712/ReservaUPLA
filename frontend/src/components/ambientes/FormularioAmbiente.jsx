// RF-02 · RV-04..07 · Modal accesible para registrar nuevo ambiente (solo Administrador) · E-10 · E-11 · E-33
import { useEffect, useId } from 'react';
import { useFormulario } from '../../hooks/useFormulario';
import { useTrampaFoco } from '../../hooks/useTrampaFoco';
import { validarAmbiente } from '../../validation/validadores';
import { LISTA_TIPOS_AMBIENTE } from '../../constants/tiposAmbiente';
import { MENSAJES } from '../../constants/mensajes';
import TextInput from '../formulario/TextInput';
import SelectInput from '../formulario/SelectInput';
import Button from '../ui/Button';
import AlertMessage from '../ui/AlertMessage';
import Icono from '../ui/Icono';

export default function FormularioAmbiente({ abierto, responsables = [], alRegistrar, alCerrar, alExito }) {
  const idTitulo = useId();
  const form = useFormulario({
    valoresIniciales: { nombre: '', tipo: '', capacidad: '', ubicacion: '', responsableId: '' },
    validar: validarAmbiente,
    alEnviar: async (vals, { setErrores, setErrorGeneral, enfocarPrimerError }) => {
      const { datosNormalizados } = validarAmbiente(vals);
      const res = await alRegistrar(datosNormalizados);
      if (res.ok) { alExito?.(MENSAJES.AMBIENTE_CREADO_EXITO, res.datos); return; }
      if (Object.keys(res.errores || {}).length > 0) { setErrores(res.errores); enfocarPrimerError(res.errores); return; }
      setErrorGeneral(res.errorGeneral);
    }
  });

  const modalRef = useTrampaFoco(abierto, () => { if (!form.enProceso) alCerrar?.(); }, 'input, select');

  useEffect(() => {
    if (!abierto) return;
    form.setValores({ nombre: '', tipo: '', capacidad: '', ubicacion: '', responsableId: '' });
    form.setErrores({});
    form.setErrorGeneral('');
  }, [abierto]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!abierto) return null;
  const opcionesResp = responsables.map((r) => ({ valor: r.id, etiqueta: `${r.nombreCompleto} (${r.correo})` }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fondo-modal">
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby={idTitulo} className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-tarjeta border border-borde bg-superficie text-texto">
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-borde">
          <h2 id={idTitulo} className="text-xl font-semibold text-texto">Nuevo ambiente</h2>
          <button type="button" onClick={alCerrar} disabled={form.enProceso} aria-label="Cerrar ventana de nuevo ambiente" className="min-h-control min-w-control p-2 inline-flex items-center justify-center rounded-control text-texto-suave hover:bg-superficie-2"><Icono nombre="X" className="w-5 h-5" /></button>
        </div>
        <div role="status" aria-live="polite" className="sr-only">{form.resumenEstado}</div>
        {form.errorGeneral && <div className="mb-4"><AlertMessage variante="error" rol="alert" mensaje={form.errorGeneral} enfocarAlAparecer /></div>}
        <form onSubmit={form.manejarEnvio} noValidate className="space-y-4">
          <TextInput ref={form.registrarRef('nombre')} nombre="nombre" etiqueta="Nombre" obligatorio valor={form.valores.nombre} alCambiar={(e) => form.cambiarValor('nombre', e.target.value)} alSalir={() => form.manejarBlur('nombre')} ayuda={MENSAJES.AYUDA_NOMBRE_AMBIENTE} error={form.errores.nombre} placeholder="Laboratorio de Cómputo 102" soloLectura={form.enProceso} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput ref={form.registrarRef('tipo')} nombre="tipo" etiqueta="Tipo" obligatorio valor={form.valores.tipo} alCambiar={(e) => form.cambiarValor('tipo', e.target.value)} alSalir={() => form.manejarBlur('tipo')} opciones={LISTA_TIPOS_AMBIENTE} placeholder="Seleccione un tipo" ayuda={MENSAJES.AYUDA_TIPO_AMBIENTE} error={form.errores.tipo} soloLectura={form.enProceso} />
            <TextInput ref={form.registrarRef('capacidad')} nombre="capacidad" etiqueta="Capacidad" obligatorio inputMode="numeric" valor={form.valores.capacidad} alCambiar={(e) => form.cambiarValor('capacidad', e.target.value)} alSalir={() => form.manejarBlur('capacidad')} ayuda={MENSAJES.AYUDA_CAPACIDAD_AMBIENTE} error={form.errores.capacidad} placeholder="40" soloLectura={form.enProceso} />
          </div>
          <TextInput ref={form.registrarRef('ubicacion')} nombre="ubicacion" etiqueta="Ubicación" obligatorio valor={form.valores.ubicacion} alCambiar={(e) => form.cambiarValor('ubicacion', e.target.value)} alSalir={() => form.manejarBlur('ubicacion')} ayuda={MENSAJES.AYUDA_UBICACION_AMBIENTE} error={form.errores.ubicacion} placeholder="Pabellón B, 3er piso" soloLectura={form.enProceso} />
          <SelectInput ref={form.registrarRef('responsableId')} nombre="responsableId" etiqueta="Responsable" obligatorio={false} valor={form.valores.responsableId} alCambiar={(e) => form.cambiarValor('responsableId', e.target.value)} opciones={opcionesResp} placeholder="Sin asignar (opcional)" ayuda={MENSAJES.AYUDA_RESPONSABLE_AMBIENTE} soloLectura={form.enProceso} />
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-borde">
            <Button variante="secundario" disabled={form.enProceso} onClick={alCerrar}>Cancelar</Button>
            <Button tipo="submit" variante="primario" enProceso={form.enProceso}>Registrar ambiente</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
