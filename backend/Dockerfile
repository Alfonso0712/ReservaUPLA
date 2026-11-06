# =============================================================================
# Etapa 1: Compilación y publicación (.NET 8 SDK)
# =============================================================================
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src

# Copiar archivos de proyecto para aprovechar caché de capas en restore
COPY ["ReservaUpla.Domain/ReservaUpla.Domain.csproj", "ReservaUpla.Domain/"]
COPY ["ReservaUpla.Application/ReservaUpla.Application.csproj", "ReservaUpla.Application/"]
COPY ["ReservaUpla.Infrastructure/ReservaUpla.Infrastructure.csproj", "ReservaUpla.Infrastructure/"]
COPY ["ReservaUpla.Api/ReservaUpla.Api.csproj", "ReservaUpla.Api/"]

RUN dotnet restore "ReservaUpla.Api/ReservaUpla.Api.csproj"

# Copiar el código fuente restante y publicar en modo Release
COPY . .
RUN dotnet publish "ReservaUpla.Api/ReservaUpla.Api.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# =============================================================================
# Etapa 2: Imagen final de ejecución (ASP.NET Core 8 Runtime · Usuario no-root)
# =============================================================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime
WORKDIR /app

# Eliminar cualquier credencial accidental en archivos de configuración base
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000 \
    DOTNET_RUNNING_IN_CONTAINER=true

EXPOSE 5000

# Ejecutar bajo el usuario sin privilegios provisto por la imagen oficial de .NET 8
USER $APP_UID

ENTRYPOINT ["dotnet", "ReservaUpla.Api.dll"]
