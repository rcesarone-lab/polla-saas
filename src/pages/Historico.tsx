import { useJornada } from "../hooks/useJornada";
import { useJugadas } from "../hooks/useJugadas";
import { calcularPuntaje } from "../domain/scoring";
import { getResultadoByJornada } from "../services/resultados.service";

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
                <th>Estado</th>
                <th>Ganador</th>
                <th>Puntos</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {jornadas.map((jornada) => {
                const jugadasDeLaJornada = jugadas.filter(
                  (jugada) => jugada.jornadaId === jornada.id
                );

                const resultado = getResultadoByJornada(jornada.id);

                const ranking = resultado
                  ? jugadasDeLaJornada
                      .map((jugada) => ({
                        nombre: jugada.nombre,
                        puntos: calcularPuntaje(jugada, resultado),
                      }))
                      .sort((a, b) => b.puntos - a.puntos)
                  : [];

                const ganador = ranking.length > 0 ? ranking[0] : null;

                return (
                  <tr key={jornada.id}>
                    <td>{jornada.fecha}</td>
                    <td>{jornada.nombre}</td>
                    <td>{jugadasDeLaJornada.length}</td>

                    <td>
                      {resultado ? (
                        <span className="status-ok">Resultados cargados</span>
                      ) : (
                        <span className="status-warn">Sin resultados</span>
                      )}
                    </td>

                    <td>{ganador ? ganador.nombre : "-"}</td>
                    <td>{ganador ? ganador.puntos : "-"}</td>

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