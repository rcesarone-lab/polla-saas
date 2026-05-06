import { storage } from "../api/storage";
import type { ConfiguracionPuntos } from "../domain/types";

const KEY = "configuracionPuntos";

export const getConfiguracionPuntos = (): ConfiguracionPuntos | null => {
  return storage.get<ConfiguracionPuntos | null>(KEY, null);
};

export const saveConfiguracionPuntos = (config: ConfiguracionPuntos) => {
  storage.set(KEY, config);
};

export const deleteConfiguracionPuntos = () => {
  storage.remove(KEY);
};