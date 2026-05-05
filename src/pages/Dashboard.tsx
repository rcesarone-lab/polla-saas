import { useJugadas } from "../hooks/useJugadas";
import { useResultados } from "../hooks/useResultados";
import { useJornada } from "../hooks/useJornada";
import { calcularPuntaje } from "../domain/scoring";

export const Dashboard = () => {
  const { jugadas } = useJugadas();
  const { jornada } = useJornada();
  const { resultado } = useResultados(jornada?.id);

  if (!jornada) {
    return <p>Cargando...</p>;
  }

  const jugadasDeLaJornada = jugadas.filter(
    (j) => j.jornadaId === jornada.id
  );

  const ranking = resultado
    ? jugadasDeLaJornada
      .map((j) => ({
        nombre: j.nombre,
        puntos: calcularPuntaje(j, resultado),
      }))
      .sort((a, b) => b.puntos - a.puntos)
      .slice(0, 3)
    : [];

  const ganador = ranking.length > 0 ? ranking[0] : null;

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <div className="card">
          <h2>Jornada actual</h2>
          <p>{jornada.nombre} - {jornada.fecha}</p>
        </div>

        <div className="card">
          <h2>Total jugadas</h2>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {jugadasDeLaJornada.length}
          </p>
        </div>

        <div className="card">
          <h2>Estado</h2>
          <p className={resultado ? "status-ok" : "status-warn"}>
            {resultado ? "Resultados cargados" : "Sin resultados"}
          </p>
        </div>

        <div className="card">
          <h2>Ganador</h2>

          {!ganador ? (
            <p>No disponible</p>
          ) : (
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "green" }}>
              {ganador.nombre} → {ganador.puntos} pts
            </p>
          )}
        </div>

        <div className="card">
          <h2>Top 3</h2>
          {ranking.length === 0 ? (
            <p>No disponible</p>
          ) : (
            <ol>
              {ranking.map((r, i) => (
                <li key={i}>
                  {r.nombre} → {r.puntos} pts
                </li>
              ))}
            </ol>
          )}
        </div>

      </div>
    </div>
  );
};