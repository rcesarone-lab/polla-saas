import { useState } from "react";
import type { Jornada } from "../../domain/types";

type Props = {
  jornadas: Jornada[];
  jornadaActual: Jornada | null;
  onChange: (id: string) => void;
  onCreate: (nombre: string) => void;
};

export const JornadaSelector = ({
  jornadas,
  jornadaActual,
  onChange,
  onCreate,
}: Props) => {
  const [nombre, setNombre] = useState("");

  return (
    <div style={{ marginBottom: "1rem" }}>
      <select
        value={jornadaActual?.id}
        onChange={(e) => onChange(e.target.value)}
      >
        {jornadas.map((j) => (
          <option key={j.id} value={j.id}>
            {j.nombre}
          </option>
        ))}
      </select>

      <input
        placeholder="Nueva jornada"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <button
        onClick={() => {
          if (!nombre.trim()) return;
          onCreate(nombre);
          setNombre("");
        }}
      >
        Crear
      </button>
    </div>
  );
};