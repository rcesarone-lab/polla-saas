import { useState } from "react";
import type { Resultado } from "../../domain/types";

type Props = {
  resultado: Resultado | null;
  onSave: (resultado: Resultado) => void;
};

export const ResultadoForm = ({ resultado, onSave }: Props) => {
  const [c1Primero, setC1Primero] = useState(resultado?.carrera1.primero.toString() ?? "");
  const [c1Segundo, setC1Segundo] = useState(resultado?.carrera1.segundo.toString() ?? "");
  const [c1Tercero, setC1Tercero] = useState(resultado?.carrera1.tercero.toString() ?? "");

  const [c2Primero, setC2Primero] = useState(resultado?.carrera2.primero.toString() ?? "");
  const [c2Segundo, setC2Segundo] = useState(resultado?.carrera2.segundo.toString() ?? "");
  const [c2Tercero, setC2Tercero] = useState(resultado?.carrera2.tercero.toString() ?? "");

  const [c3Primero, setC3Primero] = useState(resultado?.carrera3.primero.toString() ?? "");
  const [c3Segundo, setC3Segundo] = useState(resultado?.carrera3.segundo.toString() ?? "");
  const [c3Tercero, setC3Tercero] = useState(resultado?.carrera3.tercero.toString() ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const values = [
      c1Primero,
      c1Segundo,
      c1Tercero,
      c2Primero,
      c2Segundo,
      c2Tercero,
      c3Primero,
      c3Segundo,
      c3Tercero,
    ];

    if (values.some((v) => !v.trim())) {
      alert("Debes cargar todos los resultados");
      return;
    }

    const numbers = values.map(Number);

    if (numbers.some((n) => isNaN(n) || n <= 0)) {
      alert("Todos los resultados deben ser números mayores a 0");
      return;
    }

    const nuevoResultado: Resultado = {
      carrera1: {
        primero: Number(c1Primero),
        segundo: Number(c1Segundo),
        tercero: Number(c1Tercero),
      },
      carrera2: {
        primero: Number(c2Primero),
        segundo: Number(c2Segundo),
        tercero: Number(c2Tercero),
      },
      carrera3: {
        primero: Number(c3Primero),
        segundo: Number(c3Segundo),
        tercero: Number(c3Tercero),
      },
    };

    onSave(nuevoResultado);
    alert("Resultados guardados");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Carrera 1</h2>
      <input type="number" placeholder="1er lugar" value={c1Primero} onChange={(e) => setC1Primero(e.target.value)} />
      <input type="number" placeholder="2do lugar" value={c1Segundo} onChange={(e) => setC1Segundo(e.target.value)} />
      <input type="number" placeholder="3er lugar" value={c1Tercero} onChange={(e) => setC1Tercero(e.target.value)} />

      <h2>Carrera 2</h2>
      <input type="number" placeholder="1er lugar" value={c2Primero} onChange={(e) => setC2Primero(e.target.value)} />
      <input type="number" placeholder="2do lugar" value={c2Segundo} onChange={(e) => setC2Segundo(e.target.value)} />
      <input type="number" placeholder="3er lugar" value={c2Tercero} onChange={(e) => setC2Tercero(e.target.value)} />

      <h2>Carrera 3</h2>
      <input type="number" placeholder="1er lugar" value={c3Primero} onChange={(e) => setC3Primero(e.target.value)} />
      <input type="number" placeholder="2do lugar" value={c3Segundo} onChange={(e) => setC3Segundo(e.target.value)} />
      <input type="number" placeholder="3er lugar" value={c3Tercero} onChange={(e) => setC3Tercero(e.target.value)} />

      <br />
      <button type="submit">Guardar resultados</button>
    </form>
  );
};