import type { Jornada } from "../domain/types";
import { storage } from "../api/storage";

const KEY_LIST = "jornadas";
const KEY_ACTUAL = "jornadaActual";

const NOMBRE_JORNADA = "Polla";

const getFechaHoy = () => new Date().toISOString().slice(0, 10);

export const getJornadas = (): Jornada[] => {
  return storage.get<Jornada[]>(KEY_LIST, []);
};

export const saveJornadas = (jornadas: Jornada[]) => {
  storage.set(KEY_LIST, jornadas);
};

export const getJornadaActual = (): Jornada => {
  const actual = storage.get<Jornada | null>(KEY_ACTUAL, null);

  if (actual) return actual;

  const jornadas = getJornadas();

  if (jornadas.length > 0) {
    storage.set(KEY_ACTUAL, jornadas[0]);
    return jornadas[0];
  }

  const hoy = getFechaHoy();

  const nueva: Jornada = {
    id: hoy,
    nombre: NOMBRE_JORNADA,
    fecha: hoy,
    fechaCreacion: new Date().toISOString(),
  };

  saveJornadas([nueva]);
  storage.set(KEY_ACTUAL, nueva);

  return nueva;
};

export const setJornadaActual = (jornada: Jornada) => {
  storage.set(KEY_ACTUAL, jornada);
};

export const crearJornada = (fecha: string): Jornada => {
  const jornadas = getJornadas();

  const existeFecha = jornadas.some((j) => j.fecha === fecha);

  if (existeFecha) {
    throw new Error("Ya existe una jornada para esa fecha");
  }

  const nueva: Jornada = {
    id: fecha,
    nombre: NOMBRE_JORNADA,
    fecha,
    fechaCreacion: new Date().toISOString(),
  };

  const nuevas = [...jornadas, nueva];
  saveJornadas(nuevas);

  return nueva;
};