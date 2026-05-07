import type { Jornada } from "../domain/types";
import { storage } from "../api/storage";
import { registrarAuditoria } from "./auditoria.service";

const KEY_LIST = "jornadas";
const KEY_ACTUAL = "jornadaActual";

const NOMBRE_JORNADA = "Polla";

export const getFechaHoy = () => new Date().toISOString().slice(0, 10);

export const getJornadas = (): Jornada[] => {
  return storage.get<Jornada[]>(KEY_LIST, []);
};

export const saveJornadas = (jornadas: Jornada[]) => {
  storage.set(KEY_LIST, jornadas);
};

export const getJornadaActual = (): Jornada | null => {
  return storage.get<Jornada | null>(KEY_ACTUAL, null);
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

  const nuevas = [...jornadas, nueva];

  saveJornadas(nuevas);

  registrarAuditoria({
    jornadaId,
    accion: "FINALIZAR_JORNADA",
    descripcion: "La jornada fue finalizada y se generó snapshot histórico.",
    severidad: "CRITICAL",
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

  const nuevas = jornadas.map((jornada) =>
    jornada.id === jornadaId
      ? {
        ...jornada,
        estadoCierre: "FINALIZADA" as const,
        fechaFinalizacion: new Date().toISOString(),
        snapshotFinal,
      }
      : jornada
  );

  saveJornadas(nuevas);

  registrarAuditoria({
    jornadaId,
    accion: "FINALIZAR_JORNADA",
    descripcion: "La jornada fue finalizada y se generó snapshot histórico.",
    severidad: "CRITICAL",
  });

  const actual = getJornadaActual();

  if (actual?.id === jornadaId) {
    setJornadaActual({
      ...actual,
      estadoCierre: "FINALIZADA",
      fechaFinalizacion: new Date().toISOString(),
      snapshotFinal,
    });
  }
};

export const reabrirJornada = (jornadaId: string) => {
  const jornadas = getJornadas();

  const nuevas = jornadas.map((jornada) =>
    jornada.id === jornadaId
      ? {
        ...jornada,
        estadoCierre: "ABIERTA" as const,
        fechaReapertura: new Date().toISOString(),
        reaperturas: (jornada.reaperturas ?? 0) + 1,
      }
      : jornada
  );

  saveJornadas(nuevas);

  registrarAuditoria({
    jornadaId,
    accion: "REABRIR_JORNADA",
    descripcion: "La jornada fue reabierta para permitir nuevas modificaciones.",
    severidad: "WARNING",
  });

  const actual = getJornadaActual();

  if (actual?.id === jornadaId) {
    setJornadaActual({
      ...actual,
      estadoCierre: "ABIERTA",
      fechaReapertura: new Date().toISOString(),
      reaperturas: (actual.reaperturas ?? 0) + 1,
    });
  }
};