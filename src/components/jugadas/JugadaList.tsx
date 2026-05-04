import type { Jugada, Resultado } from "../../domain/types";
import { calcularPuntaje } from "../../domain/scoring";

type Props = {
  jugadas: Jugada[];
  resultado: Resultado | null;
  onDelete: (id: string) => void;
};

export const JugadaList = ({ jugadas, resultado, onDelete }: Props) => {
  if (jugadas.length === 0) {
    return <p>No hay jugadas cargadas.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Jugador</th>
          <th>Carrera 1</th>
          <th>Carrera 2</th>
          <th>Carrera 3</th>
          <th>Puntos</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {jugadas.map((j) => {
          const puntos = resultado ? calcularPuntaje(j, resultado) : 0;

          return (
            <tr key={j.id}>
              <td>{j.nombre}</td>
              <td>{j.jugadas.carrera1}</td>
              <td>{j.jugadas.carrera2}</td>
              <td>{j.jugadas.carrera3}</td>
              <td>{resultado ? `${puntos} pts` : "Sin resultados"}</td>
              <td>
                <button
                  className="danger-button"
                  onClick={() => {
                    const confirmar = confirm("¿Eliminar esta jugada?");
                    if (confirmar) onDelete(j.id);
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};