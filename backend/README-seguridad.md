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
