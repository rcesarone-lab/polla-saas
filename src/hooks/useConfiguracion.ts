import { useEffect, useState } from "react";
import type { ConfiguracionPuntos } from "../domain/types";
import {
  getConfiguracionPuntos,
  saveConfiguracionPuntos,
  deleteConfiguracionPuntos,
} from "../services/configuracion.service";

export const useConfiguracion = () => {
  const [configuracion, setConfiguracion] =
    useState<ConfiguracionPuntos | null>(null);

  useEffect(() => {
    setConfiguracion(getConfiguracionPuntos());
  }, []);

  const updateConfiguracion = (config: ConfiguracionPuntos) => {
    setConfiguracion(config);
    saveConfiguracionPuntos(config);
  };

  const deleteConfiguracion = () => {
    deleteConfiguracionPuntos();
    setConfiguracion(null);
  };

  return {
    configuracion,
    updateConfiguracion,
    deleteConfiguracion,
  };
};