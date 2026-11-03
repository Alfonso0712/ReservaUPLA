using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ReservaUpla.Application.DTOs;
using ReservaUpla.Application.Interfaces;
using ReservaUpla.Application.Mappers;
using ReservaUpla.Domain.Constants;
using ReservaUpla.Domain.Entities;
using ReservaUpla.Domain.Enums;
using ReservaUpla.Domain.Exceptions;

namespace ReservaUpla.Application.Services;

// RF-02 · RF-04 · RV-04 a RV-07 · RV-13 · RV-14 · E-10 · E-11
public class AmbienteService : IAmbienteService
{
    private readonly IAmbienteRepository _ambienteRepo;
    private readonly IReservaRepository _reservaRepo;
    private readonly IUsuarioRepository _usuarioRepo;
    private readonly IUnitOfWork _unitOfWork;

    public AmbienteService(
        IAmbienteRepository ambienteRepo,
        IReservaRepository reservaRepo,
        IUsuarioRepository usuarioRepo,
        IUnitOfWork unitOfWork)
    {
        _ambienteRepo = ambienteRepo;
        _reservaRepo = reservaRepo;
        _usuarioRepo = usuarioRepo;
        _unitOfWork = unitOfWork;
    }

    public async Task<AmbienteDto> RegistrarAmbienteAsync(CrearAmbienteDto dto, CancellationToken ct = default)
    {
        if (!Enum.TryParse<TipoAmbiente>(dto.Tipo, true, out var tipo))
            throw new DomainException(Mensajes.AmbienteTipoInvalido);

        var ambiente = Ambiente.Crear(dto.Nombre, tipo, dto.Capacidad, dto.Ubicacion, dto.ResponsableId);
        await _ambienteRepo.AgregarAsync(ambiente, ct);
        await _unitOfWork.GuardarCambiosAsync(ct);

        return AmbienteMapper.ToDto(ambiente);
    }

    public async Task<IReadOnlyList<AmbienteDto>> ListarAmbientesAsync(Guid? responsableId = null, CancellationToken ct = default)
    {
        var lista = await _ambienteRepo.ListarAsync(responsableId, ct);
        var resultado = new List<AmbienteDto>(lista.Count);

        foreach (var amb in lista)
        {
            string? nombreResp = null;
            if (amb.Idr_Ambiente.HasValue)
            {
                var resp = await _usuarioRepo.ObtenerPorIdAsync(amb.Idr_Ambiente.Value, ct);
                nombreResp = resp?.Nom_Usuario;
            }
            resultado.Add(AmbienteMapper.ToDto(amb, nombreResp));
        }

        return resultado;
    }

    public async Task<DisponibilidadAmbienteDto> ConsultarDisponibilidadAsync(Guid ambienteId, DateOnly fecha, CancellationToken ct = default)
    {
        var amb = await _ambienteRepo.ObtenerPorIdAsync(ambienteId, ct);
        if (amb == null)
            throw new DomainException(Mensajes.AmbienteNoExiste);

        var reservas = await _reservaRepo.ObtenerPorAmbienteYFechaAsync(ambienteId, fecha, ct);
        var bloques = reservas
            .Where(r => r.Est_Reserva == EstadoReserva.Aprobada)
            .OrderBy(r => r.Hin_Reserva)
            .Select(r => new BloqueDisponibilidadDto(r.Hin_Reserva, r.Hfi_Reserva, r.Est_Reserva.ToString(), r.Mot_Reserva))
            .ToList();

        return new DisponibilidadAmbienteDto(amb.Id_Ambiente, amb.Nom_Ambiente, fecha, bloques);
    }
}
