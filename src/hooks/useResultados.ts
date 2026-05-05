import { useEffect, useState } from "react";
import type { Resultado } from "../domain/types";
import {
  getResultadoByJornada,
  saveResultadoByJornada,
  deleteResultadoByJornada,
} from "../services/resultados.service";

export const useResultados = (jornadaId?: string) => {
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    if (!jornadaId) return;
    setResultado(getResultadoByJornada(jornadaId));
  }, [jornadaId]);

  const updateResultado = (nuevoResultado: Resultado) => {
    setResultado(nuevoResultado);
    saveResultadoByJornada(nuevoResultado);
  };

  const deleteResultado = () => {
    if (!jornadaId) return;
    deleteResultadoByJornada(jornadaId);
    setResultado(null);
  };

  return {
    resultado,
    updateResultado,
    deleteResultado,
  };
};