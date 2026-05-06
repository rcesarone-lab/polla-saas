import { useEffect, useState } from "react";
import type { Jugada, CarreraValida } from "../../domain/types";

type Props = {
  jugadaEditando: Jugada | null;
  carreras: CarreraValida[];
  onSubmit: (data: {
    nombre: string;
    jugadas: Record<number, number>;
  }) => {
    success: boolean;
    errorCarrera?: number;
  };
  onCancelEdit: () => void;
};

export const JugadaForm = ({
  jugadaEditando,
  carreras,
  onSubmit,
  onCancelEdit,
}: Props) => {
  const [nombre, setNombre] = useState("");
  const [jugadas, setJugadas] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!jugadaEditando) return;

    setNombre(jugadaEditando.nombre);

    const nuevasJugadas: Record<number, string> = {};

    Object.entries(jugadaEditando.jugadas).forEach(([carrera, caballo]) => {
      nuevasJugadas[Number(carrera)] = caballo.toString();
    });

    setJugadas(nuevasJugadas);
  }, [jugadaEditando]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    const jugadasNumericas: Record<number, number> = {};

    for (const carrera of carreras) {
      const valor = jugadas[carrera.numeroCarrera];

      if (!valor) {
        alert(`Falta cargar la carrera ${carrera.numeroCarrera}`);
        return;
      }

      jugadasNumericas[carrera.numeroCarrera] = Number(valor);
    }

    const result = onSubmit({
      nombre: nombre.trim(),
      jugadas: jugadasNumericas,
    });

    if (!result.success) {
      if (result.errorCarrera) {
        setJugadas((prev) => ({
          ...prev,
          [result.errorCarrera!]: "",
        }));
      }

      return;
    }

    setNombre("");
    setJugadas({});
  };

  return (
    <form onSubmit={handleSubmit} className="compact-form">
      <div className="form-field">
        <label>Jugador</label>

        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="dynamic-races-grid">
        {carreras.map((carrera) => (
          <div className="form-field" key={carrera.id}>
            <label>C{carrera.numeroCarrera}</label>

            <input
              type="number"
              value={jugadas[carrera.numeroCarrera] ?? ""}
              onChange={(e) =>
                setJugadas((prev) => ({
                  ...prev,
                  [carrera.numeroCarrera]: e.target.value,
                }))
              }
            />
          </div>
        ))}
      </div>

      <div className="actions-row">
        <button type="submit">
          {jugadaEditando ? "Actualizar" : "Guardar"}
        </button>

        {jugadaEditando && (
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setNombre("");
              setJugadas({});
              onCancelEdit();
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};