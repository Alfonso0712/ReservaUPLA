// Nielsen 1 · Nielsen 5 · Nielsen 9 · Shneiderman 7 · Inicio de sesión institucional · E-07..09 · E-22..26
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCorreoRecordado } from '../hooks/useCorreoRecordado';
import { useFormulario } from '../hooks/useFormulario';
import { validarLogin } from '../validation/validadores';
import { MENSAJES } from '../constants/mensajes';
import { RUTAS } from '../constants/rutas';
import TextInput from '../components/formulario/TextInput';
import PasswordInput from '../components/formulario/PasswordInput';
import PanelAyuda from '../components/formulario/PanelAyuda';
import Button from '../components/ui/Button';
import AlertMessage from '../components/ui/AlertMessage';

export default function Ingresar() {
  const navegar = useNavigate();
  const { iniciarSesion } = useAuth();
  const { correoInicial, recordar, setRecordar, guardarCorreo } = useCorreoRecordado();
  const [enfocarAlerta, setEnfocarAlerta] = useState(false);

  const form = useFormulario({
    valoresIniciales: { correo: correoInicial || '', contrasena: '' },
    validar: validarLogin,
    alEnviar: async (valores, { setErrores, setErrorGeneral, enfocarPrimerError, camposRef }) => {
      const { correoNormalizado } = validarLogin(valores);
      const res = await iniciarSesion({ correo: correoNormalizado, contrasena: valores.contrasena });
      if (res.ok) {
        guardarCorreo(correoNormalizado, recordar);
        navegar(RUTAS.PANEL, { replace: true });
        return;
      }
      if (Object.keys(res.errores).length > 0) {
        setErrores(res.errores);
        enfocarPrimerError(res.errores);
        return;
      }
      setEnfocarAlerta(res.accion !== 'reautenticar');
      setErrorGeneral(res.errorGeneral);
      if (res.accion === 'reautenticar') {
        camposRef.current.contrasena?.focus();
        camposRef.current.contrasena?.select?.();
      }
    }
  });

  useEffect(() => {
    document.title = 'Iniciar sesión | ReservaUPLA';
    form.camposRef.current.correo?.focus();
  }, [form.camposRef]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-texto">Iniciar sesión</h1>
        <p className="mt-1 text-base text-texto-suave">Ingrese con su correo institucional para gestionar sus reservas.</p>
      </div>
      <div role="status" aria-live="polite" className="sr-only">{form.resumenEstado}</div>
      {form.errorGeneral && <AlertMessage variante="error" rol="alert" mensaje={form.errorGeneral} enfocarAlAparecer={enfocarAlerta} />}
      <form onSubmit={form.manejarEnvio} noValidate className="space-y-4">
        <TextInput ref={form.registrarRef('correo')} nombre="correo" etiqueta="Correo institucional" tipo="email" obligatorio valor={form.valores.correo} alCambiar={(e) => form.cambiarValor('correo', e.target.value)} alSalir={() => form.manejarBlur('correo')} error={form.errores.correo} ayuda={MENSAJES.AYUDA_CORREO} placeholder="nombre@upla.edu.pe" autoComplete="username" inputMode="email" enterKeyHint="next" soloLectura={form.enProceso} />
        <PasswordInput ref={form.registrarRef('contrasena')} nombre="contrasena" etiqueta="Contraseña" obligatorio valor={form.valores.contrasena} alCambiar={(e) => form.cambiarValor('contrasena', e.target.value)} alSalir={() => form.manejarBlur('contrasena')} error={form.errores.contrasena} ayuda={MENSAJES.AYUDA_CONTRASENA_LOGIN} placeholder="••••••••" autoComplete="current-password" enterKeyHint="done" soloLectura={form.enProceso} />
        <label className="inline-flex items-center gap-2.5 min-h-control cursor-pointer text-sm text-texto">
          <input type="checkbox" checked={recordar} onChange={(e) => setRecordar(e.target.checked)} readOnly={form.enProceso} className="w-4 h-4 rounded border-borde-control text-primario" />
          <span>Recordar correo</span>
        </label>
        <Button tipo="submit" variante="primario" enProceso={form.enProceso} textoProceso={MENSAJES.VALIDANDO} className="w-full">Iniciar sesión</Button>
      </form>
      <p className="text-sm text-texto-suave text-center">
        ¿No tiene cuenta? <Link to={RUTAS.REGISTRO} className="font-semibold text-primario-enlace">Registrarse como solicitante</Link>
      </p>
      <PanelAyuda deshabilitado={form.enProceso} alRellenarDemo={(c) => { form.cambiarValor('correo', c.correo); form.cambiarValor('contrasena', c.contrasenaDemo); }} />
    </div>
  );
}
