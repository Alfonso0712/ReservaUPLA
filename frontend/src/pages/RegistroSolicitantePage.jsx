import Logo from '../components/Logo';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import { useRegistroUsuario } from '../hooks/useRegistroUsuario';

// RF-01 · RV-01 a RV-03 · Nielsen 1 a 10 · Shneiderman 1 a 8
export default function RegistroSolicitantePage({ alRegistrarExitoso, alIrALogin }) {
  const {
    nombreCompleto, setNombreCompleto,
    correo, setCorreo,
    contrasena, setContrasena,
    errores, errorGeneral, cargando,
    nombreRef, correoRef, contrasenaRef,
    registrar
  } = useRegistroUsuario({ alRegistrarExitoso });

  return (
    <div className="login-pantalla">
      <div className="login-panel-formulario">
        <Logo ancho={120} />
        <h1 className="login-titulo">Registro de Solicitante</h1>
        <p className="login-subtitulo">Crea tu cuenta institucional para solicitar ambientes</p>
        <AlertMessage tipo="error" mensaje={errorGeneral} />
        <form onSubmit={(e) => { e.preventDefault(); registrar(); }} noValidate className="login-form">
          <TextInput
            id="reg-nombre" label="Nombre completo" value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)} error={errores.nombreCompleto}
            obligatorio ayuda="Solo letras, espacios y tildes (3-150 caracteres)" readOnly={cargando} inputRef={nombreRef}
          />
          <TextInput
            id="reg-correo" label="Correo institucional" type="email" value={correo}
            onChange={(e) => setCorreo(e.target.value)} error={errores.correo}
            obligatorio ayuda="Ejemplo: nombre@upla.edu.pe" autoComplete="email" inputMode="email" readOnly={cargando} inputRef={correoRef}
          />
          <TextInput
            id="reg-clave" label="Contraseña" type="password" value={contrasena}
            onChange={(e) => setContrasena(e.target.value)} error={errores.contrasena}
            obligatorio ayuda="Entre 8 y 64 caracteres" autoComplete="new-password" readOnly={cargando} inputRef={contrasenaRef}
          />
          <Button type="submit" cargando={cargando} anchoCompleto>Registrarse</Button>
          <p className="login-pie">
            ¿Ya tienes cuenta? <button type="button" className="enlace-texto" onClick={alIrALogin} disabled={cargando}>Iniciar sesión</button>
          </p>
        </form>
      </div>
    </div>
  );
}
