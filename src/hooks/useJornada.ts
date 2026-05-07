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
    const actual = getJornadaActual();
    const lista = getJornadas();

    setJornada(actual);
    setJornadas(lista);
  }, []);

  const changeJornada = (id: string) => {
    const nueva = jornadas.find((j) => j.id === id);
    if (!nueva) return;

    setJornada(nueva);
    setJornadaActual(nueva);
  };

  const addJornada = (fecha: string) => {
    try {
      const nueva = crearJornada(fecha);
      setJornadas((prev) => [...prev, nueva]);
      setJornada(nueva);
      setJornadaActual(nueva);
    } catch (error) {
      alert("Ya existe una jornada para esa fecha");
    }
  };

  const closeJornada = (jornadaId: string) => {
    if (!jornada) return;

    finalizarJornada(jornadaId);

    const actualizada: Jornada = {
      ...jornada,
      estadoCierre: "FINALIZADA",
    };

    setJornada(actualizada);
    setJornadas((prev) =>
      prev.map((j) =>
        j.id === jornadaId
          ? { ...j, estadoCierre: "FINALIZADA" }
          : j
      )
    );
  };

  const reopenJornada = (jornadaId: string) => {
    reabrirJornada(jornadaId);

    const actualizada = {
      ...jornada,
      estadoCierre: "ABIERTA" as const,
    };

    setJornada(actualizada);

    setJornadas((prev) =>
      prev.map((j) =>
        j.id === jornadaId
          ? { ...j, estadoCierre: "ABIERTA" as const }
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