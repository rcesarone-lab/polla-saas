import { useEffect, useState } from "react";
import { Fragment } from "react";
import { useSearchParams } from "react-router-dom";
import { useJornada } from "../hooks/useJornada";
import { useJugadas } from "../hooks/useJugadas";
import { calcularRanking } from "../domain/scoring";
import { getResultadoByJornada } from "../services/resultados.service";
import { getCarrerasByJornada } from "../services/carreras.service";
import { AuditoriaPanel } from "../components/auditoria/AuditoriaPanel";
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
  const [searchParams] = useSearchParams();

  const jornadaDesdeUrl = searchParams.get("jornada");

  const [detalleVisible, setDetalleVisible] = useState<string | null>(
    jornadaDesdeUrl
  );

  const jornadasOrdenadas = [...jornadas].sort((a, b) =>
    b.fecha.localeCompare(a.fecha)
  );

  useEffect(() => {
    if (!jornadaDesdeUrl) return;

    setDetalleVisible(jornadaDesdeUrl);

    setTimeout(() => {
      document
        .getElementById(`jornada-${jornadaDesdeUrl}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, [jornadaDesdeUrl]);

  return (
    <div>
      <h1>Histórico de jornadas</h1>

      <div className="card">
        {jornadasOrdenadas.length === 0 ? (
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
                {jornadasOrdenadas.map((jornada) => {
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
                      <tr id={`jornada-${jornada.id}`}
                        className={jornadaDesdeUrl === jornada.id ? "historico-row-selected" : ""
                        }
                      >
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
                            <div className="historico-detail-grid">
                              <div className="card historico-detail-main">
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

                              <div className="historico-auditoria-side">
                                <AuditoriaPanel
                                  jornadaId={jornada.id}
                                  maxVisible={4}
                                  compact
                                />
                              </div>
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