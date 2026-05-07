import type { Jugada, Resultado, CarreraValida } from "../../domain/types";
import { calcularDetalleDinamico } from "../../domain/scoring";

type Props = {
  jugadas: Jugada[];
  carreras: CarreraValida[];
  resultado: Resultado | null;
  onEdit?: (jugada: Jugada) => void;
  onDelete?: (id: string) => void;
};

export const JugadaList = ({
  jugadas,
  carreras,
  resultado,
  onEdit,
  onDelete,
}: Props) => {
  if (jugadas.length === 0) {
    return <p>No hay jugadas cargadas.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Nombre</th>

          {carreras.map((c) => (
            <th key={c.id}>C{c.numeroCarrera}</th>
          ))}

          {resultado &&
            carreras.map((c) => (
              <th key={`p-${c.id}`}>P{c.numeroCarrera}</th>
            ))}

          {resultado && <th>Total</th>}

          {(onEdit || onDelete) && <th>Acciones</th>}
        </tr>
      </thead>

      <tbody>
        {jugadas.map((jugada) => {
          const detalle = resultado
            ? calcularDetalleDinamico(jugada, resultado)
            : null;

          return (
            <tr key={jugada.id}>
              <td>{jugada.nombre}</td>

              {carreras.map((c) => (
                <td key={`${jugada.id}-${c.id}`}>
                  {jugada.jugadas[c.numeroCarrera] ?? "-"}
                </td>
              ))}

              {resultado &&
                carreras.map((c) => (
                  <td
                    key={`pts-${jugada.id}-${c.id}`}
                    className="points-cell"
                  >
                    {detalle?.puntosPorCarrera[c.numeroCarrera] ?? 0}
                  </td>
                ))}

              {resultado && (
                <td className="total-cell">{detalle?.total ?? 0}</td>
              )}

              {(onEdit || onDelete) && (
                <td className="actions-cell">
                  {onEdit && (
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => onEdit(jugada)}
                    >
                      Editar
                    </button>
                  )}

                  {onDelete && (
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => onDelete(jugada.id)}
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};