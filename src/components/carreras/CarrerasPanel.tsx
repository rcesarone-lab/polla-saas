import { useState } from "react";
import type { CarreraValida } from "../../domain/types";

type Props = {
  carreras: CarreraValida[];
  disabled?: boolean;
  onAdd?: (numeroCarrera: number, cantidadEjemplares: number) => void;
  onDelete?: (id: string) => void;
  onDeleteAll?: () => void;
};

export const CarrerasPanel = ({
  carreras,
  disabled = false,
  onAdd,
  onDelete,
  onDeleteAll,
}: Props) => {
  const [numeroCarrera, setNumeroCarrera] = useState("");
  const [cantidadEjemplares, setCantidadEjemplares] = useState("");

  const handleAdd = () => {
    if (!onAdd) return;

    const numero = Number(numeroCarrera);
    const cantidad = Number(cantidadEjemplares);

    if (isNaN(numero) || numero <= 0) {
      alert("El número de carrera debe ser mayor a 0");
      return;
    }

    if (isNaN(cantidad) || cantidad <= 0) {
      alert("La cantidad de ejemplares debe ser mayor a 0");
      return;
    }

    onAdd(numero, cantidad);

    setNumeroCarrera("");
    setCantidadEjemplares("");
  };

  return (
    <div>
      <h2>Carreras válidas</h2>

      {disabled && (
        <p className="status-ok">
          Jornada finalizada: configuración de carreras bloqueada.
        </p>
      )}

      {!disabled && onAdd && (
        <div className="compact-form">
          <div className="compact-fields-2">
            <div className="form-field">
              <label>Nro. carrera</label>
              <input
                type="number"
                placeholder="Ej: 7"
                value={numeroCarrera}
                onChange={(e) => setNumeroCarrera(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Ejemplares</label>
              <input
                type="number"
                placeholder="Ej: 14"
                value={cantidadEjemplares}
                onChange={(e) => setCantidadEjemplares(e.target.value)}
              />
            </div>
          </div>

          <div className="actions-row">
            <button type="button" onClick={handleAdd}>
              Agregar
            </button>

            {carreras.length > 0 && onDeleteAll && (
              <button
                type="button"
                className="danger-button small"
                onClick={onDeleteAll}
              >
                Eliminar todas
              </button>
            )}
          </div>
        </div>
      )}

      {carreras.length === 0 ? (
        <p>No hay carreras válidas cargadas.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Carrera</th>
              <th>Ejemplares</th>
              {onDelete && <th>Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {carreras.map((c) => (
              <tr key={c.id}>
                <td>Carrera {c.numeroCarrera}</td>
                <td>{c.cantidadEjemplares}</td>

                {onDelete && (
                  <td>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => onDelete(c.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};