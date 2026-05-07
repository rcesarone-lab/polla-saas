import { useJornada } from "../hooks/useJornada";
import { useJugadas } from "../hooks/useJugadas";
import { calcularPuntaje } from "../domain/scoring";
import { getResultadoByJornada } from "../services/resultados.service";
import { getCarrerasByJornada } from "../services/carreras.service";
import {
  calcularEstadoJornada,
  calcularProgresoJornada,
  getEstadoJornadaClass,
  getEstadoJornadaLabel,
} from "../domain/jornadaStatus";

export const Historico = () => {
  const { jornadas, changeJornada } = useJornada();
  const { jugadas } = useJugadas();

  return (
    <div>
      <h1>Histórico de jornadas</h1>

      <div className="card">
        {jornadas.length === 0 ? (
          <p>No hay jornadas cargadas.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Total jugadas</th>
                <th>Progreso</th>
                <th>Estado</th>
                <th>Ganador</th>
                <th>Puntos</th>
                <th>Finalización</th>
                <th>Reaperturas</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {jornadas.map((jornada) => {
                const jugadasDeLaJornada = jugadas.filter(
                  (jugada) => jugada.jornadaId === jornada.id
                );

                const resultado = getResultadoByJornada(jornada.id);

                const carrerasDeLaJornada = getCarrerasByJornada(jornada.id);

                const estadoJornada = calcularEstadoJornada(carrerasDeLaJornada, resultado);

                const progresoJornada = calcularProgresoJornada(carrerasDeLaJornada, resultado);

                const ranking = resultado
                  ? jugadasDeLaJornada
                    .map((jugada) => ({
                      nombre: jugada.nombre,
                      puntos: calcularPuntaje(jugada, resultado),
                    }))
                    .sort((a, b) => b.puntos - a.puntos)
                  : [];

                const ganador = ranking.length > 0 ? ranking[0] : null;

                return (
                  <tr key={jornada.id}>
                    <td>{jornada.fecha}</td>
                    <td>{jornada.nombre}</td>
                    <td>{jugadasDeLaJornada.length}</td>

                    <td>
                      {progresoJornada.completadas}/{progresoJornada.total} (
                      {progresoJornada.porcentaje}%)
                    </td>

                    <td>
                      <span className={getEstadoJornadaClass(estadoJornada)}>
                        {getEstadoJornadaLabel(estadoJornada)}
                      </span>
                    </td>

                    <td>{ganador ? ganador.nombre : "-"}</td>
                    <td>{ganador ? ganador.puntos : "-"}</td>
                    <td>
                      {jornada.fechaFinalizacion
                        ? new Date(jornada.fechaFinalizacion).toLocaleString()
                        : "-"}
                    </td>
                    <td>{jornada.reaperturas ?? 0}</td>

                    <td>
                      <button onClick={() => changeJornada(jornada.id)}>
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};