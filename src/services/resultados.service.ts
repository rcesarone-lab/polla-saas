import type { Resultado } from "../domain/types";
import { storage } from "../api/storage";

const KEY = "resultados";

export const getResultados = (): Resultado[] => {
  return storage.get<Resultado[]>(KEY, []);
};

export const saveResultados = (resultados: Resultado[]) => {
  storage.set(KEY, resultados);
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

export const deleteResultadoByJornada = (jornadaId: string) => {
  const resultados = getResultados();
  const nuevos = resultados.filter((r) => r.jornadaId !== jornadaId);
  saveResultados(nuevos);
};