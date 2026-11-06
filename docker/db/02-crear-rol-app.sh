#!/usr/bin/env sh
# =============================================================================
# ReservaUPLA · Inicialización automática del rol de mínimo privilegio en Docker
# Ejecuta backend/scripts/crear_rol_app.sql reemplazando el marcador por DB_APP_PASSWORD
# =============================================================================
set -eu

if [ -z "${DB_APP_PASSWORD:-}" ] || [ "${DB_APP_PASSWORD}" = "<CONTRASENA_AQUI>" ]; then
    echo "ERROR: Debe definir DB_APP_PASSWORD con un valor real en su archivo .env." >&2
    exit 1
fi

sed "s|<CONTRASENA_AQUI>|${DB_APP_PASSWORD}|g" /docker/crear_rol_app.sql \
    | psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" --dbname "${POSTGRES_DB}"
