using System;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Domain.Entities;

public class Reserva
{
    public Guid Id_Reserva { get; private set; }
    public DateOnly Fec_Reserva { get; private set; }
    public TimeSpan Hin_Reserva { get; private set; }
    public TimeSpan Hfi_Reserva { get; private set; }
    public string Mot_Reserva { get; private set; } = string.Empty;
    public EstadoReserva Est_Reserva { get; private set; }
    public Guid Idu_Reserva { get; private set; }
    public Guid Ida_Reserva { get; private set; }
    public DateTime Fre_Reserva { get; private set; }

    // Constructor privado para EF Core
    private Reserva() { }

    // RF-03 · RN-02 · RN-03 · RN-04 · RV-08 · RV-09 · RV-10 · RV-11 · RV-12 · E-12 · E-13 · E-14 · E-15 · E-16
    public static Reserva Crear(
        DateOnly fecha,
        TimeSpan horaInicio,
        TimeSpan horaFin,
        string motivo,
        Guid solicitanteId,
        Guid ambienteId,
        DateOnly? fechaReferenciaHoy = null)
    {
        var motivoLimpio = motivo?.Trim() ?? string.Empty;
        var hoy = fechaReferenciaHoy ?? DateOnly.FromDateTime(DateTime.UtcNow);

        ValidarHorarioYFecha(fecha, horaInicio, horaFin, hoy);
        ValidarMotivo(motivoLimpio);

        return new Reserva
        {
            Id_Reserva = Guid.NewGuid(),
            Fec_Reserva = fecha,
            Hin_Reserva = horaInicio,
            Hfi_Reserva = horaFin,
            Mot_Reserva = motivoLimpio,
            Est_Reserva = EstadoReserva.Pendiente,
            Idu_Reserva = solicitanteId,
            Ida_Reserva = ambienteId,
            Fre_Reserva = DateTime.UtcNow
        };
    }

    // RF-07 · RN-05 · RN-06 · RV-15 · RV-16 · RV-17 · E-18 · E-19 · E-20 · E-21
    public void CambiarEstado(EstadoReserva nuevoEstado, RolUsuario rolActor, Guid usuarioIdActor)
    {
        if (Est_Reserva == EstadoReserva.Rechazada || Est_Reserva == EstadoReserva.Cancelada)
            throw new DomainException(Mensajes.ReservaRechazadaInmodificable);

        if (nuevoEstado == EstadoReserva.Aprobada || nuevoEstado == EstadoReserva.Rechazada)
        {
            if (rolActor != RolUsuario.Administrador)
                throw new DomainException(Mensajes.SoloAdminApruebaRechaza);

            if (Est_Reserva != EstadoReserva.Pendiente)
                throw new DomainException(Mensajes.TransicionEstadoInvalida);
        }
        else if (nuevoEstado == EstadoReserva.Cancelada)
        {
            if (rolActor == RolUsuario.Solicitante && usuarioIdActor != Idu_Reserva)
                throw new DomainException(Mensajes.SolicitanteSoloCancelaPropias);
        }
        else
        {
            throw new DomainException(Mensajes.TransicionEstadoInvalida);
        }

        Est_Reserva = nuevoEstado;
    }

    private static void ValidarHorarioYFecha(DateOnly fecha, TimeSpan inicio, TimeSpan fin, DateOnly hoy)
    {
        if (fecha < hoy)
            throw new DomainException(Mensajes.FechaPasada);

        if (fin <= inicio)
            throw new DomainException(Mensajes.FinMayorInicio);

        if (inicio < ReglasReserva.HoraApertura || fin > ReglasReserva.HoraCierre)
            throw new DomainException(Mensajes.RangoHorarioInvalido);
    }

    private static void ValidarMotivo(string motivo)
    {
        if (string.IsNullOrWhiteSpace(motivo) ||
            motivo.Length < ReglasReserva.MinLongitudMotivo ||
            motivo.Length > ReglasReserva.MaxLongitudMotivo)
            throw new DomainException(Mensajes.MotivoLongitud);
    }
}
