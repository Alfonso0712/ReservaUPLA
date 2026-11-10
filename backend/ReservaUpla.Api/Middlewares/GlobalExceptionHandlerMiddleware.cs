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

            if (ex.Message == Mensajes.RecursoNoEncontrado || ex.Message == Mensajes.UsuarioNoExiste || ex.Message == Mensajes.AmbienteNoExiste)
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
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            var payload = JsonSerializer.Serialize(new { error = ex.Message, mensaje = ex.Message });
            await context.Response.WriteAsync(payload);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error no controlado procesando la solicitud en {Path}", context.Request.Path);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var problemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Error interno del servidor",
                Detail = MensajesValidacion.ErrorInternoDetalle,
                Instance = context.Request.Path
            };

            var payload = JsonSerializer.Serialize(problemDetails);
            await context.Response.WriteAsync(payload);
        }
    }
}
