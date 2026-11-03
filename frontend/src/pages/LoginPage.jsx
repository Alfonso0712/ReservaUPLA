import { useEffect } from 'react';
import logoUpla from '../assets/logo-upla.png';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import LoginPanelDecorativo from '../components/LoginPanelDecorativo';

// Nielsen 1 a 10 · Shneiderman 1 a 8 · ISO 9241-11 · E-07 · E-08 · E-09
export default function LoginPage({
  correo = '',
  setCorreo,
  alCambiarCorreo = setCorreo,
  contrasena = '',
  setContrasena,
  alCambiarContrasena = setContrasena,
  recordar = false,
  recordarCorreo = recordar,
  setRecordar,
  alCambiarRecordarCorreo = setRecordar,
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
      {/* Panel izquierdo decorativo con foto y recuadro enmarcado */}
      <LoginPanelDecorativo />

      {/* Panel derecho con el formulario que respeta modo claro / oscuro */}
      <div className="login-panel-formulario">
        {/* Botón para alternar modo claro / oscuro en el login */}
        {alAlternarTema && (
          <button
            type="button"
            className="boton-tema-login"
            onClick={alAlternarTema}
            aria-label={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {tema === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
          </button>
        )}

        <div className="login-form-wrapper">
          <div className="login-form-encabezado">
            {/* Logo y siglas UPLA centradito en recuadro en lugar de texto plano */}
            <div className="login-header-marca">
              <img src={logoUpla} alt="Logo UPLA" className="login-header-logo" />
              <span className="login-header-siglas">UPLA</span>
            </div>

            <h2 className="login-form-titulo">Iniciar sesión</h2>
            <p className="login-form-bajada">Ingrese su usuario y contraseña para acceder al sistema institucional.</p>
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

            {bloqMayusActivo && <p className="aviso-bloq-mayus" role="status">⚠️ Bloq Mayús está activado</p>}

            <div className="login-opciones">
              <label className="checkbox-etiqueta">
                <input
                  type="checkbox"
                  checked={recordarCorreo}
                  onChange={(e) => alCambiarRecordarCorreo?.(e.target.checked)}
                  disabled={cargando}
                />
                <span>Recordar solo correo</span>
              </label>
            </div>

            <Button type="submit" cargando={cargando} anchoCompleto>
              Iniciar sesión
            </Button>

            <p className="login-pie">
              ¿No tienes cuenta?{' '}
              <button type="button" className="enlace-texto" onClick={alIrARegistro} disabled={cargando}>
                Registrarse como solicitante
              </button>
            </p>

            {/* Acceso de demostración rápido */}
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
          </form>
        </div>
      </div>
    </div>
  );
}
