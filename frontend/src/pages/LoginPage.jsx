import Logo from '../components/Logo';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';

// Nielsen 1 a 10 · Shneiderman 1 a 8 · ISO 9241-11 · E-07 · E-08 · E-09
export default function LoginPage({
  correo,
  alCambiarCorreo,
  contrasena,
  alCambiarContrasena,
  recordarCorreo,
  alCambiarRecordarCorreo,
  alEnviar,
  cargando,
  error,
  bloqMayusActivo,
  alVerificarBloqMayus,
  correoRef,
  contrasenaRef,
  alIrARegistro
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (cargando) return;
    alEnviar();
  };

  return (
    <div className="login-pantalla">
      <div className="login-panel-formulario">
        <Logo ancho={130} />
        <h1 className="login-titulo">ReservaUPLA</h1>
        <p className="login-subtitulo">Sistema institucional de reserva de ambientes</p>

        <AlertMessage tipo="error" mensaje={error} />

        <form onSubmit={handleSubmit} noValidate className="login-form">
          <TextInput
            id="login-correo"
            label="Correo institucional"
            type="email"
            value={correo}
            onChange={(e) => alCambiarCorreo(e.target.value)}
            obligatorio
            ayuda="Ejemplo: usuario@upla.edu.pe"
            autoComplete="email"
            inputMode="email"
            readOnly={cargando}
            inputRef={correoRef}
          />

          <TextInput
            id="login-clave"
            label="Contraseña"
            type="password"
            value={contrasena}
            onChange={(e) => alCambiarContrasena(e.target.value)}
            onKeyDown={alVerificarBloqMayus}
            obligatorio
            ayuda="Mínimo 8 caracteres"
            autoComplete="current-password"
            readOnly={cargando}
            inputRef={contrasenaRef}
          />

          {bloqMayusActivo && (
            <p className="aviso-bloq-mayus" role="status">
              ⚠️ Bloq Mayús está activado
            </p>
          )}

          <div className="login-opciones">
            <label className="checkbox-etiqueta">
              <input
                type="checkbox"
                checked={recordarCorreo}
                onChange={(e) => alCambiarRecordarCorreo(e.target.checked)}
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
            <button
              type="button"
              className="enlace-texto"
              onClick={alIrARegistro}
              disabled={cargando}
            >
              Registrarse como solicitante
            </button>
          </p>
        </form>
      </div>

      <div className="login-panel-decorativo" aria-hidden="true">
        <div className="tarjeta-decorativa">
          <h2>Gestión de Ambientes Universitarios</h2>
          <p>Plataforma para laboratorios, auditorios y salas de reuniones de la UPLA Huancayo.</p>
          <ul className="decorativa-lista">
            <li>🛡️ Validación automática de horarios</li>
            <li>⚡ Consulta de disponibilidad en tiempo real</li>
            <li>🏛️ Respaldo institucional oficial</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
