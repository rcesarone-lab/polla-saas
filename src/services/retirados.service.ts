import { storage } from "../api/storage";
import type { Retirado } from "../domain/types";
import { STORAGE_KEYS } from "../storage/storage.keys";

const KEY = STORAGE_KEYS.RETIRADOS;

export const getRetirados = (): Retirado[] => {
  return storage.get<Retirado[]>(KEY, []);
};

export const saveRetirados = (retirados: Retirado[]) => {
  storage.set(KEY, retirados);
};

export const getRetiradosByJornada = (jornadaId: string): Retirado[] => {
  return getRetirados().filter((r) => r.jornadaId === jornadaId);
};

export const addCaballoRetirado = (
  jornadaId: string,
  carrera: number,
  caballo: number
) => {
  const retirados = getRetirados();

  const registro = retirados.find(
    (r) => r.jornadaId === jornadaId && r.carrera === carrera
  );

  if (registro?.caballos.includes(caballo)) {
    throw new Error("Ese caballo ya está retirado en esa carrera");
  }

  if (registro) {
    const nuevos = retirados.map((r) =>
      r.id === registro.id
        ? { ...r, caballos: [...r.caballos, caballo].sort((a, b) => a - b) }
        : r
    );

    saveRetirados(nuevos);
    return;
  }

  const nuevo: Retirado = {
    id: Date.now().toString(),
    jornadaId,
    carrera,
    caballos: [caballo],
  };

  saveRetirados([...retirados, nuevo]);
};

export const deleteCaballoRetirado = (
  jornadaId: string,
  carrera: number,
  caballo: number
) => {
  const retirados = getRetirados();

  const nuevos = retirados
    .map((r) => {
      if (r.jornadaId !== jornadaId || r.carrera !== carrera) return r;

      return {
        ...r,
        caballos: r.caballos.filter((c) => c !== caballo),
      };
    })
    .filter((r) => r.caballos.length > 0);

  saveRetirados(nuevos);
};