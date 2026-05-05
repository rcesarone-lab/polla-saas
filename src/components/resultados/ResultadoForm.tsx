import { useEffect, useState } from "react";
import type { Resultado } from "../../domain/types";

type Props = {
  resultado: Resultado | null;
  jornadaId: string;
  onSave: (resultado: Resultado) => void;
};

const toInputValue = (value: number | null | undefined) =>
  value === null || value === undefined ? "" : value.toString();

const toNumberOrNull = (value: string): number | null => {
  if (!value.trim()) return null;
  return Number(value);
};

export const ResultadoForm = ({ resultado, jornadaId, onSave }: Props) => {
  const [c1Primero, setC1Primero] = useState("");
  const [c1Segundo, setC1Segundo] = useState("");
  const [c1Tercero, setC1Tercero] = useState("");

  const [c2Primero, setC2Primero] = useState("");
  const [c2Segundo, setC2Segundo] = useState("");
  const [c2Tercero, setC2Tercero] = useState("");

  const [c3Primero, setC3Primero] = useState("");
  const [c3Segundo, setC3Segundo] = useState("");
  const [c3Tercero, setC3Tercero] = useState("");

  useEffect(() => {
    setC1Primero(toInputValue(resultado?.carrera1.primero));
    setC1Segundo(toInputValue(resultado?.carrera1.segundo));
    setC1Tercero(toInputValue(resultado?.carrera1.tercero));

    setC2Primero(toInputValue(resultado?.carrera2.primero));
    setC2Segundo(toInputValue(resultado?.carrera2.segundo));
    setC2Tercero(toInputValue(resultado?.carrera2.tercero));

    setC3Primero(toInputValue(resultado?.carrera3.primero));
    setC3Segundo(toInputValue(resultado?.carrera3.segundo));
    setC3Tercero(toInputValue(resultado?.carrera3.tercero));
  }, [resultado]);

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

    const numbers = values
      .filter((v) => v.trim())
      .map(Number);

    if (numbers.some((n) => isNaN(n) || n <= 0)) {
      alert("Los resultados cargados deben ser números mayores a 0");
      return;
    }

    const nuevoResultado: Resultado = {
      jornadaId,
      carrera1: {
        primero: toNumberOrNull(c1Primero),
        segundo: toNumberOrNull(c1Segundo),
        tercero: toNumberOrNull(c1Tercero),
      },
      carrera2: {
        primero: toNumberOrNull(c2Primero),
        segundo: toNumberOrNull(c2Segundo),
        tercero: toNumberOrNull(c2Tercero),
      },
      carrera3: {
        primero: toNumberOrNull(c3Primero),
        segundo: toNumberOrNull(c3Segundo),
        tercero: toNumberOrNull(c3Tercero),
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
      <button type="submit">Guardar / actualizar resultados</button>
    </form>
  );
};