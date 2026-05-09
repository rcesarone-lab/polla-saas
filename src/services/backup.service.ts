import { registrarAuditoria } from "./auditoria.service";

const BACKUP_KEYS = [
  "jornadas",
  "jornadaActual",
  "jugadas",
  "resultados",
  "carreras",
  "retirados",
  "configuracion_puntos",
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

  const backup = JSON.parse(contenido);

  if (
    !backup?.data ||
    backup.app !== "Polla SaaS" ||
    backup.version !== "localStorage-v1"
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