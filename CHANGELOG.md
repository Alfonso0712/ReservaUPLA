# Registro de Cambios (Changelog)

Todos los cambios notables de **ReservaUPLA** se documentan en este archivo, reconstruido a partir del historial real de commits y etiquetas del repositorio.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto adhiere a [Versionado Semántico (SemVer)](https://semver.org/lang/es/).

---

## [Sin publicar]

### Añadido
- Integración relacional con PostgreSQL (`ReservasUPLA_DB`) mediante Entity Framework Core y Npgsql (`a9e33d2`).
- `DatabaseSeeder` con usuarios de demostración por rol, 20 ambientes del campus UPLA y reservas iniciales (`739411b`).
- Persistencia de preferencias de interfaz por usuario (`tema` claro/oscuro y `tamano_letra` A-/A/A+) en base de datos, backend (`PATCH /api/usuarios/preferencias`) y caché local (`f710f60`).
- Botón **Guía** en la cabecera superior y modal accesible `ModalGuiaNormativa` con las 6 reglas institucionales de reserva, iconografía semántica y pruebas unitarias (`421d129`, `5791688`).
- Paginación por defecto de **5 registros por página** (`[5, 10, 20, 50]`) en las tablas de Reservas y Ambientes junto con suites de pruebas automatizadas (`1c609cc`).
- Sistema de tokens semánticos de `border-radius`, rediseño visual del Panel de Indicadores (`CardIndicador`, métricas de ocupación y atención) y vista de detalle de reserva en dos columnas (`3583ad5`, `3614ea3`, `10c5a51`).
- Documentación operativa (`README.md`, `CHANGELOG.md`, `backend/README-seguridad.md`), contenedorización Docker (`Dockerfile` multi-stage y `docker-compose.yml`) y flujo de Integración Continua en GitHub Actions.

### Cambiado
- Unificación de la identidad visual del navegador (`ReservaUPLA`) y favicon institucional UPLA (`ddf7681`).
- Refactorización de componentes reutilizables en frontend (filtros, *toasts*, modales y enrutador mock basado en tabla) y encapsulamiento de invariantes de dominio con `IActor` e introducción de objetos de parámetros en backend (`709c64b`, `ff74cdc`, `8891340`, `e6d98ed`).
- Optimización de distribución de columnas, encabezados centrados en columna de acciones y soporte multilínea sin desborde horizontal en las tablas de Reservas y Ambientes (`775493f`, `c16774a`, `9a95d4a`, `6ff3bc4`).

### Corregido
- Corrección del cierre inmediato del modal de Guía al abrirlo difiriendo la suscripción del evento de clic en `document` (`7890c21`).
- Corrección del filtrado combinado por buscador de texto (solicitante o ambiente) y rango de fechas en el listado de reservas (`6b8ad9c`).
- Desempate determinístico alfabético en el indicador "Ambiente más utilizado" del Dashboard y alineación de pruebas de frontend con los textos vigentes de la interfaz (`62d63ff`).
- Alineación de propiedades de indicadores entre la API y el Panel, mapeo de responsables en relaciones de reservas y visualización de acciones según rol (`59dbd47`, `cbe6e7c`, `187a13e`, `dc574bd`).

### Seguridad
- Extracción de credenciales de conexión del repositorio (`appsettings.json`, `appsettings.Development.json` y `AppDbContextFactory.cs`) hacia `dotnet user-secrets` y variables de entorno (`5649671`).
- Creación del script SQL [`backend/scripts/crear_rol_app.sql`](backend/scripts/crear_rol_app.sql) para el rol de mínimo privilegio `reservas_app` (`SELECT`, `INSERT`, `UPDATE`, sin `DELETE`, `DDL` ni `SUPERUSER`) (`fddad31`).
- Incorporación del hook [`docs/hooks/pre-commit`](docs/hooks/pre-commit) y reglas en `.gitignore` para bloquear la subida accidental de secretos y respaldos de base de datos (`831c2ff`).
- Restricción `CHECK (cap_ambiente > 0)` (`CK_ambientes_cap_ambiente`) y restricciones `CHECK` para preferencias de usuario en PostgreSQL (`f710f60`, `62d63ff`).
- Revocación del permiso de creación de reservas para el rol `Administrador` en backend y frontend, garantizando separación de funciones (`2d7c71a`).

---

## [0.9.0] - 2026-11-04

### Añadido
- Rediseño de cabecera principal y menú desplegable de usuario con soporte de teclado y atributos de accesibilidad (`E-34` a `E-38`) (`28c9085`).
- Fondo isométrico con red de partículas, tarjeta flotante y lista institucional con iconografía en las vistas de acceso y registro (`7ba59d3`, `8f242f4`, `2880291`).

### Cambiado
- Reubicación de controles de tema y escala tipográfica en las pantallas de inicio de sesión y registro de solicitante (`ab266fc`, `615d537`, `9784a4a`).
- Simplificación de textos de ayuda, retiro del campo recordar correo y sustitución de la etiqueta `(obligatorio)` por asterisco semántico (`c1b3ea6`, `3fd6feb`, `6023320`).

---

## [0.8.0] - 2026-11-04

### Añadido
- Script verificador de CSS compilado (`verificarCss.js`) y prueba de integración del componente raíz `App` (`d6a6095`).

### Corregido
- Mapeo de dimensiones de controles y capas de apilamiento (`z-index`) en el sistema de diseño (`23a27d1`).
- Garantía de activación del adaptador mock por defecto en pruebas y preservación de estado controlado en enlaces de navegación (`3a90fe5`).

---

## [0.7.0] - 2026-11-03

### Añadido
- Suite de pruebas automatizadas de frontend para los escenarios `E-01` a `E-33` con Vitest y Testing Library (`8f8d055`).

### Cambiado
- Compactación y organización de archivos de prueba bajo el límite de 80 líneas por módulo (`9961380`).

---

## [0.6.0] - 2026-11-03

### Cambiado
- Modularización integral de componentes de interfaz, hooks y utilidades puras bajo el estándar de máximo 80 líneas por archivo (`78b3088`).

---

## [0.5.0] - 2026-11-03

### Cambiado
- Pasada completa de usabilidad y accesibilidad conforme a **WCAG 2.2 AA** (`E-25`, `E-26`): gestión de foco en navegación, regiones `aria-live`, trampa de foco en modales y navegación por teclado (`5ced808`).

---

## [0.4.0] - 2026-11-03

### Añadido
- Implementación de páginas de negocio para Panel de Indicadores, Listado y Detalle de Reservas, Catálogo de Ambientes y modales de creación y confirmación (`RF-02` a `RF-08`) (`c0619ac`).

---

## [0.3.0] - 2026-11-03

### Añadido
- Layouts de aplicación (`AuthLayout`, `AppLayout`), sistema de rutas protegidas, proveedor de sesión `AuthProvider` y flujo de ingreso y registro (`RF-01`, `E-07`) (`fe94e9f`).

---

## [0.2.0] - 2026-11-03

### Añadido
- Controles de formulario reutilizables (`TextInput`, `SelectInput`, `PasswordInput`, `TextareaInput`) y validadores para las reglas de validación `RV-01` a `RV-16` (`22f9293`).

---

## [0.1.0] - 2026-11-03

### Añadido
- Sistema de diseño base, tokens CSS para modo claro/oscuro, escalado tipográfico y componentes primitivos de interfaz (`Button`, `Badge`, `AlertMessage`, `EstadoVacio`, `TableList`) (`E-29`) (`1ad7ea3`).

---

## [0.0.0] - 2026-11-03

### Añadido
- Inicialización de la solución backend ASP.NET Core 8 bajo Clean Architecture (`Domain`, `Application`, `Infrastructure`, `Api`, `Tests`) y estructura base de frontend React + Vite + Tailwind CSS + ESLint (`449309c`, `88762d0`, `c7b34fe`).
- Implementación inicial de casos de uso del backend, controladores REST, autenticación por cookies `HttpOnly`, *Rate Limiting* en login y suite de pruebas backend/frontend (`88762d0`, `7641e8e`).
- Rediseño del flujo de inicio de sesión y registro con identidad institucional UPLA (`9bcdef7`, `354d5e9`, `b3e5ab2`).

### Cambiado
- Separación de DTOs en archivos individuales según convención de C# y centralización de extracción de claims en `ApiExtensions` (`c90e129`, `a1491b2`).
- Reestructuración del directorio `src` a `backend` y configuración del puerto `5000` con proxy en Vite (`deaad02`, `7768fd0`).

### Corregido
- Vinculación de eventos `onChange` en el formulario de inicio de sesión y ajustes de alineación vertical en registro (`cf9583b`, `e9d179a`).
