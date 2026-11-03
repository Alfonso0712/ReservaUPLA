using System;
using System.Security.Claims;
using System.Threading.RateLimiting;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ReservaUpla.Domain.Enums;

namespace ReservaUpla.Api.Extensions;

public static class ApiExtensions
{
    public const string CorsPolicyName = "FrontendCors";
    public const string LoginRateLimiterPolicy = "LoginLimiter";

    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var idStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(idStr, out var id) ? id : Guid.Empty;
    }

    public static RolUsuario GetUserRole(this ClaimsPrincipal user)
    {
        var rolStr = user.FindFirstValue(ClaimTypes.Role);
        return Enum.TryParse<RolUsuario>(rolStr, true, out var rol) ? rol : RolUsuario.Solicitante;
    }

    public static IServiceCollection AddFrontendCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(CorsPolicyName, policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                      .AllowCredentials()
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });
        return services;
    }

    public static IServiceCollection AddAuthCookie(this IServiceCollection services, IWebHostEnvironment env)
    {
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.Cookie.Name = "ReservaUpla.Auth";
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.Lax;
                options.Cookie.SecurePolicy = env.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;
                options.Events.OnRedirectToLogin = ctx =>
                {
                    ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };
                options.Events.OnRedirectToAccessDenied = ctx =>
                {
                    ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return Task.CompletedTask;
                };
            });

        services.AddAuthorization();
        return services;
    }

    // E-09
    public static IServiceCollection AddRateLimiting(this IServiceCollection services, IWebHostEnvironment? env = null)
    {
        var limite = env != null && env.IsDevelopment() ? 50 : 5;
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.AddFixedWindowLimiter(LoginRateLimiterPolicy, opt =>
            {
                opt.PermitLimit = limite;
                opt.Window = TimeSpan.FromMinutes(1);
                opt.QueueLimit = 0;
            });
        });
        return services;
    }
}
