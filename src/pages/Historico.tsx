import { useState } from "react";
import { Fragment } from "react";
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

  const [detalleVisible, setDetalleVisible] = useState<string | null>(null);

  return (
    <div>
      <h1>Histórico de jornadas</h1>

      <div className="card">
        {jornadas.length === 0 ? (
          <p>No hay jornadas cargadas.</p>
        ) : (
          <div className="table-scroll">
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
                  <th>Top 3</th>
                  <th>Finalización</th>
                  <th>Reaperturas</th>
                  <th>Acciones</th>
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
                    <Fragment key={jornada.id}>
                      <tr>
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
                          {ranking.length === 0
                            ? "-"
                            : ranking
                              .slice(0, 3)
                              .map(
                                (r, index) =>
                                  `${index + 1}. ${r.nombre} (${r.puntos})`
                              )
                              .join(" | ")}
                        </td>

                        <td>
                          {jornada.fechaFinalizacion
                            ? new Date(
                              jornada.fechaFinalizacion
                            ).toLocaleString()
                            : "-"}
                        </td>

                        <td>{jornada.reaperturas ?? 0}</td>

                        <td>
                          <div className="actions-row">
                            <button onClick={() => changeJornada(jornada.id)}>
                              Seleccionar
                            </button>

                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() =>
                                setDetalleVisible(
                                  detalleVisible === jornada.id
                                    ? null
                                    : jornada.id
                                )
                              }
                            >
                              {detalleVisible === jornada.id
                                ? "Ocultar"
                                : "Ver detalle"}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {detalleVisible === jornada.id && (
                        <tr>
                          <td colSpan={12}>
                            <div className="card">
                              <h3>Detalle histórico</h3>

                              <p>
                                <strong>Fecha:</strong> {jornada.fecha}
                              </p>

                              <p>
                                <strong>Estado:</strong>{" "}
                                {getEstadoJornadaLabel(
                                  estadoJornada,
                                  jornada.reaperturas ?? 0
                                )}
                              </p>

                              <p>
                                <strong>Progreso:</strong>{" "}
                                {progresoJornada.completadas}/
                                {progresoJornada.total} carreras (
                                {progresoJornada.porcentaje}%)
                              </p>

                              <p>
                                <strong>Finalización:</strong>{" "}
                                {jornada.fechaFinalizacion
                                  ? new Date(
                                    jornada.fechaFinalizacion
                                  ).toLocaleString()
                                  : "-"}
                              </p>

                              <p>
                                <strong>Reaperturas:</strong>{" "}
                                {jornada.reaperturas ?? 0}
                              </p>

                              <p>
                                <strong>Pendientes:</strong>{" "}
                                {carrerasPendientes.length === 0
                                  ? "-"
                                  : carrerasPendientes.join(", ")}
                              </p>

                              <h4>Ranking completo</h4>

                              {ranking.length === 0 ? (
                                <p>No disponible</p>
                              ) : (
                                <ol>
                                  {ranking.map((r, index) => (
                                    <li key={`${r.nombre}-${index}`}>
                                      {r.nombre} → {r.puntos} pts
                                    </li>
                                  ))}
                                </ol>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};