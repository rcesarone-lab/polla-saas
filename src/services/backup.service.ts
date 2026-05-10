import { registrarAuditoria } from "./auditoria.service";
import { STORAGE_KEYS } from "../storage/storage.keys";

const BACKUP_KEYS = [
  STORAGE_KEYS.JORNADAS,
  STORAGE_KEYS.JORNADA_ACTUAL,
  STORAGE_KEYS.JUGADAS,
  STORAGE_KEYS.RESULTADOS,
  STORAGE_KEYS.CARRERAS,
  STORAGE_KEYS.RETIRADOS,
  STORAGE_KEYS.CONFIGURACION_PUNTOS,
];

export const generarBackupLocal = () => {
  const data = BACKUP_KEYS.reduce<Record<string, unknown>>((acc, key) => {
    const value = localStorage.getItem(key);

    acc[key] = value ? JSON.parse(value) : null;

    return acc;
  }, {});

  return {
    app: "Polla SaaS",
    version: "localStorage-v1",
    fecha: new Date().toISOString(),
    data,
  };
};

export const descargarBackupLocal = () => {
  const backup = generarBackupLocal();

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = `polla-saas-backup-${backup.fecha.slice(0, 10)}.json`;

  link.click();

  URL.revokeObjectURL(url);

  registrarAuditoria({
    accion: "EXPORTAR_BACKUP",
    descripcion: "Se exportó un backup local en formato JSON.",
    severidad: "INFO",
  });
};

export const importarBackupLocal = async (file: File) => {
  const contenido = await file.text();

  let backup: {
    app?: string;
    version?: string;
    fecha?: string;
    data?: Record<string, unknown>;
  };

  try {
    backup = JSON.parse(contenido);
  } catch {
    throw new Error("El archivo seleccionado no es un JSON válido.");
  }

  const REQUIRED_KEYS = [
    STORAGE_KEYS.JORNADAS,
    STORAGE_KEYS.JUGADAS,
    STORAGE_KEYS.RESULTADOS,
  ];

  const tieneClavesMinimas = REQUIRED_KEYS.every((key) =>
    Object.prototype.hasOwnProperty.call(backup.data, key)
  );

  if (
    !backup?.data ||
    backup.app !== "Polla SaaS" ||
    backup.version !== "localStorage-v1" ||
    !tieneClavesMinimas
  ) {
    throw new Error(
      "El archivo no parece ser un backup válido de Polla SaaS."
    );
  }

  Object.entries(backup.data).forEach(([key, value]) => {
    if (value === null) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  });

  registrarAuditoria({
    accion: "IMPORTAR_BACKUP",
    descripcion:
      "Se importó un backup local y se reemplazaron los datos actuales.",
    severidad: "WARNING",
  });
};

export const leerMetadataBackup = async (file: File) => {
  const contenido = await file.text();

  let backup: {
    app?: string;
    version?: string;
    fecha?: string;
  };

  try {
    backup = JSON.parse(contenido);
  } catch {
    throw new Error("El archivo seleccionado no es un JSON válido.");
  }

  return {
    app: backup.app ?? "-",
    version: backup.version ?? "-",
    fecha: backup.fecha ?? "-",
  };
};