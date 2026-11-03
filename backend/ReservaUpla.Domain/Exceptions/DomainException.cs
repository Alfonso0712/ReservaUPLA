using System;

namespace ReservaUpla.Domain.Exceptions;

// Excepcion base para violaciones de reglas del dominio
public class DomainException : Exception
{
    public bool EsConflicto { get; }

    public DomainException(string mensaje, bool esConflicto = false) : base(mensaje)
    {
        EsConflicto = esConflicto;
    }
}
