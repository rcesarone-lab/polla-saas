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
    const lista = getJornadas().sort((a, b) =>
      b.fecha.localeCompare(a.fecha)
    );

    setJornadas(lista);

    const actual = getJornadaActual();

    if (actual) {
      setJornada(actual);
      return;
    }

    const fallback = lista[0] ?? null;

    if (fallback) {
      setJornada(fallback);
      setJornadaActual(fallback);
    }
  }, []);

  const refreshJornadas = () => {
    const lista = getJornadas().sort((a, b) =>
      b.fecha.localeCompare(a.fecha)
    );

    setJornadas(lista);

    return lista;
  };

  const changeJornada = (id: string) => {
    const lista = refreshJornadas();

    const seleccionada = lista.find((j) => j.id === id) ?? null;

    if (!seleccionada) return;

    setJornada(seleccionada);
    setJornadaActual(seleccionada);
  };

  const addJornada = (fecha: string) => {
    const nueva = crearJornada(fecha);

    const lista = refreshJornadas();

    const creada = lista.find((j) => j.id === nueva.id) ?? nueva;

    setJornada(creada);
    setJornadaActual(creada);
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
    finalizarJornada(jornadaId, snapshotFinal);

    const lista = refreshJornadas();

    const actualizada = lista.find((j) => j.id === jornadaId) ?? null;

    if (actualizada) {
      setJornada(actualizada);
      setJornadaActual(actualizada);
    }
  };

  const reopenJornada = (jornadaId: string) => {
    reabrirJornada(jornadaId);

    const lista = refreshJornadas();

    const actualizada = lista.find((j) => j.id === jornadaId) ?? null;

    if (actualizada) {
      setJornada(actualizada);
      setJornadaActual(actualizada);
    }
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