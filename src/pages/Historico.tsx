import { PageHeader } from "../components/layout/PageHeader";
import { useEffect, useState } from "react";
import { Fragment } from "react";
import { useSearchParams } from "react-router-dom";
import { useJornada } from "../hooks/useJornada";
import { useJugadas } from "../hooks/useJugadas";
import { calcularRanking } from "../domain/scoring";
import { getResultadoByJornada } from "../services/resultados.service";
import { getCarrerasByJornada } from "../services/carreras.service";
import { AuditoriaPanel } from "../components/auditoria/AuditoriaPanel";
import { EmptyState } from "../components/ui/EmptyState";
import {
  exportarHistoricoCSV,
  exportarJugadasJornadaCSV,
  exportarRankingJornadaCSV,
  exportarResultadosJornadaCSV,
} from "../services/export.service";
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
      <div className="sticky-toolbar">
        <PageHeader
          title="Histórico de jornadas"
          subtitle="Consulta snapshots históricos, rankings y trazabilidad operacional."
          actions={
            <button
              type="button"
              className="secondary-button"
              disabled={jornadasOrdenadas.length === 0}
              onClick={() => {
                const historicoExport = jornadasOrdenadas.map((jornada) => {
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

                  return {
                    fecha: jornada.fecha,
                    nombre: jornada.nombre,
                    estado: getEstadoJornadaLabel(
                      estadoJornada,
                      jornada.reaperturas ?? 0
                    ),
                    totalJugadas: jugadasDeLaJornada.length,
                    ganador: ganador ? ganador.nombre : "-",
                    puntosGanador: ganador ? ganador.puntos : "-",
                    top3:
                      ranking.length === 0
                        ? "-"
                        : ranking
                          .slice(0, 3)
                          .map(
                            (r, index) =>
                              `${index + 1}. ${r.nombre} (${r.puntos})`
                          )
                          .join(" | "),
                    reaperturas: jornada.reaperturas ?? 0,
                    fechaFinalizacion: jornada.fechaFinalizacion
                      ? new Date(jornada.fechaFinalizacion).toLocaleString()
                      : "-",
                  };
                });

                exportarHistoricoCSV(historicoExport);
              }}
            >
              Exportar histórico CSV
            </button>
          }
        />
      </div>

      <div className="card">
        {jornadasOrdenadas.length === 0 ? (
          <EmptyState
            title="Sin jornadas históricas"
            description="Cuando finalices jornadas operacionales aparecerán snapshots históricos y rankings congelados."
          />
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
                  <th>Gestión</th>
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
                      <tr
                        id={`jornada-${jornada.id}`}
                        className={
                          jornadaDesdeUrl === jornada.id
                            ? "historico-row-selected"
                            : ""
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
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() => changeJornada(jornada.id)}
                            >
                              Activar
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
                              {detalleVisible === jornada.id ? "Cerrar" : "Detalle"}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {detalleVisible === jornada.id && (
                        <tr>
                          <td colSpan={12}>
                            <div className="historico-expanded-panel">
                              <div className="historico-expanded-main">
                                <div className="historico-detail-header">
                                  <div>
                                    <h3>Detalle histórico</h3>

                                    <p className="section-description">
                                      Snapshot congelado de la jornada seleccionada.
                                    </p>
                                  </div>

                                  <div className="historico-export-actions">
                                    <button
                                      type="button"
                                      className="secondary-button"
                                      disabled={ranking.length === 0}
                                      onClick={() =>
                                        exportarRankingJornadaCSV({
                                          jornadaId: jornada.id,
                                          fecha: jornada.fecha,
                                          ranking,
                                        })
                                      }
                                    >
                                      Exportar ranking CSV
                                    </button>

                                    <button
                                      type="button"
                                      className="secondary-button"
                                      disabled={jugadasDeLaJornada.length === 0}
                                      onClick={() =>
                                        exportarJugadasJornadaCSV({
                                          jornadaId: jornada.id,
                                          fecha: jornada.fecha,
                                          carreras: carrerasDeLaJornada.map(
                                            (carrera) => carrera.numeroCarrera
                                          ),
                                          jugadas: jugadasDeLaJornada.map((jugada) => ({
                                            participante: jugada.nombre,
                                            jugadas: jugada.jugadas,
                                            puntos: resultado
                                              ? calcularRanking([jugada], resultado)[0]?.puntos ?? 0
                                              : 0,
                                          })),
                                        })
                                      }
                                    >
                                      Exportar jugadas CSV
                                    </button>

                                    <button
                                      type="button"
                                      className="secondary-button"
                                      disabled={!resultado}
                                      onClick={() =>
                                        resultado &&
                                        exportarResultadosJornadaCSV({
                                          jornadaId: jornada.id,
                                          fecha: jornada.fecha,
                                          resultados: carrerasDeLaJornada.map((carrera) => {
                                            const resultadoCarrera =
                                              resultado.resultados[carrera.numeroCarrera];

                                            return {
                                              carrera: carrera.numeroCarrera,
                                              primero: resultadoCarrera?.primero ?? null,
                                              segundo: resultadoCarrera?.segundo ?? null,
                                              tercero: resultadoCarrera?.tercero ?? null,
                                            };
                                          }),
                                        })
                                      }
                                    >
                                      Exportar resultados CSV
                                    </button>
                                  </div>
                                </div>

                                <div className="historico-detail-summary-grid">
                                  <div className="historico-summary-item">
                                    <span>Fecha</span>
                                    <strong>{jornada.fecha}</strong>
                                  </div>

                                  <div className="historico-summary-item">
                                    <span>Estado</span>
                                    <strong>
                                      {getEstadoJornadaLabel(
                                        estadoJornada,
                                        jornada.reaperturas ?? 0
                                      )}
                                    </strong>
                                  </div>

                                  <div className="historico-summary-item">
                                    <span>Progreso</span>
                                    <strong>
                                      {progresoJornada.completadas}/{progresoJornada.total} ·{" "}
                                      {progresoJornada.porcentaje}%
                                    </strong>
                                  </div>

                                  <div className="historico-summary-item">
                                    <span>Finalización</span>
                                    <strong>
                                      {jornada.fechaFinalizacion
                                        ? new Date(jornada.fechaFinalizacion).toLocaleString()
                                        : "-"}
                                    </strong>
                                  </div>

                                  <div className="historico-summary-item">
                                    <span>Reaperturas</span>
                                    <strong>{jornada.reaperturas ?? 0}</strong>
                                  </div>

                                  <div className="historico-summary-item">
                                    <span>Pendientes</span>
                                    <strong>
                                      {carrerasPendientes.length === 0
                                        ? "-"
                                        : carrerasPendientes.join(", ")}
                                    </strong>
                                  </div>
                                </div>

                                <div className="historico-ranking-layout">
                                  <div className="historico-ranking-card">
                                    <h4>Top ranking</h4>

                                    {ranking.length === 0 ? (
                                      <EmptyState
                                        title="Ranking no disponible"
                                        description="No hay ranking calculado para esta jornada."
                                      />
                                    ) : (
                                      <div className="historico-ranking-podium">
                                        {ranking.slice(0, 6).map((r, index) => (
                                          <div key={`${r.nombre}-${index}`} className="podium-card">
                                            <span>{index + 1}</span>
                                            <strong>{r.nombre}</strong>
                                            <em>{r.puntos} pts</em>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <div className="historico-ranking-card">
                                    <h4>Ranking completo</h4>

                                    {ranking.length === 0 ? (
                                      <EmptyState
                                        title="Sin ranking"
                                        description="No hay datos suficientes para mostrar el ranking."
                                      />
                                    ) : (
                                      <ol className="historico-ranking-list">
                                        {ranking.map((r, index) => (
                                          <li key={`${r.nombre}-${index}`}>
                                            <span>{index + 1}</span>
                                            <strong>{r.nombre}</strong>
                                            <em>{r.puntos} pts</em>
                                          </li>
                                        ))}
                                      </ol>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="historico-expanded-audit">
                                <h3>Auditoría operacional</h3>

                                <p className="section-description">
                                  Últimos eventos relevantes ejecutados sobre la jornada.
                                </p>

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