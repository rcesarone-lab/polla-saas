import { Fragment } from "react";
import type { CarreraValida, Jugada, Resultado } from "../../domain/types";
import { calcularDetalleDinamico } from "../../domain/scoring";

type Props = {
  jugadas: Jugada[];
  carreras: CarreraValida[];
  resultado: Resultado | null;
  onEdit: (jugada: Jugada) => void;
  onDelete: (id: string) => void;
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

  const jugadasOrdenadas = [...jugadas].sort((a, b) => {
    const puntosA = resultado ? calcularDetalleDinamico(a, resultado).total : 0;
    const puntosB = resultado ? calcularDetalleDinamico(b, resultado).total : 0;

    return puntosB - puntosA;
  });

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Jugador</th>

          {carreras.map((carrera) => (
            <Fragment key={carrera.id}>
              <th>C{carrera.numeroCarrera}</th>
              <th>P{carrera.numeroCarrera}</th>
            </Fragment>
          ))}

          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {jugadasOrdenadas.map((j) => {
          const detalle = resultado
            ? calcularDetalleDinamico(j, resultado)
            : null;

          return (
            <tr key={j.id}>
              <td>
                <strong>{j.nombre}</strong>

                {j.cambiosAutomaticos &&
                  j.cambiosAutomaticos.length > 0 && (
                    <div className="auto-change-list">
                      {j.cambiosAutomaticos.map((cambio, index) => (
                        <div key={index} className="auto-change">
                          ⚠️ {cambio}
                        </div>
                      ))}
                    </div>
                  )}
              </td>

              {carreras.map((carrera) => {
                const numeroCarrera = carrera.numeroCarrera;

                return (
                  <Fragment key={`${j.id}-${numeroCarrera}`}>
                    <td>{j.jugadas[numeroCarrera] ?? "-"}</td>

                    <td className="points-cell">
                      {detalle ? detalle.puntosPorCarrera[numeroCarrera] ?? 0 : "-"}
                    </td>
                  </Fragment>
                );
              })}

              <td className="total-cell">
                {detalle ? detalle.total : "-"}
              </td>

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