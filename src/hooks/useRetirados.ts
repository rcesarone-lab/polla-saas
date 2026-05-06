import { useEffect, useState } from "react";
import type { Retirado } from "../domain/types";
import {
  addCaballoRetirado,
  deleteCaballoRetirado,
  getRetiradosByJornada,
} from "../services/retirados.service";

export const useRetirados = (jornadaId?: string) => {
  const [retirados, setRetirados] = useState<Retirado[]>([]);

  useEffect(() => {
    if (!jornadaId) {
      setRetirados([]);
      return;
    }

    setRetirados(getRetiradosByJornada(jornadaId));
  }, [jornadaId]);

  const agregarRetirado = (carrera: number, caballo: number) => {
    if (!jornadaId) return;

    addCaballoRetirado(jornadaId, carrera, caballo);
    setRetirados(getRetiradosByJornada(jornadaId));
  };

  const eliminarRetirado = (carrera: number, caballo: number) => {
    if (!jornadaId) return;

    deleteCaballoRetirado(jornadaId, carrera, caballo);
    setRetirados(getRetiradosByJornada(jornadaId));
  };

  return {
    retirados,
    agregarRetirado,
    eliminarRetirado,
  };
};