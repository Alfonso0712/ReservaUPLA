// RF-08 · E-30 · CardIndicador con icono SVG propio, texto y valor
export default function CardIndicador({
  titulo,
  valor,
  icono,
  tipo = 'neutro',
  descripcion
}) {
  return (
    <div className={`card-indicador card-indicador-${tipo}`}>
      <div className="card-indicador-encabezado">
        <span className="card-indicador-icono" aria-hidden="true">{icono}</span>
        <h3 className="card-indicador-titulo">{titulo}</h3>
      </div>
      <div className="card-indicador-cuerpo">
        <span className="card-indicador-valor">{valor}</span>
        {descripcion && <p className="card-indicador-desc">{descripcion}</p>}
      </div>
    </div>
  );
}
