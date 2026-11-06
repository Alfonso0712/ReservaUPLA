using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ReservaUpla.Infrastructure.Data;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public const string VariableConexion = "ConnectionStrings__DefaultConnection";

    public AppDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable(VariableConexion);

        if (string.IsNullOrWhiteSpace(connectionString)
            || connectionString.Contains("<CONTRASENA_AQUI>", StringComparison.OrdinalIgnoreCase)
            || connectionString.Contains("TU_PASSWORD_AQUI", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                $"No se encontró una cadena de conexión válida para tiempo de diseño. Configure la variable de entorno '{VariableConexion}' antes de ejecutar comandos de EF Core.");
        }

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new AppDbContext(optionsBuilder.Options);
    }
}
