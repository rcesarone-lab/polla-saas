import { useEffect, useState } from "react";
import type { CarreraValida, Resultado } from "../../domain/types";

type ResultadoInput = {
  primero: string;
  segundo: string;
  tercero: string;
};

type Props = {
  resultado: Resultado | null;
  jornadaId: string;
  carreras: CarreraValida[];
  disabled?: boolean;
  onSave?: (resultado: Resultado) => void;
};

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
  disabled = false,
  onSave,
}: Props) => {
  const [resultados, setResultados] = useState<Record<number, ResultadoInput>>(
    {}
  );

  useEffect(() => {
    const nuevosResultados: Record<number, ResultadoInput> = {};

    carreras.forEach((carrera) => {
      const numero = carrera.numeroCarrera;
      const resultadoCarrera = resultado?.resultados[numero];

      nuevosResultados[numero] = {
        primero: toInputValue(resultadoCarrera?.primero),
        segundo: toInputValue(resultadoCarrera?.segundo),
        tercero: toInputValue(resultadoCarrera?.tercero),
      };
    });

    setResultados(nuevosResultados);
  }, [resultado, carreras]);

  const updateCampo = (
    numeroCarrera: number,
    campo: keyof ResultadoInput,
    valor: string
  ) => {
    setResultados((prev) => ({
      ...prev,
      [numeroCarrera]: {
        ...prev[numeroCarrera],
        [campo]: valor,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!onSave) return;

    const nuevoResultado: Resultado = {
      jornadaId,
      resultados: {},
    };

    for (const carrera of carreras) {
      const numero = carrera.numeroCarrera;

      const valores = resultados[numero];

      if (!valores) continue;

      nuevoResultado.resultados[numero] = {
        primero: toNumberOrNull(valores.primero),
        segundo: toNumberOrNull(valores.segundo),
        tercero: toNumberOrNull(valores.tercero),
      };
    }

    onSave(nuevoResultado);
  };

  if (carreras.length === 0) {
    return (
      <p>
        No hay carreras válidas configuradas. Primero debes cargarlas en
        Configuración.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="compact-form">
      {carreras.map((carrera) => {
        const numero = carrera.numeroCarrera;

        const valores = resultados[numero] ?? {
          primero: "",
          segundo: "",
          tercero: "",
        };

        return (
          <div key={carrera.id} className="card">
            <h2>Carrera {numero}</h2>

            <div className="compact-fields-3">
              <div className="form-field">
                <label>1er lugar</label>

                <input
                  type="number"
                  disabled={disabled}
                  value={valores.primero}
                  onChange={(e) =>
                    updateCampo(numero, "primero", e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>2do lugar</label>

                <input
                  type="number"
                  disabled={disabled}
                  value={valores.segundo}
                  onChange={(e) =>
                    updateCampo(numero, "segundo", e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>3er lugar</label>

                <input
                  type="number"
                  disabled={disabled}
                  value={valores.tercero}
                  onChange={(e) =>
                    updateCampo(numero, "tercero", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );
      })}

      {!disabled && onSave && (
        <button type="submit">Guardar / actualizar resultados</button>
      )}

      {disabled && (
        <p className="status-ok">
          Jornada finalizada: resultados bloqueados.
        </p>
      )}
    </form>
  );
};