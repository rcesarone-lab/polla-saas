import { useJornada } from "../hooks/useJornada";
import { useJugadas } from "../hooks/useJugadas";
import { calcularRanking } from "../domain/scoring";
import { getResultadoByJornada } from "../services/resultados.service";
import { getCarrerasByJornada } from "../services/carreras.service";
import {
  calcularEstadoJornada,
  calcularProgresoJornada,
  getCarrerasPendientes,
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
                <th>Pendientes</th>
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

                const estadoJornada = calcularEstadoJornada(
                  carrerasDeLaJornada,
                  resultado,
                  jornada.estadoCierre === "FINALIZADA"
                );

                const progresoJornada = calcularProgresoJornada(
                  carrerasDeLaJornada,
                  resultado
                );

                const carrerasPendientes = getCarrerasPendientes(
                  carrerasDeLaJornada,
                  resultado
                );

                const ranking =
                  jornada.snapshotFinal?.ranking ??
                  (resultado
                    ? calcularRanking(jugadasDeLaJornada, resultado)
                    : []);

                const ganador = jornada.snapshotFinal
                  ? {
                      nombre: jornada.snapshotFinal.ganador,
                      puntos: jornada.snapshotFinal.puntosGanador,
                    }
                  : ranking[0];

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
                      <span
                        className={getEstadoJornadaClass(
                          estadoJornada,
                          jornada.reaperturas ?? 0
                        )}
                      >
                        {getEstadoJornadaLabel(
                          estadoJornada,
                          jornada.reaperturas ?? 0
                        )}
                      </span>
                    </td>

                    <td>
                      {carrerasPendientes.length === 0
                        ? "-"
                        : carrerasPendientes.join(", ")}
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