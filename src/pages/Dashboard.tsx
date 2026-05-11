import { PageHeader } from "../components/layout/PageHeader";
import { useJugadas } from "../hooks/useJugadas";
import { useResultados } from "../hooks/useResultados";
import { useJornada } from "../hooks/useJornada";
import { calcularPuntaje } from "../domain/scoring";
import { useCarreras } from "../hooks/useCarreras";
import { KpiCard } from "../components/dashboard/KpiCard";
import {
  calcularEstadoJornada,
  calcularProgresoJornada,
  getEstadoJornadaLabel,
  getCarrerasPendientes,
} from "../domain/jornadaStatus";

export const Dashboard = () => {
  const { jugadas } = useJugadas();
  const { jornada } = useJornada();
  const { resultado } = useResultados(jornada?.id);
  const { carreras } = useCarreras(jornada?.id);

  if (!jornada) {
    return (
      <div className="card">
        <h1>Panel</h1>
        <p>No hay una jornada creada.</p>
        <p>Ve a Jugadas o Configuración y crea una jornada para comenzar.</p>
      </div>
    );
  }

  const jugadasDeLaJornada = jugadas.filter(
    (j) => j.jornadaId === jornada.id
  );

  const estadoJornada = calcularEstadoJornada(carreras, resultado);

  const progresoJornada = calcularProgresoJornada(carreras, resultado);

  const carrerasPendientes = getCarrerasPendientes(carreras, resultado);

  const ranking = resultado
    ? jugadasDeLaJornada
      .map((j) => ({
        nombre: j.nombre,
        puntos: calcularPuntaje(j, resultado),
      }))
      .sort((a, b) => b.puntos - a.puntos)
    : [];

  const ganador = ranking.length > 0 ? ranking[0] : null;

  return (
    <div>
      <PageHeader
        title="Panel ejecutivo"
        subtitle="Vista rápida de la jornada activa, avance, líder y próxima acción."
      />

      <div className="kpi-grid">
        <KpiCard
          label="Jugadas"
          value={jugadasDeLaJornada.length}
          tone="success"
        />

        <KpiCard
          label="Total carreras"
          value={`${progresoJornada.completadas}/${progresoJornada.total}`}
          tone="warning"
        />

        <KpiCard
          label="Estado"
          value={getEstadoJornadaLabel(
            estadoJornada,
            jornada.reaperturas ?? 0
          )}
          tone={estadoJornada === "FINALIZADA" ? "success" : "default"}
        />

        <KpiCard
          label={estadoJornada === "FINALIZADA" ? "Ganador" : "Líder"}
          value={ganador ? ganador.nombre : "-"}
          tone={ganador ? "success" : "default"}
        />
      </div>

      <div className="dashboard-executive-grid">
        <div className="card dashboard-main-card">
          <h2>Jornada activa</h2>

          <div className="dashboard-summary-row">
            <span>Nombre</span>
            <strong>{jornada.nombre}</strong>
          </div>

          <div className="dashboard-summary-row">
            <span>Fecha</span>
            <strong>{jornada.fecha}</strong>
          </div>

          <div className="dashboard-summary-row">
            <span>Avance</span>
            <strong>
              {progresoJornada.completadas}/{progresoJornada.total} carreras ·{" "}
              {progresoJornada.porcentaje}%
            </strong>
          </div>

          {jornada.fechaFinalizacion && (
            <div className="dashboard-summary-row">
              <span>Finalización</span>
              <strong>
                {new Date(jornada.fechaFinalizacion).toLocaleString()}
              </strong>
            </div>
          )}

          {(jornada.reaperturas ?? 0) > 0 && (
            <div className="dashboard-summary-row warning">
              <span>Reaperturas</span>
              <strong>{jornada.reaperturas}</strong>
            </div>
          )}
        </div>

        <div className="card dashboard-main-card">
          <h2>
            {estadoJornada === "FINALIZADA"
              ? "Top final"
              : "Top parcial"}
          </h2>

          {ranking.length === 0 ? (
            <p>No disponible</p>
          ) : (
            <ol className="dashboard-top-list">
              {ranking.slice(0, 3).map((r, i) => (
                <li key={`${r.nombre}-${i}`}>
                  <span>{i + 1}</span>
                  <strong>{r.nombre}</strong>
                  <em>{r.puntos} pts</em>
                </li>
              ))}
            </ol>
          )}

          {estadoJornada !== "FINALIZADA" && ranking.length > 0 && (
            <p className="ranking-note">
              Calculado con resultados cargados hasta ahora.
            </p>
          )}
        </div>

        <div className="card dashboard-main-card">
          <h2>Próxima acción</h2>

          {progresoJornada.total === 0 ? (
            <p>Configura carreras válidas para comenzar la operación.</p>
          ) : carrerasPendientes.length > 0 ? (
            <p>
              Faltan resultados para las carreras:{" "}
              <strong>{carrerasPendientes.join(", ")}</strong>.
            </p>
          ) : estadoJornada !== "FINALIZADA" ? (
            <p>Todos los resultados están cargados. La jornada puede finalizarse.</p>
          ) : (
            <p>Jornada finalizada. El snapshot histórico está congelado.</p>
          )}
        </div>
      </div>
    </div>
  );
};