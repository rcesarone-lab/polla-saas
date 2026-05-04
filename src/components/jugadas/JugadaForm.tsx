import { useState } from "react";

type Props = {
  onSubmit: (data: {
    nombre: string;
    carrera1: number;
    carrera2: number;
    carrera3: number;
  }) => void;
};

export const JugadaForm = ({ onSubmit }: Props) => {
  const [nombre, setNombre] = useState("");
  const [c1, setC1] = useState("");
  const [c2, setC2] = useState("");
  const [c3, setC3] = useState("");

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
      nombre,
      carrera1: n1,
      carrera2: n2,
      carrera3: n3,
    });

    setNombre("");
    setC1("");
    setC2("");
    setC3("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="number"
        placeholder="Carrera 1"
        value={c1}
        onChange={(e) => setC1(e.target.value)}
      />

      <input
        type="number"
        placeholder="Carrera 2"
        value={c2}
        onChange={(e) => setC2(e.target.value)}
      />

      <input
        type="number"
        placeholder="Carrera 3"
        value={c3}
        onChange={(e) => setC3(e.target.value)}
      />

      <button type="submit">Guardar</button>
    </form>
  );
};