export const STORAGE_KEYS = {
  JORNADAS: "jornadas",
  JORNADA_ACTUAL: "jornadaActual",
  JUGADAS: "jugadas",
  RESULTADOS: "resultados",
  CARRERAS: "carreras",
  RETIRADOS: "retirados",
  CONFIGURACION_PUNTOS: "configuracion_puntos",
  AUDITORIA_EVENTOS: "auditoria_eventos",
} as const;

export const LEGACY_STORAGE_KEYS = {
  CARRERAS_VALIDAS: "carrerasValidas",
  CONFIGURACION_PUNTOS: "configuracionPuntos",
} as const;

export const STORAGE_MIGRATION_KEYS = {
  STORAGE_KEYS_V1: "migration_storage_keys_v1",
} as const;