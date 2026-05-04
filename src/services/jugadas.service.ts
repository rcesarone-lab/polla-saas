import type { Jugada } from "../domain/types";
import { storage } from "../api/storage";

const KEY = "jugadas";

export const getJugadas = (): Jugada[] => {
  return storage.get<Jugada[]>(KEY, []);
};

export const saveJugadas = (jugadas: Jugada[]) => {
  storage.set(KEY, jugadas);
};