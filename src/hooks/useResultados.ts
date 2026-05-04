import { useEffect, useState } from "react";
import type { Resultado } from "../domain/types";
import { getResultado, saveResultado } from "../services/resultados.service";

export const useResultados = () => {
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    setResultado(getResultado());
  }, []);

  const updateResultado = (nuevoResultado: Resultado) => {
    setResultado(nuevoResultado);
    saveResultado(nuevoResultado);
  };

  return {
    resultado,
    updateResultado,
  };
};