import type { Jugada, Resultado } from "../../domain/types";
import { calcularPuntaje } from "../../domain/scoring";

type Props = {
  jugadas: Jugada[];
  resultado: Resultado | null;
};

export const Ranking = ({ jugadas, resultado }: Props) => {
  if (!resultado) {
    return <p>No hay resultados cargados</p>;
  }

  const ranking = jugadas
    .map((j) => ({
      nombre: j.nombre,
      puntos: calcularPuntaje(j, resultado),
    }))
    .sort((a, b) => b.puntos - a.puntos);

  return (
    <div>
      <h2>Ranking</h2>

      <ol>
        {ranking.map((r, index) => (
          <li key={index}>
            {r.nombre} → <strong>{r.puntos} pts</strong>
          </li>
        ))}
      </ol>
    </div>
  );
};