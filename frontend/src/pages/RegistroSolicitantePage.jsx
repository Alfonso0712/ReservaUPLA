import { useEffect } from 'react';
import logoUpla from '../assets/logo-upla.png';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import LoginPanelDecorativo from '../components/LoginPanelDecorativo';
import { useRegistroUsuario } from '../hooks/useRegistroUsuario';

// RF-01 · RV-01 a RV-03 · Nielsen 1 a 10 · Shneiderman 1 a 8
export default function RegistroSolicitantePage({
  alRegistrarExitoso,
  alIrALogin,
  tema = 'light',
  alAlternarTema
}) {
  const {
    nombreCompleto, setNombreCompleto,
    correo, setCorreo,
    contrasena, setContrasena,
    errores, errorGeneral, cargando,
    nombreRef, correoRef, contrasenaRef,
    registrar
  } = useRegistroUsuario({ alRegistrarExitoso });

  // Asegura foco en nombre al cargar la pantalla
  useEffect(() => {
    nombreRef?.current?.focus();
  }, [nombreRef]);

  return (
    <div className="login-pantalla">
      {/* Panel izquierdo decorativo con foto y alternador de tema en esquina superior */}
      <LoginPanelDecorativo tema={tema} alAlternarTema={alAlternarTema} />

      {/* Panel derecho con el formulario que respeta modo claro / oscuro */}
      <div className="login-panel-formulario">
        {/* Marca UPLA superior sin fondo, más grande y ubicada arriba */}
        <div className="login-header-marca-wrapper">
          <div className="login-header-marca">
            <img src={logoUpla} alt="Logo UPLA" className="login-header-logo" />
            <span className="login-header-siglas">UPLA</span>
          </div>
        </div>

        {/* Zona central con formulario de registro */}
        <div className="login-form-wrapper">
          <div className="login-form-encabezado">
            <h2 className="login-form-titulo">
              Registro de <span className="login-titulo-acento">solicitante</span>
            </h2>
            <p className="login-form-bajada">Crea tu cuenta institucional para solicitar ambientes.</p>
          </div>

          <AlertMessage tipo="error" mensaje={errorGeneral} />

          <form onSubmit={(e) => { e.preventDefault(); registrar(); }} noValidate className="login-form">
            <TextInput
              id="reg-nombre"
              label="Nombre completo"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              error={errores.nombreCompleto}
              obligatorio
              ayuda="Solo letras, espacios y tildes (3-150 caracteres)"
              placeholder="Ingrese su nombre completo"
              readOnly={cargando}
              inputRef={nombreRef}
            />
            <TextInput
              id="reg-correo"
              label="Correo institucional"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              error={errores.correo}
              obligatorio
              ayuda="Ejemplo: nombre@upla.edu.pe"
              placeholder="Ingrese su correo institucional"
              autoComplete="email"
              inputMode="email"
              readOnly={cargando}
              inputRef={correoRef}
            />
            <TextInput
              id="reg-clave"
              label="Contraseña"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              error={errores.contrasena}
              obligatorio
              ayuda="Entre 8 y 64 caracteres"
              placeholder="Cree una contraseña segura"
              autoComplete="new-password"
              readOnly={cargando}
              inputRef={contrasenaRef}
            />

            <Button type="submit" cargando={cargando} anchoCompleto>
              Registrarse
            </Button>

            <p className="login-pie">
              ¿Ya tienes cuenta?{' '}
              <button type="button" className="enlace-texto" onClick={alIrALogin} disabled={cargando}>
                Iniciar sesión
              </button>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
