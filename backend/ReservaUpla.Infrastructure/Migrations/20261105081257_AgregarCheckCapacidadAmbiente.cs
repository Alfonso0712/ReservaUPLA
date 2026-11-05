using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReservaUpla.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregarCheckCapacidadAmbiente : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_ambientes_cap_ambiente",
                table: "ambientes",
                sql: "cap_ambiente > 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_ambientes_cap_ambiente",
                table: "ambientes");
        }
    }
}
