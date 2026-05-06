import { useEffect, useState } from "react";
import type { CarreraValida } from "../domain/types";
import {
  addCarreraValida,
  deleteCarreraValida,
  getCarrerasByJornada,
} from "../services/carreras.service";

export const useCarreras = (jornadaId?: string) => {
  const [carreras, setCarreras] = useState<CarreraValida[]>([]);

  useEffect(() => {
    if (!jornadaId) return;
    setCarreras(getCarrerasByJornada(jornadaId));
  }, [jornadaId]);

  const agregarCarrera = (numeroCarrera: number, cantidadEjemplares: number) => {
    if (!jornadaId) return;

    const nueva: CarreraValida = {
      id: Date.now().toString(),
      jornadaId,
      numeroCarrera,
      cantidadEjemplares,
    };

    try {
      addCarreraValida(nueva);
      setCarreras(getCarrerasByJornada(jornadaId));
    } catch {
      alert("Ya existe esa carrera para esta jornada");
    }
  };

  const eliminarCarrera = (id: string) => {
    if (!jornadaId) return;

    deleteCarreraValida(id);
    setCarreras(getCarrerasByJornada(jornadaId));
  };

  return {
    carreras,
    agregarCarrera,
    eliminarCarrera,
  };
};