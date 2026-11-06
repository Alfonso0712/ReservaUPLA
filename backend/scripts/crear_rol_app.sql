-- =============================================================================
-- ReservaUPLA · Script de creación de rol de aplicación con privilegios mínimos
-- Ejecutar conectado con un rol administrador (ej. postgres) sobre ReservasUPLA_DB
-- IMPORTANTE: Reemplazar <CONTRASENA_AQUI> antes de ejecutar en PostgreSQL.
-- =============================================================================

-- 1. Crear el rol de aplicación sin privilegios de superusuario, creación de BD ni roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'reservas_app') THEN
        CREATE ROLE reservas_app WITH
            LOGIN
            NOSUPERUSER
            NOCREATEDB
            NOCREATEROLE
            NOINHERIT
            NOREPLICATION
            PASSWORD '<CONTRASENA_AQUI>';
    END IF;
END
$$;

-- 2. Permitir conexión exclusivamente a la base de datos de la aplicación
GRANT CONNECT ON DATABASE "ReservasUPLA_DB" TO reservas_app;

-- (Conectarse a ReservasUPLA_DB antes de ejecutar las sentencias de esquema: \c "ReservasUPLA_DB")

-- 3. Permitir uso del esquema public, pero revocar creación de objetos (sin DDL)
GRANT USAGE ON SCHEMA public TO reservas_app;
REVOKE CREATE ON SCHEMA public FROM reservas_app;

-- 4. Otorgar únicamente SELECT, INSERT y UPDATE sobre tablas existentes
--    (incluye usuarios, ambientes, reservas y lectura de __EFMigrationsHistory; sin DELETE ni TRUNCATE)
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO reservas_app;
REVOKE DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM reservas_app;

-- 5. Otorgar USAGE y SELECT en secuencias existentes (si aplican)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO reservas_app;

-- 6. Configurar privilegios por defecto para tablas y secuencias futuras creadas en public
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE ON TABLES TO reservas_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO reservas_app;
