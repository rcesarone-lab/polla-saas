import type { Resultado } from "../domain/types";

const KEY = "resultados";

export const getResultados = (): Resultado[] => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const saveResultados = (resultados: Resultado[]) => {
  localStorage.setItem(KEY, JSON.stringify(resultados));
};

export const getResultadoByJornada = (jornadaId: string): Resultado | null => {
  const resultados = getResultados();
  return resultados.find((r) => r.jornadaId === jornadaId) ?? null;
};

export const saveResultadoByJornada = (resultado: Resultado) => {
  const resultados = getResultados();

  const existe = resultados.some((r) => r.jornadaId === resultado.jornadaId);

  const nuevos = existe
    ? resultados.map((r) =>
        r.jornadaId === resultado.jornadaId ? resultado : r
      )
    : [...resultados, resultado];

  saveResultados(nuevos);
};