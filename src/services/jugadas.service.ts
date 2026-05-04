import type { Jugada } from "../domain/types";

const KEY = "jugadas";

export const getJugadas = (): Jugada[] => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const saveJugadas = (jugadas: Jugada[]) => {
  localStorage.setItem(KEY, JSON.stringify(jugadas));
};