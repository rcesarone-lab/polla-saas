import { useEffect, useState } from "react";
import type { Jornada } from "../domain/types";
import {
  getJornadaActual,
  setJornadaActual,
  getJornadas,
  crearJornada,
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

  const addJornada = (nombre: string) => {
    const nueva = crearJornada(nombre);
    setJornadas((prev) => [...prev, nueva]);
    setJornada(nueva);
    setJornadaActual(nueva);
  };

  return {
    jornada,
    jornadas,
    changeJornada,
    addJornada,
  };
};