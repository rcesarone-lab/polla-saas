import { useState } from "react";
import type { Jornada } from "../../domain/types";

const getFechaHoy = () => new Date().toISOString().slice(0, 10);

type Props = {
  jornadas: Jornada[];
  jornadaActual: Jornada | null;
  onChange: (id: string) => void;
  onCreate: (fecha: string) => void;
};

export const JornadaSelector = ({
  jornadas,
  jornadaActual,
  onChange,
  onCreate,
}: Props) => {
  const [fecha, setFecha] = useState(getFechaHoy());

  return (
    <div className="card">
      <h2>Jornada</h2>

      <div className="form-grid">
        <div className="form-field">
          <label>Seleccionar jornada</label>
          <select
            value={jornadaActual?.id ?? ""}
            onChange={(e) => onChange(e.target.value)}
          >
            {jornadas.map((j) => (
              <option key={j.id} value={j.id}>
                {j.nombre} - {j.fecha}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            if (!fecha) {
              alert("La fecha de la jornada es obligatoria");
              return;
            }

            onCreate(fecha);
            setFecha(getFechaHoy());
          }}
        >
          Crear jornada
        </button>
      </div>
    </div>
  );
};