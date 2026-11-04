// Nielsen 3 · Nielsen 6 · Norman · ISO 9241-110 · Menú de cuenta disclosure accesible · E-34..38
import { useState } from 'react';
import { useMenuDesplegable } from '../../hooks/useMenuDesplegable';
import { obtenerIniciales } from '../../utils/obtenerIniciales';
import { MENSAJES } from '../../constants/mensajes';
import ControlTamanoFuente from './ControlTamanoFuente';
import ConmutadorTema from './ConmutadorTema';
import Icono from '../ui/Icono';

export default function MenuUsuario({
  nombreCompleto = 'Usuario', rol = 'Solicitante', correo = '',
  onCerrarSesion = null, incluirControlesAccesibilidad = false
}) {
  const { abierto, alternar, botonRef, contenedorRef, manejarPerdidaFoco } = useMenuDesplegable();
  const [enProceso, setEnProceso] = useState(false);
  const iniciales = obtenerIniciales(nombreCompleto) || 'U';

  const manejarCerrar = async () => {
    if (enProceso) return;
    setEnProceso(true);
    await onCerrarSesion?.();
  };

  return (
    <div ref={contenedorRef} onBlur={manejarPerdidaFoco} className="relative shrink-0">
      <button
        ref={botonRef}
        type="button"
        id="boton-menu-usuario"
        aria-label={`Menú de cuenta de ${nombreCompleto}, ${rol}`}
        aria-expanded={abierto}
        aria-controls="panel-menu-usuario"
        onClick={alternar}
        className="min-h-control h-11 px-2.5 rounded-control border border-borde bg-superficie hover:bg-superficie-2 text-texto inline-flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <span className="w-8 h-8 rounded-full bg-primario-suave text-primario dark:text-primario-enlace font-bold text-xs flex items-center justify-center shrink-0">
          {iniciales}
        </span>
        <span className="hidden sm:flex flex-col text-left leading-tight min-w-0">
          <span className="text-sm font-semibold text-texto truncate max-w-[130px] lg:max-w-[180px]">{nombreCompleto}</span>
          <span className="text-xs text-texto-suave hidden lg:block">{rol}</span>
        </span>
        <Icono nombre="ChevronDown" className={`w-4 h-4 text-texto-suave transition-transform duration-200 motion-reduce:transition-none shrink-0 ${abierto ? 'rotate-180' : ''}`} />
      </button>

      {abierto && (
        <div id="panel-menu-usuario" className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-1rem)] bg-superficie border border-borde rounded-tarjeta shadow-lg dark:shadow-none p-3 z-50 text-texto space-y-2">
          <div className="px-1 py-1 border-b border-borde">
            <p className="text-sm font-bold text-texto break-words">{nombreCompleto}</p>
            <p className="text-xs font-medium text-texto-suave">{rol}</p>
            {correo && <p className="text-xs text-texto-suave break-all mt-0.5">{correo}</p>}
          </div>
          {incluirControlesAccesibilidad && (
            <div className="py-1 px-1 border-b border-borde space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-texto-suave">{MENSAJES.ETIQUETA_TAMANO_FUENTE}</span>
                <ControlTamanoFuente />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-texto-suave">{MENSAJES.ETIQUETA_TEMA}</span>
                <ConmutadorTema />
              </div>
            </div>
          )}
          <div className="pt-0.5">
            <button type="button" disabled={enProceso} onClick={manejarCerrar} className="w-full min-h-control px-2 py-2 rounded-control inline-flex items-center gap-2 text-sm font-semibold text-rechazada-texto hover:bg-superficie-2 focus-visible:bg-superficie-2 transition-colors cursor-pointer disabled:opacity-50">
              <Icono nombre="LogOut" className="w-4 h-4 shrink-0" />
              <span>{MENSAJES.CERRAR_SESION}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}