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
import LogoUpla from '../components/ui/LogoUpla';

export default function Ingresar() {
  const navegar = useNavigate();
  const { iniciarSesion } = useAuth();
  const { correoInicial, guardarCorreo } = useCorreoRecordado();
  const [enfocarAlerta, setEnfocarAlerta] = useState(false);

  const form = useFormulario({
    valoresIniciales: { correo: correoInicial || '', contrasena: '' },
    validar: validarLogin,
    alEnviar: async (valores, { setErrores, setErrorGeneral, enfocarPrimerError, camposRef }) => {
      const { correoNormalizado } = validarLogin(valores);
      const res = await iniciarSesion({ correo: correoNormalizado, contrasena: valores.contrasena });
      if (res.ok) {
        guardarCorreo(correoNormalizado, false);
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
    document.title = 'ReservaUPLA';
    form.camposRef.current.correo?.focus();
  }, [form.camposRef]);

  return (
    <div className="w-full max-w-[360px] mx-auto p-4 sm:p-5 rounded-tarjeta border border-borde/70 bg-superficie text-texto shadow-[0_10px_35px_-5px_rgba(0,0,0,0.08),0_4px_15px_-3px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.4)] space-y-3">
      <div className="flex flex-col items-center text-center">
        <Link
          to="/"
          className="flex flex-col items-center gap-0.5 mb-1 no-underline group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primario rounded"
          aria-label="Ir a la página principal de ReservaUPLA"
        >
          <LogoUpla variante="libre" className="w-10 h-10 group-hover:scale-105 transition-transform" />
          <span className="text-xs font-bold tracking-wider text-primario">UPLA</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-texto tracking-tight">Iniciar sesión</h1>
        <p className="mt-0.5 text-xs sm:text-sm text-texto-suave">Ingrese sus credenciales para continuar.</p>
      </div>
      <div role="status" aria-live="polite" className="sr-only">{form.resumenEstado}</div>
      {form.errorGeneral && <AlertMessage variante="error" rol="alert" mensaje={form.errorGeneral} compacto enfocarAlAparecer={enfocarAlerta} />}
      <form onSubmit={form.manejarEnvio} noValidate className="space-y-2.5 sm:space-y-3">
        <TextInput ref={form.registrarRef('correo')} nombre="correo" etiqueta="Correo institucional" tipo="email" obligatorio valor={form.valores.correo} alCambiar={(e) => form.cambiarValor('correo', e.target.value)} alSalir={() => form.manejarBlur('correo')} error={form.errores.correo} ayuda="" placeholder="nombre@upla.edu.pe" autoComplete="username" inputMode="email" enterKeyHint="next" soloLectura={form.enProceso} />
        <PasswordInput ref={form.registrarRef('contrasena')} nombre="contrasena" etiqueta="Contraseña" obligatorio valor={form.valores.contrasena} alCambiar={(e) => form.cambiarValor('contrasena', e.target.value)} alSalir={() => form.manejarBlur('contrasena')} error={form.errores.contrasena} ayuda="" placeholder="Ingresar contraseña" autoComplete="current-password" enterKeyHint="done" soloLectura={form.enProceso} />
        <Button tipo="submit" variante="primario" enProceso={form.enProceso} textoProceso={MENSAJES.VALIDANDO} className="w-full">Iniciar sesión</Button>
      </form>
      <p className="text-xs sm:text-sm text-texto-suave text-center">
        ¿No tiene cuenta? <Link to={RUTAS.REGISTRO} className="font-semibold text-primario-enlace">Registrarse como solicitante</Link>
      </p>
      <PanelAyuda deshabilitado={form.enProceso} alRellenarDemo={(c) => { form.cambiarValores({ correo: c.correo, contrasena: c.contrasenaDemo }); form.camposRef.current.correo?.focus(); }} />
    </div>
  );
}
