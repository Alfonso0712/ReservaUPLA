CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261103163834_MigracionInicial') THEN
    CREATE TABLE usuarios (
        id_usuario uuid NOT NULL,
        nom_usuario character varying(150) NOT NULL,
        cor_usuario character varying(150) NOT NULL,
        has_usuario text NOT NULL,
        rol_usuario character varying(50) NOT NULL,
        act_usuario boolean NOT NULL,
        CONSTRAINT "PK_usuarios" PRIMARY KEY (id_usuario)
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261103163834_MigracionInicial') THEN
    CREATE TABLE ambientes (
        id_ambiente uuid NOT NULL,
        nom_ambiente character varying(100) NOT NULL,
        tip_ambiente character varying(50) NOT NULL,
        cap_ambiente integer NOT NULL,
        ubi_ambiente character varying(100) NOT NULL,
        est_ambiente character varying(30) NOT NULL,
        idr_ambiente uuid,
        CONSTRAINT "PK_ambientes" PRIMARY KEY (id_ambiente),
        CONSTRAINT "FK_ambientes_usuarios_idr_ambiente" FOREIGN KEY (idr_ambiente) REFERENCES usuarios (id_usuario) ON DELETE SET NULL
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261103163834_MigracionInicial') THEN
    CREATE TABLE reservas (
        id_reserva uuid NOT NULL,
        fec_reserva date NOT NULL,
        hin_reserva interval NOT NULL,
        hfi_reserva interval NOT NULL,
        mot_reserva text NOT NULL,
        est_reserva character varying(30) NOT NULL,
        idu_reserva uuid NOT NULL,
        ida_reserva uuid NOT NULL,
        fre_reserva timestamp with time zone NOT NULL,
        CONSTRAINT "PK_reservas" PRIMARY KEY (id_reserva),
        CONSTRAINT "FK_reservas_ambientes_ida_reserva" FOREIGN KEY (ida_reserva) REFERENCES ambientes (id_ambiente) ON DELETE RESTRICT,
        CONSTRAINT "FK_reservas_usuarios_idu_reserva" FOREIGN KEY (idu_reserva) REFERENCES usuarios (id_usuario) ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261103163834_MigracionInicial') THEN
    CREATE INDEX "IX_ambientes_idr_ambiente" ON ambientes (idr_ambiente);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261103163834_MigracionInicial') THEN
    CREATE INDEX "IX_reservas_ida_reserva_fec_reserva_est_reserva" ON reservas (ida_reserva, fec_reserva, est_reserva);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261103163834_MigracionInicial') THEN
    CREATE INDEX "IX_reservas_idu_reserva" ON reservas (idu_reserva);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261103163834_MigracionInicial') THEN
    CREATE UNIQUE INDEX "IX_usuarios_cor_usuario" ON usuarios (cor_usuario);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261103163834_MigracionInicial') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20261103163834_MigracionInicial', '8.0.11');
    END IF;
END $EF$;
COMMIT;

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261105071329_AgregarPreferenciasUsuario') THEN
    ALTER TABLE usuarios ALTER COLUMN cor_usuario TYPE character varying(254);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261105071329_AgregarPreferenciasUsuario') THEN
    ALTER TABLE usuarios ADD tamano_letra character varying(20) NOT NULL DEFAULT 'normal';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261105071329_AgregarPreferenciasUsuario') THEN
    ALTER TABLE usuarios ADD tema character varying(20) NOT NULL DEFAULT 'claro';
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261105071329_AgregarPreferenciasUsuario') THEN
    ALTER TABLE usuarios ADD CONSTRAINT "CK_usuarios_tamano_letra" CHECK (tamano_letra IN ('pequeno', 'normal', 'grande'));
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261105071329_AgregarPreferenciasUsuario') THEN
    ALTER TABLE usuarios ADD CONSTRAINT "CK_usuarios_tema" CHECK (tema IN ('claro', 'oscuro'));
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261105071329_AgregarPreferenciasUsuario') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20261105071329_AgregarPreferenciasUsuario', '8.0.11');
    END IF;
END $EF$;
COMMIT;

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261105081257_AgregarCheckCapacidadAmbiente') THEN
    ALTER TABLE ambientes ADD CONSTRAINT "CK_ambientes_cap_ambiente" CHECK (cap_ambiente > 0);
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20261105081257_AgregarCheckCapacidadAmbiente') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20261105081257_AgregarCheckCapacidadAmbiente', '8.0.11');
    END IF;
END $EF$;
COMMIT;

