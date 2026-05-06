import { useEffect, useState } from "react";
import type {
  CarreraValida,
  PosicionResultado,
  Resultado,
} from "../../domain/types";

type Props = {
  resultado: Resultado | null;
  jornadaId: string;
  carreras: CarreraValida[];
  onSave: (resultado: Resultado) => void;
};

type ResultadoInput = {
  primero: string;
  segundo: string;
  tercero: string;
};

const emptyResultadoInput = (): ResultadoInput => ({
  primero: "",
  segundo: "",
  tercero: "",
});

const toInputValue = (value: number | null | undefined) =>
  value === null || value === undefined ? "" : value.toString();

const toNumberOrNull = (value: string): number | null => {
  if (!value.trim()) return null;
  return Number(value);
};

export const ResultadoForm = ({
  resultado,
  jornadaId,
  carreras,
  onSave,
}: Props) => {
  const [resultados, setResultados] = useState<
    Record<number, ResultadoInput>
  >({});

  useEffect(() => {
    const nuevos: Record<number, ResultadoInput> = {};

    carreras.forEach((carrera) => {
      const numeroCarrera = carrera.numeroCarrera;
      const resultadoCarrera = resultado?.resultados[numeroCarrera];

      nuevos[numeroCarrera] = {
        primero: toInputValue(resultadoCarrera?.primero),
        segundo: toInputValue(resultadoCarrera?.segundo),
        tercero: toInputValue(resultadoCarrera?.tercero),
      };
    });

    setResultados(nuevos);
  }, [resultado, carreras]);

  const updateCampo = (
    carrera: number,
    campo: keyof ResultadoInput,
    value: string
  ) => {
    setResultados((prev) => ({
      ...prev,
      [carrera]: {
        ...(prev[carrera] ?? emptyResultadoInput()),
        [campo]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoResultado: Resultado = {
      jornadaId,
      resultados: {},
    };

    for (const carrera of carreras) {
      const numeroCarrera = carrera.numeroCarrera;
      const valores = resultados[numeroCarrera] ?? emptyResultadoInput();

      const numeros = [
        valores.primero,
        valores.segundo,
        valores.tercero,
      ]
        .filter((v) => v.trim())
        .map(Number);

      if (numeros.some((n) => isNaN(n) || n <= 0)) {
        alert(
          `Los resultados cargados en la carrera ${numeroCarrera} deben ser números mayores a 0`
        );
        return;
      }

      const resultadoCarrera: PosicionResultado = {
        primero: toNumberOrNull(valores.primero),
        segundo: toNumberOrNull(valores.segundo),
        tercero: toNumberOrNull(valores.tercero),
      };

      nuevoResultado.resultados[numeroCarrera] = resultadoCarrera;
    }

    onSave(nuevoResultado);
  };

  if (carreras.length === 0) {
    return (
      <p>
        No hay carreras válidas cargadas. Primero configura las carreras de la
        jornada.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="compact-form">
      {carreras.map((carrera) => {
        const numeroCarrera = carrera.numeroCarrera;
        const valores = resultados[numeroCarrera] ?? emptyResultadoInput();

        return (
          <div key={carrera.id} className="card">
            <h2>Carrera {numeroCarrera}</h2>

            <div className="compact-fields-3">
              <div className="form-field">
                <label>1er lugar</label>
                <input
                  type="number"
                  value={valores.primero}
                  onChange={(e) =>
                    updateCampo(numeroCarrera, "primero", e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>2do lugar</label>
                <input
                  type="number"
                  value={valores.segundo}
                  onChange={(e) =>
                    updateCampo(numeroCarrera, "segundo", e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>3er lugar</label>
                <input
                  type="number"
                  value={valores.tercero}
                  onChange={(e) =>
                    updateCampo(numeroCarrera, "tercero", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );
      })}

      <button type="submit">Guardar / actualizar resultados</button>
    </form>
  );
};