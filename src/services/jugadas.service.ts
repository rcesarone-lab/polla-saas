import type { Jugada } from "../domain/types";
import { storage } from "../api/storage";
import { STORAGE_KEYS } from "../storage/storage.keys";

const KEY = STORAGE_KEYS.JUGADAS;

export const getJugadas = (): Jugada[] => {
  return storage.get<Jugada[]>(KEY, []);
};

export const saveJugadas = (jugadas: Jugada[]) => {
  storage.set(KEY, jugadas);
};