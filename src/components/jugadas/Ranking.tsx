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

  const ranking = [...jugadas]
    .map((jugada) => ({
      nombre: jugada.nombre,
      puntos: calcularPuntaje(jugada, resultado),
    }))
    .sort((a, b) => b.puntos - a.puntos);

  if (ranking.length === 0) {
    return <p>No hay jugadas cargadas.</p>;
  }

  return (
    <div>
      <h2>Ranking</h2>

      <ol>
        {ranking.map((item, index) => (
          <li key={`${item.nombre}-${index}`}>
            {item.nombre} → <strong>{item.puntos} puntos</strong>
          </li>
        ))}
      </ol>
    </div>
  );
};