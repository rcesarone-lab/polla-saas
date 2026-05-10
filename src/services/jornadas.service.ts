import type { Jornada } from "../domain/types";
import { storage } from "../api/storage";
import { STORAGE_KEYS } from "../storage/storage.keys";
import { registrarAuditoria } from "./auditoria.service";

const KEY_LIST = STORAGE_KEYS.JORNADAS;
const KEY_ACTUAL = STORAGE_KEYS.JORNADA_ACTUAL;

const NOMBRE_JORNADA = "Polla";

export const getFechaHoy = () => new Date().toISOString().slice(0, 10);

export const getJornadas = (): Jornada[] => {
  return storage.get<Jornada[]>(KEY_LIST, []);
};

export const saveJornadas = (jornadas: Jornada[]) => {
  storage.set(KEY_LIST, jornadas);
};

export const getJornadaActual = (): Jornada | null => {
  const jornadas = getJornadas();

  const raw = storage.get<string | Jornada | null>(KEY_ACTUAL, null);

  if (!raw) {
    return null;
  }

  if (typeof raw === "string") {
    return jornadas.find((jornada) => jornada.id === raw) ?? null;
  }

  return jornadas.find((jornada) => jornada.id === raw.id) ?? raw;
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
    estadoCierre: "ABIERTA",
    reaperturas: 0,
  };

  saveJornadas([...jornadas, nueva]);
  setJornadaActual(nueva);

  registrarAuditoria({
    jornadaId: nueva.id,
    accion: "CREAR_JORNADA",
    descripcion: `Se creó la jornada ${fecha}.`,
    severidad: "INFO",
  });

  return nueva;
};

export const finalizarJornada = (
  jornadaId: string,
  snapshotFinal?: {
    ganador: string;
    puntosGanador: number;
    ranking: {
      nombre: string;
      puntos: number;
    }[];
  }
) => {
  const jornadas = getJornadas();
  const fechaFinalizacion = new Date().toISOString();

  const nuevas = jornadas.map((jornada) =>
    jornada.id === jornadaId
      ? {
          ...jornada,
          estadoCierre: "FINALIZADA" as const,
          fechaFinalizacion,
          snapshotFinal,
        }
      : jornada
  );

  saveJornadas(nuevas);

  const actualizada = nuevas.find((jornada) => jornada.id === jornadaId);

  const actual = getJornadaActual();

  if (actual?.id === jornadaId && actualizada) {
    setJornadaActual(actualizada);
  }

  registrarAuditoria({
    jornadaId,
    accion: "FINALIZAR_JORNADA",
    descripcion: "La jornada fue finalizada y se generó snapshot histórico.",
    severidad: "CRITICAL",
  });
};

export const reabrirJornada = (jornadaId: string) => {
  const jornadas = getJornadas();
  const fechaReapertura = new Date().toISOString();

  const nuevas = jornadas.map((jornada) =>
    jornada.id === jornadaId
      ? {
          ...jornada,
          estadoCierre: "ABIERTA" as const,
          fechaReapertura,
          reaperturas: (jornada.reaperturas ?? 0) + 1,
        }
      : jornada
  );

  saveJornadas(nuevas);

  const actualizada = nuevas.find((jornada) => jornada.id === jornadaId);

  const actual = getJornadaActual();

  if (actual?.id === jornadaId && actualizada) {
    setJornadaActual(actualizada);
  }

  registrarAuditoria({
    jornadaId,
    accion: "REABRIR_JORNADA",
    descripcion: "La jornada fue reabierta para permitir nuevas modificaciones.",
    severidad: "WARNING",
  });
};