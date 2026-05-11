import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { getJornadas } from "../services/jornadas.service";
import { getJugadas } from "../services/jugadas.service";
import { getAuditoria } from "../services/auditoria.service";
import {
  descargarBackupLocal,
  importarBackupLocal,
  leerMetadataBackup,
} from "../services/backup.service";
import {
  getEstadoJornadaClass,
  getEstadoJornadaLabel,
} from "../domain/jornadaStatus";

export const Admin = () => {
  const navigate = useNavigate();

  const jornadas = getJornadas();
  const jugadas = getJugadas();
  const auditoria = getAuditoria();

  const [backupMessage, setBackupMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [backupMetadata, setBackupMetadata] = useState<{
    app: string;
    version: string;
    fecha: string;
  } | null>(null);

  const [isImportingBackup, setIsImportingBackup] = useState(false);

  const jornadasAbiertas = jornadas.filter(
    (jornada) => (jornada.estadoCierre ?? "ABIERTA") === "ABIERTA"
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
      <PageHeader
        title="Administración"
        subtitle="Control operativo, respaldo local, auditoría y seguimiento general del MVP."
      />

      <div className="admin-top-grid">
        <div
          className={`admin-health-card ${tieneAlertas ? "critical" : tieneJornadasReabiertas ? "warning" : "ok"
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
      </div>

      <div className="admin-compact-kpi-grid">
        <div className="admin-kpi-card">
          <span>Jornadas</span>
          <strong>{jornadas.length}</strong>
        </div>

        <div className="admin-kpi-card">
          <span>Abiertas</span>
          <strong>{jornadasAbiertas.length}</strong>
        </div>

        <div className="admin-kpi-card">
          <span>Finalizadas</span>
          <strong>{jornadasFinalizadas.length}</strong>
        </div>

        <div className="admin-kpi-card warning">
          <span>Reabiertas</span>
          <strong>{jornadasReabiertas.length}</strong>
        </div>

        <div className="admin-kpi-card">
          <span>Jugadas</span>
          <strong>{jugadas.length}</strong>
        </div>

        <div className="admin-kpi-card danger">
          <span>Críticos</span>
          <strong>{alertasCriticas.length}</strong>
        </div>
      </div>

      <div className="admin-main-grid">
        <div className="admin-left-column">
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

          <div className="card admin-backup-card">
            <div>
              <h2>Backup local</h2>

              <p>
                Exporta o importa una copia JSON completa del prototipo local.
              </p>
            </div>

            <div className="backup-actions">
              <button type="button" onClick={descargarBackupLocal}>
                Exportar backup
              </button>

              <label
                className={`secondary-button import-backup-button ${isImportingBackup ? "disabled" : ""
                  }`}
              >
                {isImportingBackup ? "Importando..." : "Importar backup"}

                <input
                  type="file"
                  accept="application/json"
                  hidden
                  onChange={async (event) => {
                    const file = event.target.files?.[0];

                    if (!file) return;

                    const metadata = await leerMetadataBackup(file);

                    setBackupMetadata(metadata);

                    const confirmar = window.confirm(
                      "Importar un backup reemplazará los datos actuales guardados en este navegador. ¿Deseas continuar?"
                    );

                    if (!confirmar) {
                      event.target.value = "";
                      return;
                    }

                    try {
                      setIsImportingBackup(true);

                      await importarBackupLocal(file);

                      setBackupMessage({
                        type: "success",
                        text: "Backup importado correctamente.",
                      });

                      setBackupMetadata(null);

                      setTimeout(() => {
                        window.location.reload();
                      }, 1200);
                    } catch (error) {
                      setBackupMetadata(null);

                      setBackupMessage({
                        type: "error",
                        text:
                          error instanceof Error
                            ? error.message
                            : "No se pudo importar el backup.",
                      });
                    } finally {
                      setIsImportingBackup(false);
                    }

                    event.target.value = "";
                  }}
                />
              </label>
            </div>

            {backupMetadata && (
              <div className="backup-metadata-card">
                <strong>{backupMetadata.app}</strong>
                <span>Versión: {backupMetadata.version}</span>
                <span>
                  Fecha backup:{" "}
                  {backupMetadata.fecha === "-"
                    ? "-"
                    : new Date(backupMetadata.fecha).toLocaleString()}
                </span>
              </div>
            )}

            {backupMessage && (
              <div className={`backup-message ${backupMessage.type}`}>
                {backupMessage.text}
              </div>
            )}
          </div>

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

          <div className="card">
            <h2>Últimas jornadas</h2>

            {jornadas.length === 0 ? (
              <EmptyState
                title="Sin jornadas registradas"
                description="Cuando crees jornadas, aparecerán aquí las más recientes con su estado operativo."
              />
            ) : (
              <div className="table-fit">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Reaperturas</th>
                      <th>Finalización</th>
                      <th>Gestión</th>
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
                            ? new Date(
                              jornada.fechaFinalizacion
                            ).toLocaleString()
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
                            Detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card admin-right-column">
          <h2>Actividad reciente</h2>

          {actividadReciente.length === 0 ? (
            <EmptyState
              title="Sin actividad reciente"
              description="Las acciones operacionales como exportaciones, reaperturas o cambios de configuración aparecerán aquí."
            />
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