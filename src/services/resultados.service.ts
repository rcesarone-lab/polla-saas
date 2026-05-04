import type { Resultado } from "../domain/types";

const KEY = "resultado";

export const getResultado = (): Resultado | null => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
};

export const saveResultado = (resultado: Resultado) => {
  localStorage.setItem(KEY, JSON.stringify(resultado));
};