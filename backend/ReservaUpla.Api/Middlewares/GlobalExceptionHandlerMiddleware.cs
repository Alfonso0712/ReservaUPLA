using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Api.Middlewares;

// Nielsen 9 · E-15 · E-24 · E-45 a E-49
public class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

    public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DomainException ex)
        {
            context.Response.ContentType = "application/json";

            if (ex.Message == Mensajes.RecursoNoEncontrado)
            {
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
            }
            else if (ex.Message == Mensajes.AccesoDenegado || ex.Message == Mensajes.SoloAdminApruebaRechaza)
            {
                _logger.LogWarning("Denegación de acción por regla de negocio en {Path}", context.Request.Path);
                context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
            }
            else if (ex.EsConflicto)
            {
                context.Response.StatusCode = (int)HttpStatusCode.Conflict;
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }

            var mensajeRespuesta = context.Response.StatusCode == (int)HttpStatusCode.Forbidden
                ? Mensajes.AccesoDenegado
                : ex.Message;

            var payload = JsonSerializer.Serialize(new { error = mensajeRespuesta, mensaje = mensajeRespuesta });
            await context.Response.WriteAsync(payload);
        }
        catch (UnauthorizedAccessException ex)
        {
            context.Response.ContentType = "application/problem+json";
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            var problem = new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = MensajesValidacion.CredencialesNoValidasTitulo,
                Detail = string.IsNullOrWhiteSpace(ex.Message) ? MensajesValidacion.CredencialesNoValidasDetalle : ex.Message
            };
            var payload = JsonSerializer.Serialize(problem);
            await context.Response.WriteAsync(payload);
        }
        catch (Exception ex)
        {
            // E-15: Detalle tecnico exclusivamente en el logger, respuesta uniforme ProblemDetails
            _logger.LogError(ex, "Excepcion no controlada en la API: {Message}", ex.Message);
            context.Response.ContentType = "application/problem+json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            var problem = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = MensajesValidacion.ErrorInternoTitulo,
                Detail = MensajesValidacion.ErrorInternoDetalle
            };
            var payload = JsonSerializer.Serialize(problem);
            await context.Response.WriteAsync(payload);
        }
    }
}
