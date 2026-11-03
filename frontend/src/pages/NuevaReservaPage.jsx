import SelectInput from '../components/SelectInput';
import DateInput from '../components/DateInput';
import TimeInput from '../components/TimeInput';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import PanelAyuda from '../components/PanelAyuda';
import { IconoCheckCirculo, IconoCandado } from '../components/Iconos';
import { useReservaForm } from '../hooks/useReservaForm';
import { useAmbientes } from '../hooks/useAmbientes';

// RF-03 · RF-04 · RN-01 a RN-04 · Nielsen 10 · Shneiderman 8 · E-12 a E-17
export default function NuevaReservaPage({ alCrearExitoso, ambienteIdInicial = '' }) {
  const { ambientes } = useAmbientes();
  const {
    ambienteId, setAmbienteId,
    fecha, setFecha,
    horaInicio, setHoraInicio,
    horaFin, setHoraFin,
    motivo, setMotivo,
    disponibilidad, cargandoDisponibilidad,
    errores, errorGeneral, cargando,
    fechaRef, horaInicioRef, motivoRef,
    enviar
  } = useReservaForm({ alCrearExitoso, ambienteIdInicial });

  const opcionesAmbientes = ambientes
    .filter((a) => a.estado === 'Disponible')
    .map((a) => ({ valor: a.id, texto: `${a.nombre} (${a.ubicacion})` }));

  return (
    <div className="pagina-formulario-reserva">
      <h1 className="pagina-titulo">Solicitud de Reserva de Ambiente</h1>
      <PanelAyuda id="ayuda-nueva-reserva" titulo="Guía de horarios permitidos (07:00 a 22:00)" />
      <AlertMessage tipo="error" mensaje={errorGeneral} />
      <div className="panel-division">
        <form onSubmit={(e) => { e.preventDefault(); enviar(); }} noValidate className="form-reserva">
          <SelectInput id="res-ambiente" label="Ambiente universitario" value={ambienteId} onChange={(e) => setAmbienteId(e.target.value)} opciones={opcionesAmbientes} error={errores.ambienteId} obligatorio />
          <DateInput id="res-fecha" label="Fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} error={errores.fecha} obligatorio inputRef={fechaRef} />
          <div className="grid-dos-columnas">
            <TimeInput id="res-hin" label="Hora inicio" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} error={errores.horas} obligatorio inputRef={horaInicioRef} />
            <TimeInput id="res-hfi" label="Hora fin" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} error={errores.horaFin} obligatorio />
          </div>
          <TextInput id="res-motivo" label="Motivo académico / institucional" value={motivo} onChange={(e) => setMotivo(e.target.value)} error={errores.motivo} obligatorio ayuda="Mínimo 10 y máximo 500 caracteres" inputRef={motivoRef} />
          <Button type="submit" cargando={cargando}>Registrar Solicitud</Button>
        </form>

        <div className="panel-disponibilidad-lateral" aria-live="polite">
          <h3>Disponibilidad del día</h3>
          {cargandoDisponibilidad && <p role="status">Consultando horarios ocupados...</p>}
          {!cargandoDisponibilidad && disponibilidad && disponibilidad.length === 0 && (
            <p className="texto-disponible"><IconoCheckCirculo size={16} /> Ambiente totalmente disponible en esta fecha.</p>
          )}
          {!cargandoDisponibilidad && disponibilidad && disponibilidad.length > 0 && (
            <ul className="lista-horarios-ocupados">
              {disponibilidad.map((b, i) => (
                <li key={i}><IconoCandado size={14} /> Ocupado: {b.horaInicio} - {b.horaFin} ({b.motivo || 'Reservado'})</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
