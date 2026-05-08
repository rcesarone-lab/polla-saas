import { useNavigate } from "react-router-dom";
import { getJornadas } from "../services/jornadas.service";
import { getJugadas } from "../services/jugadas.service";
import { getAuditoria } from "../services/auditoria.service";
import {
  getEstadoJornadaClass,
  getEstadoJornadaLabel,
} from "../domain/jornadaStatus";

export const Admin = () => {
  const navigate = useNavigate();

  const jornadas = getJornadas();
  const jugadas = getJugadas();
  const auditoria = getAuditoria();

  const jornadasAbiertas = jornadas.filter(
    (jornada) => (jornada.estadoCierre ?? "ABIERTA") === "ABIERTA"
  );

  const jornadasParciales = jornadas.filter(
    (jornada) => jornada.estadoCierre === "PARCIAL"
  );

  const jornadasFinalizadas = jornadas.filter(
    (jornada) => jornada.estadoCierre === "FINALIZADA"
  );

  const jornadasReabiertas = jornadas.filter(
    (jornada) =>
      jornada.estadoCierre === "REABIERTA" || (jornada.reaperturas ?? 0) > 0
  );

  const alertasCriticas = auditoria
    .filter((evento) => evento.severidad === "CRITICAL")
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const actividadReciente = auditoria
    .filter((evento) => evento.severidad !== "CRITICAL")
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 8);

  const ultimasJornadas = [...jornadas]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 5);

  const tieneAlertas = alertasCriticas.length > 0;
  const tieneJornadasReabiertas = jornadasReabiertas.length > 0;

  const estadoOperativo = tieneAlertas
    ? "Atención requerida"
    : tieneJornadasReabiertas
      ? "Operación con reaperturas"
      : "Operación estable";

  const promedioJugadas =
    jornadas.length === 0 ? 0 : Math.round(jugadas.length / jornadas.length);

  const jornadaConMasJugadas =
    jornadas.length === 0
      ? null
      : [...jornadas]
          .map((jornada) => ({
            jornada,
            total: jugadas.filter((jugada) => jugada.jornadaId === jornada.id)
              .length,
          }))
          .sort((a, b) => b.total - a.total)[0];

  const totalReaperturas = jornadas.reduce(
    (acc, jornada) => acc + (jornada.reaperturas ?? 0),
    0
  );

  return (
    <div>
      <h1>Administración</h1>

      <div
        className={`admin-health-card ${
          tieneAlertas ? "critical" : tieneJornadasReabiertas ? "warning" : "ok"
        }`}
      >
        <div>
          <span>Estado operativo</span>
          <strong>{estadoOperativo}</strong>
        </div>

        <p>
          {tieneAlertas
            ? "Existen eventos críticos que deberían revisarse antes de cerrar la operación."
            : tieneJornadasReabiertas
              ? "Hay jornadas reabiertas. Conviene revisar auditoría e histórico."
              : "No se detectan alertas críticas en la operación actual."}
        </p>
      </div>

      <div className="admin-grid">
        <div className="admin-kpi-card">
          <span>Jornadas totales</span>
          <strong>{jornadas.length}</strong>
        </div>

        <div className="admin-kpi-card">
          <span>Jornadas abiertas</span>
          <strong>{jornadasAbiertas.length}</strong>
        </div>

        <div className="admin-kpi-card">
          <span>Jornadas parciales</span>
          <strong>{jornadasParciales.length}</strong>
        </div>

        <div className="admin-kpi-card">
          <span>Jornadas finalizadas</span>
          <strong>{jornadasFinalizadas.length}</strong>
        </div>

        <div className="admin-kpi-card warning">
          <span>Jornadas reabiertas</span>
          <strong>{jornadasReabiertas.length}</strong>
        </div>

        <div className="admin-kpi-card">
          <span>Total jugadas</span>
          <strong>{jugadas.length}</strong>
        </div>

        <div className="admin-kpi-card danger">
          <span>Eventos críticos</span>
          <strong>{alertasCriticas.length}</strong>
        </div>
      </div>

      {alertasCriticas.length > 0 && (
        <div className="card admin-critical-card">
          <h2>Alertas críticas</h2>

          <div className="audit-list scrollable admin-critical-list">
            {alertasCriticas.slice(0, 5).map((evento) => (
              <div
                key={evento.id}
                className={`audit-item audit-${evento.severidad.toLowerCase()}`}
              >
                <div className="admin-event-header">
                  <strong>{evento.accion}</strong>

                  <span
                    className={`event-badge ${evento.severidad.toLowerCase()}`}
                  >
                    {evento.severidad}
                  </span>
                </div>

                <span>{new Date(evento.fecha).toLocaleString()}</span>
                <p>{evento.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="admin-summary-grid">
        <div className="card admin-summary-card">
          <span>Promedio jugadas/jornada</span>
          <strong>{promedioJugadas}</strong>
        </div>

        <div className="card admin-summary-card">
          <span>Jornada con más jugadas</span>

          <strong>
            {jornadaConMasJugadas
              ? `${jornadaConMasJugadas.jornada.fecha} (${jornadaConMasJugadas.total})`
              : "-"}
          </strong>
        </div>

        <div className="card admin-summary-card">
          <span>Total reaperturas</span>
          <strong>{totalReaperturas}</strong>
        </div>
      </div>

      <div className="admin-section-grid">
        <div className="card">
          <h2>Últimas jornadas</h2>

          {jornadas.length === 0 ? (
            <p>No hay jornadas registradas.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Reaperturas</th>
                  <th>Finalización</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {ultimasJornadas.map((jornada) => (
                  <tr key={jornada.id}>
                    <td>{jornada.fecha}</td>

                    <td>
                      <span
                        className={getEstadoJornadaClass(
                          jornada.estadoCierre ?? "ABIERTA",
                          jornada.reaperturas ?? 0
                        )}
                      >
                        {getEstadoJornadaLabel(
                          jornada.estadoCierre ?? "ABIERTA",
                          jornada.reaperturas ?? 0
                        )}
                      </span>
                    </td>

                    <td>{jornada.reaperturas ?? 0}</td>

                    <td>
                      {jornada.fechaFinalizacion
                        ? new Date(jornada.fechaFinalizacion).toLocaleString()
                        : "-"}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          navigate(`/historico?jornada=${jornada.id}`)
                        }
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h2>Actividad reciente</h2>

          {actividadReciente.length === 0 ? (
            <p>No hay eventos registrados.</p>
          ) : (
            <div className="audit-list scrollable admin-audit-list">
              {actividadReciente.map((evento) => (
                <div
                  key={evento.id}
                  className={`audit-item audit-${evento.severidad.toLowerCase()}`}
                >
                  <div className="admin-event-header">
                    <strong>{evento.accion}</strong>

                    <span
                      className={`event-badge ${evento.severidad.toLowerCase()}`}
                    >
                      {evento.severidad}
                    </span>
                  </div>

                  <span>{new Date(evento.fecha).toLocaleString()}</span>
                  <p>{evento.descripcion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};