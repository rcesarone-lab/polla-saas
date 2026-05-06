import { useJugadas } from "../hooks/useJugadas";
import { useResultados } from "../hooks/useResultados";
import { useJornada } from "../hooks/useJornada";
import { calcularPuntaje } from "../domain/scoring";
import { useCarreras } from "../hooks/useCarreras";
import {
  calcularEstadoJornada,
  getEstadoJornadaClass,
  getEstadoJornadaLabel,
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
      <h1>Panel</h1>

      <div className="dashboard-grid">
        <div className="card">
          <h2>Jornada actual</h2>
          <p>
            {jornada.nombre} - {jornada.fecha}
          </p>
        </div>

        <div className="card">
          <h2>Total de jugadas</h2>
          <p>{jugadasDeLaJornada.length}</p>
        </div>

        <div className="card">
          <h2>Estado</h2>
          <p className={getEstadoJornadaClass(estadoJornada)}>
            {getEstadoJornadaLabel(estadoJornada)}
          </p>
        </div>

        <div className="card">
          <h2>Ganador</h2>
          {!ganador ? (
            <p>No disponible</p>
          ) : (
            <p>
              {ganador.nombre} → {ganador.puntos} pts
            </p>
          )}
        </div>

        <div className="card">
          <h2>Los 3 mejores</h2>

          {ranking.length === 0 ? (
            <p>No disponible</p>
          ) : (
            <ol>
              {ranking.slice(0, 3).map((r, i) => (
                <li key={`${r.nombre}-${i}`}>
                  {r.nombre} → {r.puntos} puntos
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};