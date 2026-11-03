import { useState, useEffect, useCallback, useRef } from 'react';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import ModalConfirmacion from '../components/ModalConfirmacion';
import { reservaService } from '../services/reservaService';
import { interpretarRespuesta } from '../utils/interpretarRespuesta';

// RF-06 · RF-07 · RN-05 · RN-06 · RV-15 a RV-17 · E-18 a E-21 · E-33
export default function DetalleReservaPage({ id, rol, usuarioId, alVolver }) {
  const [detalle, setDetalle] = useState(null);
  const [modalAccion, setModalAccion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const disparadorRef = useRef(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const res = await reservaService.obtenerDetalle(id);
    const inter = interpretarRespuesta(res);
    if (inter.accion === 'exito') setDetalle(inter.datos);
    else setError(inter.errorGeneral);
    setCargando(false);
  }, [id]);

  useEffect(() => { cargar(); }, [cargar]);

  const ejecutarCambio = async () => {
    if (!modalAccion) return;
    setCargando(true);
    const res = await reservaService.cambiarEstado(id, modalAccion);
    const inter = interpretarRespuesta(res);
    if (inter.accion === 'exito') { setModalAccion(null); await cargar(); }
    else setError(inter.errorGeneral);
    setCargando(false);
  };

  return (
    <div className="pagina-detalle-reserva">
      <div className="detalle-encabezado">
        <Button variante="secundario" onClick={alVolver}>← Volver</Button>
        <h1>Detalle de Reserva</h1>
      </div>
      <AlertMessage tipo="error" mensaje={error} />
      {detalle && (
        <div className="detalle-tarjeta">
          <p><strong>Ambiente:</strong> {detalle.nombreAmbiente} ({detalle.ubicacionAmbiente})</p>
          <p><strong>Fecha y horario:</strong> {detalle.fecha} de {detalle.horaInicio} a {detalle.horaFin}</p>
          <p><strong>Solicitante:</strong> {detalle.nombreSolicitante} ({detalle.correoSolicitante})</p>
          <p><strong>Estado:</strong> <span className={`badge-estado badge-${detalle.estado.toLowerCase()}`}>{detalle.estado}</span></p>
          <p><strong>Motivo:</strong> {detalle.motivo}</p>
          <div className="detalle-acciones">
            {rol === 'Administrador' && detalle.estado === 'Pendiente' && (
              <>
                <Button buttonRef={disparadorRef} variante="primario" onClick={() => setModalAccion('Aprobada')}>Aprobar</Button>
                <Button variante="peligro" onClick={() => setModalAccion('Rechazada')}>Rechazar</Button>
              </>
            )}
            {detalle.estado !== 'Rechazada' && detalle.estado !== 'Cancelada' && (rol === 'Administrador' || detalle.solicitanteId === usuarioId) && (
              <Button variante="peligro" onClick={() => setModalAccion('Cancelada')}>Cancelar Reserva</Button>
            )}
          </div>
        </div>
      )}
      <ModalConfirmacion
        abierto={Boolean(modalAccion)}
        titulo={`Confirmar cambio a ${modalAccion}`}
        mensaje={`¿Está seguro de cambiar el estado de la reserva a ${modalAccion}?`}
        alConfirmar={ejecutarCambio}
        alCancelar={() => setModalAccion(null)}
        cargando={cargando}
        disparadorRef={disparadorRef}
      />
    </div>
  );
}
