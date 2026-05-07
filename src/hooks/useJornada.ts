import { useEffect, useState } from "react";
import type { Jornada } from "../domain/types";

import {
  getJornadaActual,
  setJornadaActual,
  getJornadas,
  crearJornada,
  finalizarJornada,
  reabrirJornada,
} from "../services/jornadas.service";

export const useJornada = () => {
  const [jornada, setJornada] = useState<Jornada | null>(null);
  const [jornadas, setJornadas] = useState<Jornada[]>([]);

  useEffect(() => {
    const lista = getJornadas();

    setJornadas(lista);

    const actual = getJornadaActual();

    if (actual) {
      setJornada(actual);
    }
  }, []);

  const changeJornada = (id: string) => {
    const seleccionada =
      jornadas.find((j) => j.id === id) ?? null;

    if (!seleccionada) return;

    setJornada(seleccionada);
    setJornadaActual(seleccionada);
  };

  const addJornada = (fecha: string) => {
    const nueva = crearJornada(fecha);

    const nuevas = [...jornadas, nueva];

    setJornadas(nuevas);
    setJornada(nueva);
    setJornadaActual(nueva);
  };

  const closeJornada = (
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
    if (!jornada) return;

    finalizarJornada(jornadaId, snapshotFinal);

    const actualizada: Jornada = {
      ...jornada,
      estadoCierre: "FINALIZADA",
      fechaFinalizacion: new Date().toISOString(),
      snapshotFinal,
    };

    setJornada(actualizada);

    setJornadas((prev) =>
      prev.map((j) =>
        j.id === jornadaId
          ? {
            ...j,
            estadoCierre: "FINALIZADA",
            fechaFinalizacion: new Date().toISOString(),
            snapshotFinal,
          }
          : j
      )
    );
  };

  const reopenJornada = (jornadaId: string) => {
    if (!jornada) return;

    reabrirJornada(jornadaId);

    const actualizada: Jornada = {
      ...jornada,
      estadoCierre: "ABIERTA",
      fechaReapertura: new Date().toISOString(),
      reaperturas: (jornada.reaperturas ?? 0) + 1,
    };

    setJornada(actualizada);

    setJornadas((prev) =>
      prev.map((j) =>
        j.id === jornadaId
          ? {
            ...j,
            estadoCierre: "ABIERTA" as const,
            fechaReapertura: new Date().toISOString(),
            reaperturas: (j.reaperturas ?? 0) + 1,
          }
          : j
      )
    );
  };

  return {
    jornada,
    jornadas,
    changeJornada,
    addJornada,
    closeJornada,
    reopenJornada,
  };
};