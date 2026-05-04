import type { Jugada, Resultado } from "../../domain/types";
import { calcularPuntaje } from "../../domain/scoring";

type Props = {
  jugadas: Jugada[];
  resultado: Resultado | null;
};

export const JugadaList = ({ jugadas, resultado }: Props) => {
  return (
    <ul>
      {jugadas.map((j) => {
        const puntos = resultado ? calcularPuntaje(j, resultado) : 0;

        return (
          <li key={j.id}>
            {j.nombre} → C1: {j.jugadas.carrera1} | C2:{" "}
            {j.jugadas.carrera2} | C3: {j.jugadas.carrera3}
            {" | "}
            <strong>{resultado ? `${puntos} pts` : "Sin resultados"}</strong>
          </li>
        );
      })}
    </ul>
  );
};