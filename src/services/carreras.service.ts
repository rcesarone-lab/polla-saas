import { storage } from "../api/storage";
import type { CarreraValida } from "../domain/types";

const KEY = "carrerasValidas";

export const getCarrerasValidas = (): CarreraValida[] => {
  return storage.get<CarreraValida[]>(KEY, []);
};

export const saveCarrerasValidas = (carreras: CarreraValida[]) => {
  storage.set(KEY, carreras);
};

export const getCarrerasByJornada = (jornadaId: string): CarreraValida[] => {
  return getCarrerasValidas()
    .filter((c) => c.jornadaId === jornadaId)
    .sort((a, b) => a.numeroCarrera - b.numeroCarrera);
};

export const addCarreraValida = (carrera: CarreraValida) => {
  const carreras = getCarrerasValidas();

  const existe = carreras.some(
    (c) =>
      c.jornadaId === carrera.jornadaId &&
      c.numeroCarrera === carrera.numeroCarrera
  );

  if (existe) {
    throw new Error("Ya existe esa carrera para esta jornada");
  }

  saveCarrerasValidas([...carreras, carrera]);
};

export const deleteCarreraValida = (id: string) => {
  const carreras = getCarrerasValidas();
  saveCarrerasValidas(carreras.filter((c) => c.id !== id));
};

export const deleteCarrerasByJornada = (jornadaId: string) => {
  const carreras = getCarrerasValidas();

  const nuevas = carreras.filter((c) => c.jornadaId !== jornadaId);

  saveCarrerasValidas(nuevas);
};