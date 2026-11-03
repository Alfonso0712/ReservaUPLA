import { useEffect, useRef } from 'react';
import Button from './Button';

// Nielsen 5 · Nielsen 6 · Shneiderman 2 · E-33
export default function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  resumen,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  varianteConfirmar = 'peligro',
  cargando = false,
  alConfirmar,
  alCancelar,
  disparadorRef
}) {
  const modalRef = useRef(null);
  const primerBotonRef = useRef(null);

  useEffect(() => {
    if (!abierto) return;
    const elementoAnterior = disparadorRef?.current || document.activeElement;
    primerBotonRef.current?.focus();

    const manejarTeclado = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        alCancelar();
      }
    };
    window.addEventListener('keydown', manejarTeclado);
    return () => {
      window.removeEventListener('keydown', manejarTeclado);
      elementoAnterior?.focus?.();
    };
  }, [abierto, alCancelar, disparadorRef]);

  if (!abierto) return null;

  return (
    <div className="modal-fondo" role="presentation">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className="modal-caja"
      >
        <h2 id="modal-titulo" className="modal-titulo">{titulo}</h2>
        <p className="modal-mensaje">{mensaje}</p>
        {resumen && <div className="modal-resumen">{resumen}</div>}
        <div className="modal-acciones">
          <Button
            variante="secundario"
            onClick={alCancelar}
            deshabilitado={cargando}
          >
            {textoCancelar}
          </Button>
          <Button
            buttonRef={primerBotonRef}
            variante={varianteConfirmar}
            onClick={alConfirmar}
            cargando={cargando}
          >
            {textoConfirmar}
          </Button>
        </div>
      </div>
    </div>
  );
}
