import { useState } from "react";
import type { CarreraValida } from "../../domain/types";

type Props = {
  carreras: CarreraValida[];
  onAdd: (numeroCarrera: number, cantidadEjemplares: number) => void;
  onDelete: (id: string) => void;
};

export const CarrerasPanel = ({ carreras, onAdd, onDelete }: Props) => {
  const [numeroCarrera, setNumeroCarrera] = useState("");
  const [cantidadEjemplares, setCantidadEjemplares] = useState("");

  const handleAdd = () => {
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

      <div className="form-grid">
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
          <label>Cantidad ejemplares</label>
          <input
            type="number"
            placeholder="Ej: 14"
            value={cantidadEjemplares}
            onChange={(e) => setCantidadEjemplares(e.target.value)}
          />
        </div>

        <button type="button" onClick={handleAdd}>
          Agregar carrera
        </button>
      </div>

      {carreras.length === 0 ? (
        <p>No hay carreras válidas cargadas.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Carrera</th>
              <th>Ejemplares</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {carreras.map((c) => (
              <tr key={c.id}>
                <td>Carrera {c.numeroCarrera}</td>
                <td>{c.cantidadEjemplares}</td>
                <td>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => {
                      const confirmar = confirm(
                        "¿Eliminar esta carrera válida?"
                      );

                      if (confirmar) {
                        onDelete(c.id);
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};