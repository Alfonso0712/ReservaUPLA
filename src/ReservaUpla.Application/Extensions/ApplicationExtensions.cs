using Microsoft.Extensions.DependencyInjection;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Services;

namespace ReservaUpla.Application.Extensions;

public static class ApplicationExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUsuarioService, UsuarioService>();
        services.AddScoped<IAmbienteService, AmbienteService>();
        services.AddScoped<IReservaService, ReservaService>();

        return services;
    }
}
