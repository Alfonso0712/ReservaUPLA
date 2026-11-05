using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservaUpla.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregarPreferenciasUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "cor_usuario",
                table: "usuarios",
                type: "character varying(254)",
                maxLength: 254,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(150)",
                oldMaxLength: 150);

            migrationBuilder.AddColumn<string>(
                name: "tamano_letra",
                table: "usuarios",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "normal");

            migrationBuilder.AddColumn<string>(
                name: "tema",
                table: "usuarios",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "claro");

            migrationBuilder.AddCheckConstraint(
                name: "CK_usuarios_tamano_letra",
                table: "usuarios",
                sql: "tamano_letra IN ('pequeno', 'normal', 'grande')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_usuarios_tema",
                table: "usuarios",
                sql: "tema IN ('claro', 'oscuro')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_usuarios_tamano_letra",
                table: "usuarios");

            migrationBuilder.DropCheckConstraint(
                name: "CK_usuarios_tema",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "tamano_letra",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "tema",
                table: "usuarios");

            migrationBuilder.AlterColumn<string>(
                name: "cor_usuario",
                table: "usuarios",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(254)",
                oldMaxLength: 254);
        }
    }
}
