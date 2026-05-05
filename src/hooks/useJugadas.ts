import { useEffect, useState } from "react";
import type { Jugada } from "../domain/types";
import { getJugadas, saveJugadas } from "../services/jugadas.service";

export const useJugadas = () => {
  const [jugadas, setJugadas] = useState<Jugada[]>([]);

  useEffect(() => {
    setJugadas(getJugadas());
  }, []);

  const addJugada = (jugada: Jugada) => {
    const nuevas = [...jugadas, jugada];
    setJugadas(nuevas);
    saveJugadas(nuevas);
  };

  const deleteJugada = (id: string) => {
    const nuevas = jugadas.filter((j) => j.id !== id);
    setJugadas(nuevas);
    saveJugadas(nuevas);
  };

  const updateJugada = (jugadaActualizada: Jugada) => {
    const nuevas = jugadas.map((j) =>
      j.id === jugadaActualizada.id ? jugadaActualizada : j
    );

    setJugadas(nuevas);
    saveJugadas(nuevas);
  };

  return { jugadas, addJugada, updateJugada, deleteJugada };
};