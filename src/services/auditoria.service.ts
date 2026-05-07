import { storage } from "../api/storage";
import type { AuditoriaEvento } from "../domain/types";

const KEY = "auditoria_eventos";

export const getAuditoria = (): AuditoriaEvento[] => {
  return storage.get<AuditoriaEvento[]>(KEY, []);
};

export const getAuditoriaByJornada = (
  jornadaId: string
): AuditoriaEvento[] => {
  return getAuditoria()
    .filter((evento) => evento.jornadaId === jornadaId)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
};

export const registrarAuditoria = (
  evento: Omit<AuditoriaEvento, "id" | "fecha">
): AuditoriaEvento => {
  const eventos = getAuditoria();

  const nuevoEvento: AuditoriaEvento = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    ...evento,
  };

  storage.set(KEY, [nuevoEvento, ...eventos]);

  return nuevoEvento;
};

export const limpiarAuditoria = () => {
  storage.remove(KEY);
};