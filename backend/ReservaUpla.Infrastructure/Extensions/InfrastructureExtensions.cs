using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Infrastructure.Data;
using ReservaUpla.Infrastructure.Repositories;
using ReservaUpla.Infrastructure.Security;

namespace ReservaUpla.Infrastructure.Extensions;

public static class InfrastructureExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<AppDbContext>(options =>
        {
            if (string.IsNullOrWhiteSpace(connectionString) || connectionString.Contains("TU_PASSWORD_AQUI"))
            {
                options.UseInMemoryDatabase("ReservaUplaInMemoryDb");
            }
            else
            {
                options.UseNpgsql(connectionString);
            }
        });

        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IAmbienteRepository, AmbienteRepository>();
        services.AddScoped<IReservaRepository, ReservaRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddSingleton<IPasswordHasherService, PasswordHasherService>();
        services.AddScoped<DatabaseSeeder>();

        return services;
    }
}
