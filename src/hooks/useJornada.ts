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

  return {
    jornada,
    jornadas,
    changeJornada,
    addJornada,
  };
};