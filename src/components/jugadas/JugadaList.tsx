import type { Jugada, Resultado } from "../../domain/types";
import { calcularPuntaje } from "../../domain/scoring";
import { calcularDetalle } from "../../domain/scoring";

type Props = {
  jugadas: Jugada[];
  resultado: Resultado | null;
  onEdit: (jugada: Jugada) => void;
  onDelete: (id: string) => void;
};

export const JugadaList = ({ jugadas, resultado, onEdit, onDelete }: Props) => {
  if (jugadas.length === 0) {
    return <p>No hay jugadas cargadas.</p>;
  }

  const jugadasOrdenadas = [...jugadas].sort((a, b) => {
    const puntosA = resultado ? calcularPuntaje(a, resultado) : 0;
    const puntosB = resultado ? calcularPuntaje(b, resultado) : 0;

    return puntosB - puntosA;
  });

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Jugador</th>
          <th>C1</th>
          <th>P1</th>
          <th>C2</th>
          <th>P2</th>
          <th>C3</th>
          <th>P3</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {jugadasOrdenadas.map((j) => {
          const detalle = resultado ? calcularDetalle(j, resultado) : null;

          return (
            <tr key={j.id}>
              <td><strong>{j.nombre}</strong></td>

              <td>{j.jugadas.carrera1}</td>
              <td className="points-cell">{detalle ? detalle.carrera1 : "-"}</td>

              <td>{j.jugadas.carrera2}</td>
              <td className="points-cell">{detalle ? detalle.carrera2 : "-"}</td>

              <td>{j.jugadas.carrera3}</td>
              <td className="points-cell">{detalle ? detalle.carrera3 : "-"}</td>

              <td className="total-cell">{detalle ? detalle.total : "-"}</td>

              <td className="actions-cell">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => onEdit(j)}
                >
                  Editar
                </button>

                <button
                  type="button"
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