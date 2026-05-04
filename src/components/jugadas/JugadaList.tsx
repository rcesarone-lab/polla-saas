import type { Jugada, Resultado } from "../../domain/types";
import { calcularPuntaje } from "../../domain/scoring";

type Props = {
  jugadas: Jugada[];
  resultado: Resultado | null;
  onDelete: (id: string) => void;
};

export const JugadaList = ({ jugadas, resultado, onDelete }: Props) => {
  return (
    <ul>
      {jugadas.map((j) => {
        const puntos = resultado ? calcularPuntaje(j, resultado) : 0;

        return (
          <li key={j.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{j.nombre}</strong> → C1: {j.jugadas.carrera1} | C2:{" "}
            {j.jugadas.carrera2} | C3: {j.jugadas.carrera3}
            {" | "}
            <span style={{ color: "green" }}>
              {resultado ? `${puntos} pts` : "Sin resultados"}
            </span>

            {"  "}
            <button
              style={{ marginLeft: "10px", background: "red" }}
              onClick={() => {
                const confirmDelete = confirm("¿Eliminar jugada?");
                if (confirmDelete) onDelete(j.id);
              }}
            >
              Eliminar
            </button>
          </li>
        );
      })}
    </ul>
  );
};