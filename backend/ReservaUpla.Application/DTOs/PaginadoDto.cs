using System.Collections.Generic;

namespace ReservaUpla.Application.DTOs;

public record PaginadoDto<T>(
    IReadOnlyList<T> Items,
    int TotalItems,
    int Pagina,
    int TamanoPagina);
