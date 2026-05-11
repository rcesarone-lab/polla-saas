import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { JornadaStatusCard } from "../components/jornada/JornadaStatusCard";
import { KpiCard } from "../components/dashboard/KpiCard";
import { EmptyState } from "../components/ui/EmptyState";
import { useJornada } from "../hooks/useJornada";
import { useJugadas } from "../hooks/useJugadas";
import { getResultadoByJornada } from "../services/resultados.service";
import { getCarrerasByJornada } from "../services/carreras.service";
import {
  exportarJornadaCompleta,
  importarJornadaCompleta,
} from "../services/jornadaBackup.service";
import {
  calcularEstadoJornada,
  calcularProgresoJornada,
  getCarrerasPendientes,
  getEstadoJornadaLabel,
} from "../domain/jornadaStatus";
import { calcularRanking } from "../domain/scoring";

export const Operacion = () => {
  const [liveRefresh, setLiveRefresh] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [pulse, setPulse] = useState(false);
  const lastSignatureRef = useRef("");

  const [operationMessage, setOperationMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isImportingJornada, setIsImportingJornada] = useState(false);

  const navigate = useNavigate();
  const { jornada } = useJornada();
  const { jugadas } = useJugadas();

  useEffect(() => {
    const refresh = () => {
      setLiveRefresh((prev) => prev + 1);
      setLastUpdate(new Date());
    };

    const interval = window.setInterval(refresh, 1500);

    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  void liveRefresh;

  const carreras = jornada ? getCarrerasByJornada(jornada.id) : [];
  const resultado = jornada ? getResultadoByJornada(jornada.id) : null;

  const jugadasDeLaJornada = jornada
    ? jugadas.filter((jugada) => jugada.jornadaId === jornada.id)
    : [];

  const estadoJornada = jornada
    ? calcularEstadoJornada(
      carreras,
      resultado,
      jornada.estadoCierre === "FINALIZADA"
    )
    : "ABIERTA";

  const progresoJornada = calcularProgresoJornada(carreras, resultado);
  const carrerasPendientes = getCarrerasPendientes(carreras, resultado);

  const ranking = resultado
    ? calcularRanking(jugadasDeLaJornada, resultado)
    : [];

  const lider = ranking[0];

  const tieneCarreras = carreras.length > 0;
  const tieneJugadas = jugadasDeLaJornada.length > 0;
  const tieneResultados = !!resultado;

  const dataSignature = JSON.stringify({
    jornadaId: jornada?.id ?? null,
    carreras: carreras.map((carrera) => ({
      numeroCarrera: carrera.numeroCarrera,
      cantidadEjemplares: carrera.cantidadEjemplares,
    })),
    jugadas: jugadasDeLaJornada.map((jugada) => ({
      id: jugada.id,
      nombre: jugada.nombre,
      jugadas: jugada.jugadas,
    })),
    resultado,
    ranking,
    estadoJornada,
  });

  useEffect(() => {
    if (!lastSignatureRef.current) {
      lastSignatureRef.current = dataSignature;
      return;
    }

    if (lastSignatureRef.current !== dataSignature) {
      lastSignatureRef.current = dataSignature;

      setPulse(true);

      window.setTimeout(() => {
        setPulse(false);
      }, 500);
    }
  }, [dataSignature]);

  const getSectionStatus = (enabled: boolean) =>
    enabled ? "Disponible" : "Bloqueado";

  const handleImportarJornada = async (file: File | undefined) => {
    if (!file) return;

    const confirmar = window.confirm(
      "Importar una jornada reemplazará esa misma jornada si ya existe. ¿Deseas continuar?"
    );

    if (!confirmar) return;

    try {
      setIsImportingJornada(true);

      const jornadaImportada = await importarJornadaCompleta(file);

      setOperationMessage({
        type: "success",
        text: `Jornada ${jornadaImportada.fecha} importada correctamente.`,
      });

      setTimeout(() => {
        window.location.reload();
      }, 900);
    } catch (error) {
      setOperationMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "No se pudo importar la jornada.",
      });
    } finally {
      setIsImportingJornada(false);
    }
  };

  if (!jornada) {
    return (
      <div>
        <PageHeader
          title="Operación de jornada"
          subtitle="Centro operativo para gestionar jugadas, resultados, ranking y estado de la jornada."
        />

        <EmptyState
          title="Sin jornada activa"
          description="Crea o selecciona una jornada para comenzar la operación."
        />

        <div className="operacion-actions">
          <label
            className={`secondary-button import-jornada-button ${isImportingJornada ? "disabled" : ""
              }`}
          >
            {isImportingJornada ? "Importando..." : "Importar jornada"}

            <input
              type="file"
              accept="application/json"
              hidden
              onChange={async (event) => {
                await handleImportarJornada(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
        </div>

        {operationMessage && (
          <div className={`operation-message ${operationMessage.type}`}>
            {operationMessage.text}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Operación de jornada"
        subtitle="Centro operativo para gestionar jugadas, resultados, ranking y estado de la jornada."
      />

      <JornadaStatusCard jornada={jornada} />

      <div className="live-status-bar">
        <span className="live-dot" />
        <strong>Vista en vivo</strong>
        <span>Última actualización: {lastUpdate.toLocaleTimeString()}</span>
      </div>

      <div className="operacion-actions">
        <button type="button" onClick={() => navigate("/configuracion")}>
          Configurar jornada
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/jugadas")}
          disabled={carreras.length === 0}
        >
          Gestionar jugadas
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/resultados")}
          disabled={jugadasDeLaJornada.length === 0}
        >
          Cargar resultados
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate(`/historico?jornada=${jornada.id}`)}
        >
          Ver histórico
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            exportarJornadaCompleta({
              jornada,
              carreras,
              jugadas: jugadasDeLaJornada,
              resultado,
            })
          }
        >
          Exportar jornada
        </button>

        <label
          className={`secondary-button import-jornada-button ${isImportingJornada ? "disabled" : ""
            }`}
        >
          {isImportingJornada ? "Importando..." : "Importar jornada"}

          <input
            type="file"
            accept="application/json"
            hidden
            onChange={async (event) => {
              await handleImportarJornada(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
      </div>

      {operationMessage && (
        <div className={`operation-message ${operationMessage.type}`}>
          {operationMessage.text}
        </div>
      )}

      <div className={pulse ? "kpi-grid pulse-update" : "kpi-grid"}>
        <KpiCard
          label="Jugadas"
          value={jugadasDeLaJornada.length}
          tone="success"
        />

        <KpiCard
          label="Carreras"
          value={`${progresoJornada.completadas}/${progresoJornada.total}`}
          tone="warning"
        />

        <KpiCard
          label="Estado"
          value={getEstadoJornadaLabel(
            estadoJornada,
            jornada.reaperturas ?? 0
          )}
        />

        <KpiCard
          label={estadoJornada === "FINALIZADA" ? "Ganador" : "Líder"}
          value={lider ? lider.nombre : "-"}
          tone={lider ? "success" : "default"}
        />
      </div>

      <h2 className="section-title">Resumen operativo</h2>

      <div className="operacion-grid">
        <div className="card">
          <h2>Resumen de avance</h2>

          <p>
            <strong>Progreso:</strong> {progresoJornada.porcentaje}%
          </p>

          <p>
            <strong>Pendientes:</strong>{" "}
            {carrerasPendientes.length === 0
              ? "-"
              : carrerasPendientes.join(", ")}
          </p>

          <p>
            <strong>Total carreras:</strong> {carreras.length}
          </p>
        </div>

        {tieneResultados && (
          <div className="card">
            <h2>
              {estadoJornada === "FINALIZADA"
                ? "Ranking final"
                : "Ranking parcial"}
            </h2>

            {ranking.length === 0 ? (
              <EmptyState
                title="Ranking no disponible"
                description="El ranking aparecerá cuando existan jugadas y resultados cargados."
              />
            ) : (
              <ol
                className={
                  pulse
                    ? "dashboard-top-list pulse-update"
                    : "dashboard-top-list"
                }
              >
                {ranking.slice(0, 5).map((item, index) => (
                  <li key={`${item.nombre}-${index}`}>
                    <span>{index + 1}</span>
                    <strong>{item.nombre}</strong>
                    <em>{item.puntos} pts</em>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>

      <h2 className="section-title">
        Trabajo de jornada
        <span
          className={tieneCarreras ? "section-status ok" : "section-status locked"}
        >
          {getSectionStatus(tieneCarreras)}
        </span>
      </h2>

      {!tieneCarreras ? (
        <EmptyState
          title="Trabajo bloqueado"
          description="Configura las carreras válidas para habilitar la carga y revisión de jugadas."
        />
      ) : (
        <div className="operacion-grid">
          <div className="card">
            <h2>Últimas jugadas</h2>

            {jugadasDeLaJornada.length === 0 ? (
              <EmptyState
                title="Sin jugadas cargadas"
                description="Las jugadas registradas para la jornada aparecerán aquí."
              />
            ) : (
              <div className="table-fit">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Participante</th>
                      <th>Jugadas</th>
                    </tr>
                  </thead>

                  <tbody>
                    {jugadasDeLaJornada.slice(0, 5).map((jugada) => (
                      <tr key={jugada.id}>
                        <td>{jugada.nombre}</td>
                        <td>
                          {Object.entries(jugada.jugadas)
                            .sort(([a], [b]) => Number(a) - Number(b))
                            .map(([carrera, caballo]) => `C${carrera}: ${caballo}`)
                            .join(" | ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <h2>Acción recomendada</h2>

            <div className="smart-action-card">
              {jugadasDeLaJornada.length === 0 ? (
                <>
                  <strong>Cargar jugadas</strong>
                  <p>
                    Ya existen carreras configuradas, pero no hay jugadas
                    registradas.
                  </p>

                  <button type="button" onClick={() => navigate("/jugadas")}>
                    Ir a jugadas
                  </button>
                </>
              ) : carrerasPendientes.length > 0 ? (
                <>
                  <strong>Cargar resultados pendientes</strong>
                  <p>
                    Faltan resultados para las carreras:{" "}
                    <b>{carrerasPendientes.join(", ")}</b>.
                  </p>

                  <button type="button" onClick={() => navigate("/resultados")}>
                    Ir a resultados
                  </button>
                </>
              ) : estadoJornada !== "FINALIZADA" ? (
                <>
                  <strong>Finalizar jornada</strong>
                  <p>
                    Todos los resultados están cargados. Puedes cerrar la
                    jornada.
                  </p>

                  <button type="button" onClick={() => navigate("/")}>
                    Ir al panel ejecutivo
                  </button>
                </>
              ) : (
                <>
                  <strong>Jornada cerrada</strong>
                  <p>El snapshot histórico quedó congelado y listo para consulta.</p>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => navigate(`/historico?jornada=${jornada.id}`)}
                  >
                    Ver histórico
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <h2 className="section-title">
        Seguimiento de resultados
        <span
          className={tieneJugadas ? "section-status ok" : "section-status locked"}
        >
          {getSectionStatus(tieneJugadas)}
        </span>
      </h2>

      {!tieneJugadas ? (
        <EmptyState
          title="Seguimiento pendiente"
          description="Carga al menos una jugada para habilitar el seguimiento de resultados."
        />
      ) : (
        <div className="operacion-grid">
          <div className="card">
            <h2>Estado por carrera</h2>

            {carreras.length === 0 ? (
              <EmptyState
                title="Sin carreras configuradas"
                description="Configura carreras válidas antes de operar resultados."
              />
            ) : (
              <div className="table-fit">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Carrera</th>
                      <th>Estado</th>
                      <th>Resultado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {carreras.map((carrera) => {
                      const resultadoCarrera =
                        resultado?.resultados?.[carrera.numeroCarrera];

                      const completa =
                        resultadoCarrera?.primero &&
                        resultadoCarrera?.segundo &&
                        resultadoCarrera?.tercero;

                      return (
                        <tr key={carrera.id}>
                          <td>{carrera.numeroCarrera}</td>

                          <td>
                            {jornada.estadoCierre === "FINALIZADA" ? (
                              <span className="status-ok">Finalizada</span>
                            ) : completa ? (
                              <span className="status-ok">Completa</span>
                            ) : (
                              <span className="status-warn">Pendiente</span>
                            )}
                          </td>

                          <td>
                            {completa
                              ? `${resultadoCarrera.primero} / ${resultadoCarrera.segundo} / ${resultadoCarrera.tercero}`
                              : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};