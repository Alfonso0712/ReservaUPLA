// RF-02 · RV-17 · Modal accesible para cambiar estado de ambiente · E-41 · E-44
import { useState, useEffect, useId } from 'react';
import { Link } from 'react-router-dom';
import { useTrampaFoco } from '../../hooks/useTrampaFoco';
import { LISTA_ESTADOS_AMBIENTE } from '../../constants/estados';
import { MENSAJES } from '../../constants/mensajes';
import SelectInput from '../formulario/SelectInput';
import EstadoAmbienteBadge from '../ui/EstadoAmbienteBadge';
import Button from '../ui/Button';
import AlertMessage from '../ui/AlertMessage';
import Icono from '../ui/Icono';

export default function ModalCambiarEstadoAmbiente({ abierto, ambiente = null, alCambiarEstado, alCerrar, alExito }) {
  const idTitulo = useId();
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [enProceso, setEnProceso] = useState(false);
  const [error, setError] = useState('');

  const modalRef = useTrampaFoco(abierto, () => { if (!enProceso) alCerrar?.(); }, 'select, button');

  useEffect(() => {
    if (!abierto || !ambiente) return;
    const primerOtro = LISTA_ESTADOS_AMBIENTE.find((e) => e !== ambiente.estado) || '';
    setNuevoEstado(primerOtro);
    setError('');
  }, [abierto, ambiente]);

  if (!abierto || !ambiente) return null;
  const cantFuturas = ambiente.reservasFuturasActivas || 0;
  const opciones = LISTA_ESTADOS_AMBIENTE.map((e) => ({ valor: e, etiqueta: e }));

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!nuevoEstado || nuevoEstado === ambiente.estado || enProceso) return;
    setEnProceso(true);
    setError('');
    const res = await alCambiarEstado(ambiente.id, nuevoEstado);
    setEnProceso(false);
    if (res?.ok) { alExito?.(MENSAJES.AMBIENTE_ESTADO_ACTUALIZADO_EXITO, res.datos); return; }
    setError(res?.errorGeneral || 'No se pudo cambiar el estado.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fondo-modal">
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby={idTitulo} className="w-full max-w-lg p-6 rounded-tarjeta border border-borde bg-superficie text-texto">
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-borde">
          <h2 id={idTitulo} className="text-xl font-semibold text-texto">Cambiar estado del ambiente</h2>
          <button type="button" onClick={alCerrar} disabled={enProceso} aria-label="Cerrar ventana de cambiar estado" className="min-h-control min-w-control p-2 inline-flex items-center justify-center rounded-control text-texto-suave hover:bg-superficie-2"><Icono nombre="X" className="w-5 h-5" /></button>
        </div>
        {error && <div className="mb-4"><AlertMessage variante="error" rol="alert" mensaje={error} enfocarAlAparecer /></div>}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 mb-4 rounded-control border border-borde bg-superficie-2 text-sm">
          <div><dt className="font-semibold text-texto-suave">Ambiente</dt><dd className="text-texto font-medium">{ambiente.nombre}</dd></div>
          <div><dt className="font-semibold text-texto-suave">Estado actual</dt><dd className="mt-1"><EstadoAmbienteBadge estado={ambiente.estado} /></dd></div>
        </dl>
        {cantFuturas > 0 && (
          <div className="p-3 mb-4 rounded-control border border-pendiente-texto bg-pendiente-fondo text-pendiente-texto text-sm">
            <p className="font-medium">{`Este ambiente tiene ${cantFuturas} reservas pendientes o aprobadas desde hoy. No se cancelan automáticamente; revíselas después del cambio`}</p>
            <Link to={`/reservas?texto=${encodeURIComponent(ambiente.nombre)}`} className="inline-block mt-2 font-semibold underline hover:opacity-80">Ver reservas del ambiente →</Link>
          </div>
        )}
        <form onSubmit={manejarEnvio} noValidate className="space-y-4">
          <SelectInput nombre="nuevoEstado" etiqueta="Nuevo estado" obligatorio valor={nuevoEstado} alCambiar={(e) => setNuevoEstado(e.target.value)} opciones={opciones} incluirVacio={false} soloLectura={enProceso} />
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-borde">
            <Button variante="secundario" disabled={enProceso} onClick={alCerrar}>Cancelar</Button>
            <Button tipo="submit" variante="primario" enProceso={enProceso} disabled={!nuevoEstado || nuevoEstado === ambiente.estado}>{`Cambiar a ${nuevoEstado || '…'}`}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
