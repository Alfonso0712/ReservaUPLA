// Modal accesible para registrar o editar usuario exclusivo de Administrador
import { useEffect, useId, useState } from 'react';
import { useFormulario } from '../../hooks/useFormulario';
import { useTrampaFoco } from '../../hooks/useTrampaFoco';
import { validarCrearUsuarioAdmin, validarEditarUsuarioAdmin } from '../../validation/validadores';
import TextInput from '../formulario/TextInput';
import SelectInput from '../formulario/SelectInput';
import Button from '../ui/Button';
import AlertMessage from '../ui/AlertMessage';
import Icono from '../ui/Icono';

const OPCIONES_ROL = [
  { valor: 'Responsable', etiqueta: 'Responsable de ambiente' },
  { valor: 'Solicitante', etiqueta: 'Solicitante' }
];

export default function FormularioUsuario({
  abierto,
  modo = 'crear',
  usuarioAEditar = null,
  alRegistrar,
  alEditar,
  alCerrar,
  alExito
}) {
  const idTitulo = useId();
  const esEdicion = modo === 'editar';
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const form = useFormulario({
    valoresIniciales: { nombreCompleto: '', correo: '', rol: '', contrasena: '' },
    validar: esEdicion ? validarEditarUsuarioAdmin : validarCrearUsuarioAdmin,
    alEnviar: async (valores, { setErrores, setErrorGeneral, enfocarPrimerError }) => {
      const { datosNormalizados } = esEdicion
        ? validarEditarUsuarioAdmin(valores)
        : validarCrearUsuarioAdmin(valores);

      const res = esEdicion
        ? await alEditar?.(usuarioAEditar.id, datosNormalizados)
        : await alRegistrar?.(datosNormalizados);

      if (res?.ok) {
        alExito?.(
          esEdicion ? 'Usuario actualizado con éxito.' : 'Usuario registrado con éxito.',
          res.datos
        );
        return;
      }

      const errs = res?.accion === 'conflicto' && !Object.keys(res.errores || {}).length
        ? { correo: res.errorGeneral || 'El correo ya se encuentra registrado.' }
        : (res?.errores || {});

      if (Object.keys(errs).length > 0) {
        setErrores(errs);
        enfocarPrimerError(errs);
        return;
      }
      setErrorGeneral(res?.errorGeneral || 'No se pudo guardar el usuario.');
    }
  });

  const modalRef = useTrampaFoco(abierto, () => {
    if (!form.enProceso) alCerrar?.();
  }, 'select, input');

  useEffect(() => {
    if (!abierto) return;
    const inicial = esEdicion && usuarioAEditar
      ? {
          nombreCompleto: usuarioAEditar.nombreCompleto || '',
          correo: usuarioAEditar.correo || '',
          rol: usuarioAEditar.rol || '',
          contrasena: ''
        }
      : { nombreCompleto: '', correo: '', rol: '', contrasena: '' };
    form.setValores(inicial);
    form.setErrores({});
    form.setErrorGeneral('');
    setMostrarContrasena(false);
  }, [abierto, esEdicion, usuarioAEditar]); // eslint-disable-line react-hooks/exhaustive-deps

  const manejarCambio = (campo) => (e) => {
    const val = e?.target ? e.target.value : e;
    form.cambiarValor(campo, val);
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fondo-modal">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-tarjeta border border-borde bg-superficie text-texto"
      >
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-borde">
          <h2 id={idTitulo} className="text-xl font-semibold text-texto">
            {esEdicion ? 'Editar usuario' : 'Nuevo usuario'}
          </h2>
          <button
            type="button"
            onClick={alCerrar}
            disabled={form.enProceso}
            aria-label={`Cerrar ventana de ${esEdicion ? 'editar' : 'nuevo'} usuario`}
            className="h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] p-2 inline-flex items-center justify-center rounded-full text-texto-suave hover:bg-superficie-2"
          >
            <Icono nombre="X" className="w-5 h-5" />
          </button>
        </div>

        <div role="status" aria-live="polite" className="sr-only">
          {form.resumenEstado}
        </div>

        {form.errorGeneral && (
          <div className="mb-4">
            <AlertMessage variante="error" rol="alert" mensaje={form.errorGeneral} enfocarAlAparecer />
          </div>
        )}

        <form onSubmit={form.manejarEnvio} noValidate className="space-y-4">
          <TextInput
            id="campo-nombre-usuario"
            nombre="nombreCompleto"
            etiqueta="Nombre completo"
            obligatorio
            valor={form.valores.nombreCompleto}
            error={form.errores.nombreCompleto}
            alCambiar={manejarCambio('nombreCompleto')}
            placeholder="Ej. Juan Pérez Ramos"
            autoComplete="name"
          />

          {!esEdicion && (
            <TextInput
              id="campo-correo-usuario"
              nombre="correo"
              etiqueta="Correo electrónico institucional"
              tipo="email"
              obligatorio
              valor={form.valores.correo}
              error={form.errores.correo}
              alCambiar={manejarCambio('correo')}
              placeholder="ejemplo@upla.edu.pe"
              autoComplete="email"
            />
          )}

          {esEdicion && (
            <div>
              <label htmlFor="campo-correo-lectura" className="block text-sm font-semibold text-texto mb-1">
                Correo electrónico
              </label>
              <input
                id="campo-correo-lectura"
                type="text"
                disabled
                value={form.valores.correo}
                className="w-full p-2.5 rounded-control border border-borde bg-superficie-2 text-texto-suave text-sm cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-texto-suave">
                El correo electrónico no se puede modificar desde este módulo.
              </p>
            </div>
          )}

          <SelectInput
            id="campo-rol-usuario"
            nombre="rol"
            etiqueta="Rol asignado"
            obligatorio
            valor={form.valores.rol}
            error={form.errores.rol}
            alCambiar={manejarCambio('rol')}
            opciones={OPCIONES_ROL}
            placeholder="Seleccione un rol"
          />

          {esEdicion && usuarioAEditar?.ambientesAsignados > 0 && ['Solicitante'].includes(form.valores.rol) && (
            <AlertMessage
              variante="alerta"
              rol="status"
              mensaje={`Advertencia: Este usuario tiene ${usuarioAEditar.ambientesAsignados} ambiente(s) asignado(s). Debe reasignar dichos ambientes antes de cambiar el rol a Solicitante.`}
            />
          )}

          {!esEdicion && (
            <div>
              <div className="relative">
                <TextInput
                  id="campo-contrasena-usuario"
                  nombre="contrasena"
                  etiqueta="Contraseña inicial"
                  tipo={mostrarContrasena ? 'text' : 'password'}
                  obligatorio
                  valor={form.valores.contrasena}
                  error={form.errores.contrasena}
                  alCambiar={manejarCambio('contrasena')}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena((prev) => !prev)}
                  className="absolute right-3 top-[2.4rem] text-texto-suave hover:text-texto"
                  aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  <Icono nombre={mostrarContrasena ? 'EyeOff' : 'Eye'} className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-1 text-xs text-texto-suave">
                La contraseña debe tener al menos 8 caracteres.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-borde">
            <Button
              type="button"
              variante="secondary"
              onClick={alCerrar}
              disabled={form.enProceso}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variante="primary"
              enProceso={form.enProceso}
              icono={esEdicion ? 'Check' : 'Plus'}
            >
              {esEdicion ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
