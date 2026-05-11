import type { Jugada, Resultado } from "../../domain/types";
import { calcularPuntaje } from "../../domain/scoring";
import { EmptyState } from "../ui/EmptyState";

type Props = {
  jugadas: Jugada[];
  resultado: Resultado | null;
};

export const Ranking = ({ jugadas, resultado }: Props) => {
  if (!resultado) {
    return (
      <EmptyState
        title="Ranking no disponible"
        description="El ranking aparecerá cuando existan resultados cargados."
      />
    );
  }

  const ranking = [...jugadas]
    .map((jugada) => ({
      nombre: jugada.nombre,
      puntos: calcularPuntaje(jugada, resultado),
    }))
    .sort((a, b) => b.puntos - a.puntos);

  if (ranking.length === 0) {
    return (
      <EmptyState
        title="Sin jugadas cargadas"
        description="Carga participantes para calcular el ranking."
      />
    );
  }

  return (
    <div>
      <h2>Ranking</h2>

      <ol className="dashboard-top-list">
        {ranking.map((item, index) => (
          <li key={`${item.nombre}-${index}`}>
            <span>{index + 1}</span>
            <strong>{item.nombre}</strong>
            <em>{item.puntos} pts</em>
          </li>
        ))}
      </ol>
    </div>
  );
};