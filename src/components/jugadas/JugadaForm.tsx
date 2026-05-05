import { useEffect, useState } from "react";
import type { Jugada } from "../../domain/types";

type FormData = {
  nombre: string;
  carrera1: number;
  carrera2: number;
  carrera3: number;
};

type Props = {
  jugadaEditando: Jugada | null;
  onSubmit: (data: FormData) => void;
  onCancelEdit: () => void;
};

export const JugadaForm = ({
  jugadaEditando,
  onSubmit,
  onCancelEdit,
}: Props) => {
  const [nombre, setNombre] = useState("");
  const [c1, setC1] = useState("");
  const [c2, setC2] = useState("");
  const [c3, setC3] = useState("");

  useEffect(() => {
    if (!jugadaEditando) {
      setNombre("");
      setC1("");
      setC2("");
      setC3("");
      return;
    }

    setNombre(jugadaEditando.nombre);
    setC1(jugadaEditando.jugadas.carrera1.toString());
    setC2(jugadaEditando.jugadas.carrera2.toString());
    setC3(jugadaEditando.jugadas.carrera3.toString());
  }, [jugadaEditando]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    const n1 = Number(c1);
    const n2 = Number(c2);
    const n3 = Number(c3);

    if (isNaN(n1) || isNaN(n2) || isNaN(n3)) {
      alert("Todas las carreras deben ser números");
      return;
    }

    if (n1 <= 0 || n2 <= 0 || n3 <= 0) {
      alert("Los números deben ser mayores a 0");
      return;
    }

    onSubmit({
      nombre: nombre.trim(),
      carrera1: n1,
      carrera2: n2,
      carrera3: n3,
    });

    if (!jugadaEditando) {
      setNombre("");
      setC1("");
      setC2("");
      setC3("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div className="form-field">
        <label>Jugador</label>
        <input
          placeholder="Ej: César"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Carrera 1</label>
        <input
          type="number"
          placeholder="Nro caballo"
          value={c1}
          onChange={(e) => setC1(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Carrera 2</label>
        <input
          type="number"
          placeholder="Nro caballo"
          value={c2}
          onChange={(e) => setC2(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Carrera 3</label>
        <input
          type="number"
          placeholder="Nro caballo"
          value={c3}
          onChange={(e) => setC3(e.target.value)}
        />
      </div>

      <button type="submit">
        {jugadaEditando ? "Actualizar jugada" : "Guardar jugada"}
      </button>

      {jugadaEditando && (
        <button type="button" className="secondary-button" onClick={onCancelEdit}>
          Cancelar edición
        </button>
      )}
    </form>
  );
};