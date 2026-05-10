import { registrarAuditoria } from "../services/auditoria.service";
import {
  LEGACY_STORAGE_KEYS,
  STORAGE_KEYS,
  STORAGE_MIGRATION_KEYS,
} from "./storage.keys";

const migrateKey = (fromKey: string, toKey: string) => {
  const oldValue = localStorage.getItem(fromKey);
  const newValue = localStorage.getItem(toKey);

  if (!oldValue || newValue) {
    return false;
  }

  localStorage.setItem(toKey, oldValue);

  return true;
};

export const runStorageMigrations = () => {
  const alreadyMigrated = localStorage.getItem(
    STORAGE_MIGRATION_KEYS.STORAGE_KEYS_V1
  );

  if (alreadyMigrated) {
    return;
  }

  const migratedCarreras = migrateKey(
    LEGACY_STORAGE_KEYS.CARRERAS_VALIDAS,
    STORAGE_KEYS.CARRERAS
  );

  const migratedConfiguracion = migrateKey(
    LEGACY_STORAGE_KEYS.CONFIGURACION_PUNTOS,
    STORAGE_KEYS.CONFIGURACION_PUNTOS
  );

  const didMigrate = migratedCarreras || migratedConfiguracion;

  if (didMigrate) {
    registrarAuditoria({
      accion: "MIGRAR_STORAGE_KEYS",
      descripcion:
        "Se migraron claves antiguas de localStorage al nuevo esquema centralizado.",
      severidad: "INFO",
    });
  }

  localStorage.setItem(STORAGE_MIGRATION_KEYS.STORAGE_KEYS_V1, "true");
};