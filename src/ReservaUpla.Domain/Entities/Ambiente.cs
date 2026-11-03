using System;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Domain.Entities;

public class Ambiente
{
    public Guid Id_Ambiente { get; private set; }
    public string Nom_Ambiente { get; private set; } = string.Empty;
    public TipoAmbiente Tip_Ambiente { get; private set; }
    public int Cap_Ambiente { get; private set; }
    public string Ubi_Ambiente { get; private set; } = string.Empty;
    public EstadoAmbiente Est_Ambiente { get; private set; }
    public Guid? Idr_Ambiente { get; private set; }

    // Constructor privado para EF Core
    private Ambiente() { }

    // RF-02 · RV-04 · RV-05 · RV-06 · RV-07 · E-10 · E-11
    public static Ambiente Crear(string nombre, TipoAmbiente tipo, int capacidad, string ubicacion, Guid? responsableId = null)
    {
        var nombreLimpio = nombre?.Trim() ?? string.Empty;
        var ubicacionLimpia = ubicacion?.Trim() ?? string.Empty;

        ValidarCampos(nombreLimpio, capacidad, ubicacionLimpia);

        return new Ambiente
        {
            Id_Ambiente = Guid.NewGuid(),
            Nom_Ambiente = nombreLimpio,
            Tip_Ambiente = tipo,
            Cap_Ambiente = capacidad,
            Ubi_Ambiente = ubicacionLimpia,
            Est_Ambiente = EstadoAmbiente.Disponible,
            Idr_Ambiente = responsableId
        };
    }

    public void ActualizarEstado(EstadoAmbiente nuevoEstado)
    {
        Est_Ambiente = nuevoEstado;
    }

    public void AsignarResponsable(Guid? responsableId)
    {
        Idr_Ambiente = responsableId;
    }

    private static void ValidarCampos(string nombre, int capacidad, string ubicacion)
    {
        if (string.IsNullOrWhiteSpace(nombre) || nombre.Length > ReglasAmbiente.MaxLongitudNombre)
            throw new DomainException(Mensajes.AmbienteNombreRequerido);

        if (capacidad < ReglasAmbiente.MinCapacidad || capacidad > ReglasAmbiente.MaxCapacidad)
            throw new DomainException(Mensajes.AmbienteCapacidadInvalida);

        if (string.IsNullOrWhiteSpace(ubicacion) || ubicacion.Length > ReglasAmbiente.MaxLongitudUbicacion)
            throw new DomainException(Mensajes.AmbienteUbicacionRequerida);
    }
}
