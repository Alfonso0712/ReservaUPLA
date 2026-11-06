# Guía de Configuración Segura — ReservaUPLA Backend

Este documento describe cómo configurar la conexión a PostgreSQL sin almacenar contraseñas ni secretos en el repositorio.

## 1. Configuración en Desarrollo (`dotnet user-secrets`)

El proyecto `ReservaUpla.Api` utiliza **User Secrets** de .NET para mantener las credenciales fuera del control de versiones. Ejecute los siguientes comandos desde la raíz del repositorio:

```bash
dotnet user-secrets init --project backend/ReservaUpla.Api
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=ReservasUPLA_DB;Username=reservas_app;Password=<CONTRASENA_AQUI>" --project backend/ReservaUpla.Api
```

> Reemplace `<CONTRASENA_AQUI>` por la contraseña real asignada al rol `reservas_app` en su entorno local.

## 2. Configuración en Producción (Variables de Entorno)

En entornos de producción o integración continua, configure la variable de entorno nativa de ASP.NET Core `ConnectionStrings__DefaultConnection` (con doble guion bajo `__`):

### Linux / macOS (bash)
```bash
export ConnectionStrings__DefaultConnection="Host=<HOST_BD>;Port=5432;Database=ReservasUPLA_DB;Username=reservas_app;Password=<CONTRASENA_AQUI>;SslMode=Require"
```

### Windows (PowerShell)
```powershell
$env:ConnectionStrings__DefaultConnection = "Host=<HOST_BD>;Port=5432;Database=ReservasUPLA_DB;Username=reservas_app;Password=<CONTRASENA_AQUI>;SslMode=Require"
```

## 3. Requisitos de Transporte Seguro (SSL/TLS)

En producción, la cadena de conexión **debe incluir obligatoriamente `SslMode=Require`** (o `SslMode=VerifyFull` cuando se cuenta con certificado de autoridad certificadora) para garantizar que las credenciales y los datos viajen cifrados entre la API y PostgreSQL.

## 4. Rol de Base de Datos de Menor Privilegio (`reservas_app`) y Migraciones

La API en tiempo de ejecución **no debe conectarse con el superusuario `postgres`**. Debe utilizar el rol restringido `reservas_app` definido en `backend/scripts/crear_rol_app.sql`, el cual cuenta únicamente con `CONNECT`, `USAGE` sobre `public` y `SELECT, INSERT, UPDATE` sobre las tablas (sin `DELETE`, sin `DDL` ni `SUPERUSER`).

### Separación entre ejecución de migraciones y ejecución de la API

En `Program.cs` (líneas 48–53), la aplicación invoca `dbContext.Database.MigrateAsync()` y `seeder.SeedAsync()` al iniciar:

- **Si existen migraciones pendientes (DDL)**: `reservas_app` no posee permisos `CREATE` ni `ALTER` en el esquema `public`. Por ello, toda creación o migración de esquema (`CREATE TABLE`, `ALTER TABLE`, restricciones `CHECK` como `CK_ambientes_cap_ambiente`) **debe aplicarse previamente con un rol administrador de esquema** antes de iniciar la API:
  ```bash
  ConnectionStrings__DefaultConnection="Host=localhost;Port=5432;Database=ReservasUPLA_DB;Username=postgres;Password=<CONTRASENA_AQUI>" dotnet ef database update --project backend/ReservaUpla.Infrastructure --startup-project backend/ReservaUpla.Api
  ```
- **En tiempo de ejecución de la API**: una vez aplicadas las migraciones, `MigrateAsync()` únicamente consulta `SELECT` sobre `__EFMigrationsHistory`, verifica que no hay cambios de esquema pendientes y no ejecuta ninguna instrucción DDL. Las restricciones de integridad (`CK_ambientes_cap_ambiente`, `CK_usuarios_tema`, `CK_usuarios_tamano_letra`, `UNIQUE` y claves foráneas) y el `DatabaseSeeder` operan exclusivamente con `SELECT`, `INSERT` y `UPDATE`.

