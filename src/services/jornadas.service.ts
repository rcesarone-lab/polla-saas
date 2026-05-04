import type { Jornada } from "../domain/types";

const KEY_LIST = "jornadas";
const KEY_ACTUAL = "jornadaActual";

export const getJornadas = (): Jornada[] => {
  const data = localStorage.getItem(KEY_LIST);
  return data ? JSON.parse(data) : [];
};

export const saveJornadas = (jornadas: Jornada[]) => {
  localStorage.setItem(KEY_LIST, JSON.stringify(jornadas));
};

export const getJornadaActual = (): Jornada => {
  const actual = localStorage.getItem(KEY_ACTUAL);

  if (actual) {
    return JSON.parse(actual);
  }

  const jornadas = getJornadas();

  if (jornadas.length > 0) {
    localStorage.setItem(KEY_ACTUAL, JSON.stringify(jornadas[0]));
    return jornadas[0];
  }

  const nueva: Jornada = {
    id: Date.now().toString(),
    nombre: "Jornada 1",
    fechaCreacion: new Date().toISOString(),
  };

  saveJornadas([nueva]);
  localStorage.setItem(KEY_ACTUAL, JSON.stringify(nueva));

  return nueva;
};

export const setJornadaActual = (jornada: Jornada) => {
  localStorage.setItem(KEY_ACTUAL, JSON.stringify(jornada));
};

export const crearJornada = (nombre: string): Jornada => {
  const jornadas = getJornadas();

  const nueva: Jornada = {
    id: Date.now().toString(),
    nombre,
    fechaCreacion: new Date().toISOString(),
  };

  const nuevas = [...jornadas, nueva];
  saveJornadas(nuevas);

  return nueva;
};