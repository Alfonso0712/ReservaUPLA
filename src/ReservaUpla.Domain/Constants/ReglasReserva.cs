using System;

namespace ReservaUpla.Domain.Constants;

public static class ReglasReserva
{
    // RN-04 · RV-11
    public static readonly TimeSpan HoraApertura = new(7, 0, 0);
    public static readonly TimeSpan HoraCierre = new(22, 0, 0);

    // RV-12
    public const int MinLongitudMotivo = 10;
    public const int MaxLongitudMotivo = 500;

    // RN-01 · RV-14 · E-17
    public static bool HayConflictoHorario(TimeSpan inicio1, TimeSpan fin1, TimeSpan inicio2, TimeSpan fin2)
    {
        return inicio1 < fin2 && fin1 > inicio2;
    }
}
