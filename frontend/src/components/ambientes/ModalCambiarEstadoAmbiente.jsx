// RF-02 · RV-17 · Modal accesible para cambiar estado de ambiente con ModalConfirmacion · E-41 · E-44
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LISTA_ESTADOS_AMBIENTE } from '../../constants/estados';
import { MENSAJES } from '../../constants/mensajes';
import SelectInput from '../formulario/SelectInput';
import EstadoAmbienteBadge from '../ui/EstadoAmbienteBadge';
import AlertMessage from '../ui/AlertMessage';
import ModalConfirmacion from '../ui/ModalConfirmacion';

export default function ModalCambiarEstadoAmbiente({ abierto, ambiente = null, alCambiarEstado, alCerrar, alExito }) {
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [enProceso, setEnProceso] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!abierto || !ambiente) return;
    const primerOtro = LISTA_ESTADOS_AMBIENTE.find((e) => e !== ambiente.estado) || '';
    setNuevoEstado(primerOtro);
    setError('');
  }, [abierto, ambiente]);

  if (!abierto || !ambiente) return null;
  const cantFuturas = ambiente.reservasFuturasActivas || 0;
  const opciones = LISTA_ESTADOS_AMBIENTE.map((e) => ({ valor: e, etiqueta: e }));

  const ejecutarCambio = async () => {
    if (!nuevoEstado || nuevoEstado === ambiente.estado || enProceso) return;
    setEnProceso(true);
    setError('');
    const res = await alCambiarEstado(ambiente.id, nuevoEstado);
    setEnProceso(false);
    if (res?.ok) { alExito?.(MENSAJES.AMBIENTE_ESTADO_ACTUALIZADO_EXITO, res.datos); return; }
    setError(res?.errorGeneral || 'No se pudo cambiar el estado.');
  };

  const resumenAmbiente = (
    <>
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
    </>
  );

  return (
    <ModalConfirmacion
      abierto={abierto}
      titulo="Cambiar estado del ambiente"
      mostrarBotonCerrar
      alCancelar={alCerrar}
      alConfirmar={ejecutarCambio}
      etiquetaCancelar="Cancelar"
      etiquetaConfirmar={`Cambiar a ${nuevoEstado || '…'}`}
      varianteConfirmar="primario"
      enProceso={enProceso}
      deshabilitarConfirmar={!nuevoEstado || nuevoEstado === ambiente.estado}
      resumen={resumenAmbiente}
    >
      <div className="space-y-4">
        <SelectInput nombre="nuevoEstado" etiqueta="Nuevo estado" obligatorio valor={nuevoEstado} alCambiar={(e) => setNuevoEstado(e.target.value)} opciones={opciones} incluirVacio={false} soloLectura={enProceso} />
      </div>
    </ModalConfirmacion>
  );
}
