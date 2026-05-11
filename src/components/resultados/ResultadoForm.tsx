import { useEffect, useMemo, useState } from "react";
import type { CarreraValida, Resultado } from "../../domain/types";
import { EmptyState } from "../ui/EmptyState";

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

const carreraCompleta = (
  resultadoCarrera:
    | {
      primero: number | null;
      segundo: number | null;
      tercero: number | null;
    }
    | undefined
) =>
  Boolean(
    resultadoCarrera?.primero &&
    resultadoCarrera?.segundo &&
    resultadoCarrera?.tercero
  );

export const ResultadoForm = ({
  resultado,
  jornadaId,
  carreras,
  disabled = false,
  onSave,
}: Props) => {
  const carrerasOrdenadas = useMemo(
    () => [...carreras].sort((a, b) => a.numeroCarrera - b.numeroCarrera),
    [carreras]
  );

  const siguienteCarrera = carrerasOrdenadas.find(
    (carrera) => !carreraCompleta(resultado?.resultados[carrera.numeroCarrera])
  );

  const [form, setForm] = useState<ResultadoInput>({
    primero: "",
    segundo: "",
    tercero: "",
  });

  useEffect(() => {
    if (!siguienteCarrera) return;

    const resultadoCarrera =
      resultado?.resultados[siguienteCarrera.numeroCarrera];

    setForm({
      primero: toInputValue(resultadoCarrera?.primero),
      segundo: toInputValue(resultadoCarrera?.segundo),
      tercero: toInputValue(resultadoCarrera?.tercero),
    });
  }, [resultado, siguienteCarrera]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!onSave || !siguienteCarrera) return;

    const numero = siguienteCarrera.numeroCarrera;

    const nuevoResultado: Resultado = {
      jornadaId,
      resultados: {
        ...(resultado?.resultados ?? {}),
        [numero]: {
          primero: toNumberOrNull(form.primero),
          segundo: toNumberOrNull(form.segundo),
          tercero: toNumberOrNull(form.tercero),
        },
      },
    };

    onSave(nuevoResultado);
  };

  if (carrerasOrdenadas.length === 0) {
    return (
      <EmptyState
        title="Sin carreras configuradas"
        description="Primero configura las carreras válidas de la jornada."
      />
    );
  }

  if (!siguienteCarrera) {
    return (
      <div className="resultado-ready-box">
        <strong>Resultados completos</strong>
        <p>Todas las carreras configuradas ya tienen resultado cargado.</p>
      </div>
    );
  }

  return (
    <div className="resultado-sequential-layout">
      <form onSubmit={handleSubmit} className="resultado-current-card">
        <div className="resultado-current-header">
          <div>
            <span>Carrera a cargar</span>
            <strong>Carrera {siguienteCarrera.numeroCarrera}</strong>
          </div>

          <em>{disabled ? "Bloqueada" : "Editable"}</em>
        </div>

        <div className="compact-fields-3">
          <div className="form-field">
            <label>1er lugar</label>

            <input
              type="number"
              disabled={disabled}
              value={form.primero}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  primero: e.target.value,
                }))
              }
            />
          </div>

          <div className="form-field">
            <label>2do lugar</label>

            <input
              type="number"
              disabled={disabled}
              value={form.segundo}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  segundo: e.target.value,
                }))
              }
            />
          </div>

          <div className="form-field">
            <label>3er lugar</label>

            <input
              type="number"
              disabled={disabled}
              value={form.tercero}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tercero: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {!disabled && onSave && (
          <div className="form-actions">
            <button type="submit">
              Guardar resultado carrera {siguienteCarrera.numeroCarrera}
            </button>
          </div>
        )}

        {disabled && (
          <p className="status-ok">Jornada finalizada: resultados bloqueados.</p>
        )}
      </form>
    </div>
  );
};
