import { useState } from "react";
import type { CarreraValida, Retirado } from "../../domain/types";

type Props = {
  retirados: Retirado[];
  carreras: CarreraValida[];
  onAdd: (carrera: number, caballo: number) => void;
  onDelete: (carrera: number, caballo: number) => void;
};

export const RetiradosPanel = ({
  retirados,
  carreras,
  onAdd,
  onDelete,
}: Props) => {
  const [carrera, setCarrera] = useState("");
  const [caballo, setCaballo] = useState("");

  const handleAdd = () => {
    const nroCarrera = Number(carrera);
    const nroCaballo = Number(caballo);

    if (!nroCarrera) {
      alert("Debes seleccionar una carrera válida");
      return;
    }

    if (isNaN(nroCaballo) || nroCaballo <= 0) {
      alert("El caballo debe ser un número mayor a 0");
      return;
    }

    const carreraInfo = carreras.find((c) => c.numeroCarrera === nroCarrera);

    if (!carreraInfo) {
      alert("La carrera seleccionada no existe");
      return;
    }

    if (nroCaballo > carreraInfo.cantidadEjemplares) {
      alert(
        `El caballo ${nroCaballo} está fuera de rango. Carrera ${nroCarrera} permite 1-${carreraInfo.cantidadEjemplares}`
      );
      return;
    }

    onAdd(nroCarrera, nroCaballo);
    setCaballo("");
  };

  return (
    <div>
      <h2>Retirados</h2>

      {carreras.length === 0 ? (
        <p>No hay carreras válidas configuradas.</p>
      ) : (
        <>
          <div className="compact-form">
            <div className="compact-fields-2">
              <div className="form-field">
                <label>Carrera</label>
                <select
                  value={carrera}
                  onChange={(e) => setCarrera(e.target.value)}
                >
                  <option value="">Seleccione</option>

                  {carreras.map((c) => (
                    <option key={c.id} value={c.numeroCarrera}>
                      Carrera {c.numeroCarrera}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Caballo</label>
                <input
                  type="number"
                  value={caballo}
                  onChange={(e) => setCaballo(e.target.value)}
                  placeholder="Nro"
                />
              </div>
            </div>

            <button type="button" onClick={handleAdd}>
              Agregar
            </button>
          </div>

          {retirados.length === 0 ? (
            <p>No hay retirados cargados.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Carrera</th>
                  <th>Retirados</th>
                </tr>
              </thead>

              <tbody>
                {retirados.map((r) => (
                  <tr key={r.id}>
                    <td>Carrera {r.carrera}</td>
                    <td>
                      {r.caballos.map((caballo) => (
                        <button
                          key={caballo}
                          type="button"
                          className="secondary-button"
                          onClick={() => onDelete(r.carrera, caballo)}
                        >
                          {caballo} ✕
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};