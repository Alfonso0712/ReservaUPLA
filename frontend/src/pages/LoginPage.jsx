import { useEffect } from 'react';
import logoUpla from '../assets/logo-upla.png';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import LoginPanelDecorativo from '../components/LoginPanelDecorativo';
import { IconoAlerta } from '../components/Iconos';

// Nielsen 1 a 10 · Shneiderman 1 a 8 · ISO 9241-11 · E-07 · E-08 · E-09
export default function LoginPage({
  correo = '',
  setCorreo,
  alCambiarCorreo = setCorreo,
  contrasena = '',
  setContrasena,
  alCambiarContrasena = setContrasena,
  recordar: _recordar = false,
  recordarCorreo: _recordarCorreo = _recordar,
  setRecordar: _setRecordar,
  alCambiarRecordarCorreo: _alCambiarRecordarCorreo = _setRecordar,
  alEnviar,
  iniciarSesion = alEnviar,
  cargando = false,
  error = '',
  bloqMayusActivo = false,
  alVerificarBloqMayus,
  correoRef,
  contrasenaRef,
  alIrARegistro,
  tema = 'light',
  alAlternarTema
}) {
  // Asegura que al cargar la pantalla el foco siempre aparezca en el correo institucional
  useEffect(() => {
    correoRef?.current?.focus();
  }, [correoRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cargando) (alEnviar || iniciarSesion)?.();
  };

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

        {/* Zona central con formulario de acceso */}
        <div className="login-form-wrapper">
          <div className="login-form-encabezado">
            <h2 className="login-form-titulo">
              Iniciar <span className="login-titulo-acento">sesión</span>
            </h2>
            <p className="login-form-bajada">Ingrese sus credenciales para continuar.</p>
          </div>

          <AlertMessage tipo="error" mensaje={error} />

          <form onSubmit={handleSubmit} noValidate className="login-form">
            <TextInput
              id="login-correo"
              label="Correo institucional"
              type="email"
              value={correo}
              onChange={(e) => alCambiarCorreo?.(e.target.value)}
              obligatorio
              ayuda="Ejemplo: usuario@upla.edu.pe"
              placeholder="Ingrese su correo institucional"
              autoComplete="email"
              inputMode="email"
              autoFocus
              readOnly={cargando}
              inputRef={correoRef}
            />
            <TextInput
              id="login-clave"
              label="Contraseña"
              type="password"
              value={contrasena}
              onChange={(e) => alCambiarContrasena?.(e.target.value)}
              onKeyDown={alVerificarBloqMayus}
              obligatorio
              ayuda="Mínimo 8 caracteres"
              placeholder="Ingrese su contraseña"
              autoComplete="current-password"
              readOnly={cargando}
              inputRef={contrasenaRef}
            />

            {bloqMayusActivo && <p className="aviso-bloq-mayus" role="status"><IconoAlerta size={14} /> Bloq Mayús está activado</p>}

            <Button type="submit" cargando={cargando} anchoCompleto>
              Iniciar sesión
            </Button>

            <p className="login-pie">
              ¿No tienes cuenta?{' '}
              <button type="button" className="enlace-texto" onClick={alIrARegistro} disabled={cargando}>
                Registrarse como solicitante
              </button>
            </p>
          </form>
        </div>

        {/* Acceso de demostración rápido ubicado más abajo */}
        <div className="login-demo-panel">
          <div className="login-demo-header">
            <span className="demo-titulo">Acceso de demostración</span>
            <span className="demo-sub">Seleccione un perfil para probar el acceso rápido:</span>
          </div>
          <div className="login-demo-actions">
            <button
              type="button"
              className="demo-chip chip-admin"
              disabled={cargando}
              onClick={() => {
                alCambiarCorreo?.('admin@upla.edu.pe');
                alCambiarContrasena?.('Admin123*');
                correoRef?.current?.focus();
              }}
            >
              Administrador
            </button>
            <button
              type="button"
              className="demo-chip chip-resp"
              disabled={cargando}
              onClick={() => {
                alCambiarCorreo?.('responsable@upla.edu.pe');
                alCambiarContrasena?.('Responsable123*');
                correoRef?.current?.focus();
              }}
            >
              Responsable
            </button>
            <button
              type="button"
              className="demo-chip chip-solic"
              disabled={cargando}
              onClick={() => {
                alIrARegistro?.();
              }}
            >
              Solicitante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
