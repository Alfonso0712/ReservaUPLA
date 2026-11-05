// RF-01 · RV-01..03 · Shneiderman 4 · Registro público con rol fijo Solicitante y diálogo con cierre · E-01..06
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormulario } from '../hooks/useFormulario';
import { useFocoAlMontar } from '../hooks/useFocoAlMontar';
import { validarRegistroSolicitante } from '../validation/validadores';
import { interpretarRespuesta } from '../validation/interpretarRespuesta';
import { registrarSolicitanteApi } from '../services/usuarioService';
import { MENSAJES } from '../constants/mensajes';
import { RUTAS } from '../constants/rutas';
import TextInput from '../components/formulario/TextInput';
import PasswordInput from '../components/formulario/PasswordInput';
import Button from '../components/ui/Button';
import AlertMessage from '../components/ui/AlertMessage';

export default function RegistroSolicitante() {
  const [registrado, setRegistrado] = useState(false);
  const refExito = useFocoAlMontar(registrado, registrado);

  const form = useFormulario({
    valoresIniciales: { nombreCompleto: '', correo: '', contrasena: '' },
    validar: validarRegistroSolicitante,
    alEnviar: async (valores, { setErrores, setErrorGeneral, enfocarPrimerError }) => {
      const { datosNormalizados } = validarRegistroSolicitante(valores);
      const resp = await registrarSolicitanteApi(datosNormalizados);
      const res = interpretarRespuesta(resp);
      if (res.ok) {
        setRegistrado(true);
        return;
      }
      if (Object.keys(res.errores).length > 0) {
        setErrores(res.errores);
        enfocarPrimerError(res.errores);
        return;
      }
      setErrorGeneral(res.errorGeneral);
    }
  });

  useEffect(() => {
    document.title = 'ReservaUPLA';
    if (!registrado) form.camposRef.current.nombreCompleto?.focus();
  }, [registrado, form.camposRef]);

  if (registrado) {
    return (
      <div className="w-full max-w-[360px] mx-auto p-4 sm:p-5 rounded-tarjeta border border-borde/70 bg-superficie text-texto shadow-[0_10px_35px_-5px_rgba(0,0,0,0.08),0_4px_15px_-3px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.4)] space-y-3">
        <h1 ref={refExito} tabIndex={-1} className="text-xl sm:text-2xl font-bold text-texto text-center outline-none">
          {MENSAJES.REGISTRO_EXITOSO_TITULO}
        </h1>
        <AlertMessage variante="exito" rol="status" mensaje={MENSAJES.REGISTRO_EXITOSO_DETALLE} compacto />
        <Link to={RUTAS.INGRESAR} className="min-h-control px-4 py-2.5 rounded-control bg-primario text-sobre-primario font-semibold inline-flex items-center justify-center w-full no-underline hover:-translate-y-0.5 active:translate-y-0 transition-transform">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[360px] mx-auto p-4 sm:p-5 rounded-tarjeta border border-borde/70 bg-superficie text-texto shadow-[0_10px_35px_-5px_rgba(0,0,0,0.08),0_4px_15px_-3px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.4)] space-y-3">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-texto tracking-tight">Registrarse como solicitante</h1>
        <p className="mt-0.5 text-xs sm:text-sm text-texto-suave">Complete sus datos institucionales.</p>
      </div>
      <div role="status" aria-live="polite" className="sr-only">{form.resumenEstado}</div>
      {form.errorGeneral && <AlertMessage variante="error" rol="alert" mensaje={form.errorGeneral} compacto enfocarAlAparecer />}
      <form onSubmit={form.manejarEnvio} noValidate className="space-y-2.5 sm:space-y-3">
        <TextInput ref={form.registrarRef('nombreCompleto')} nombre="nombreCompleto" etiqueta="Nombre completo" obligatorio valor={form.valores.nombreCompleto} alCambiar={(e) => form.cambiarValor('nombreCompleto', e.target.value)} alSalir={() => form.manejarBlur('nombreCompleto')} error={form.errores.nombreCompleto} ayuda="" placeholder="Juan Pérez Huamán" autoComplete="name" enterKeyHint="next" soloLectura={form.enProceso} />
        <TextInput ref={form.registrarRef('correo')} nombre="correo" etiqueta="Correo institucional" tipo="email" obligatorio valor={form.valores.correo} alCambiar={(e) => form.cambiarValor('correo', e.target.value)} alSalir={() => form.manejarBlur('correo')} error={form.errores.correo} ayuda="" placeholder="nombre@upla.edu.pe" autoComplete="email" inputMode="email" enterKeyHint="next" soloLectura={form.enProceso} />
        <PasswordInput ref={form.registrarRef('contrasena')} nombre="contrasena" etiqueta="Contraseña" obligatorio valor={form.valores.contrasena} alCambiar={(e) => form.cambiarValor('contrasena', e.target.value)} alSalir={() => form.manejarBlur('contrasena')} error={form.errores.contrasena} ayuda="" placeholder="Mínimo 8 caracteres" autoComplete="new-password" enterKeyHint="done" soloLectura={form.enProceso} />
        <Button tipo="submit" variante="primario" enProceso={form.enProceso} textoProceso={MENSAJES.VALIDANDO} className="w-full">Crear cuenta de solicitante</Button>
      </form>
      <p className="text-xs sm:text-sm text-texto-suave text-center">
        ¿Ya tiene una cuenta? <Link to={RUTAS.INGRESAR} className="font-semibold text-primario-enlace">Iniciar sesión</Link>
      </p>
    </div>
  );
}
