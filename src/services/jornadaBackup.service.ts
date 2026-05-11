import type {
  CarreraValida,
  Jornada,
  Jugada,
  Resultado,
} from "../domain/types";
import { storage } from "../api/storage";
import { STORAGE_KEYS } from "../storage/storage.keys";
import { registrarAuditoria } from "./auditoria.service";

export type JornadaExportPayload = {
  app: "Polla SaaS";
  version: "jornada-export-v1";
  fechaExportacion: string;
  jornada: Jornada;
  carreras: CarreraValida[];
  jugadas: Jugada[];
  resultado: Resultado | null;
};

const validarPayloadJornada = (
  payload: unknown
): payload is JornadaExportPayload => {
  if (!payload || typeof payload !== "object") return false;

  const data = payload as Partial<JornadaExportPayload>;

  return (
    data.app === "Polla SaaS" &&
    data.version === "jornada-export-v1" &&
    Boolean(data.jornada?.id) &&
    Array.isArray(data.carreras) &&
    Array.isArray(data.jugadas)
  );
};

export const exportarJornadaCompleta = ({
  jornada,
  carreras,
  jugadas,
  resultado,
}: {
  jornada: Jornada;
  carreras: CarreraValida[];
  jugadas: Jugada[];
  resultado: Resultado | null;
}) => {
  const payload: JornadaExportPayload = {
    app: "Polla SaaS",
    version: "jornada-export-v1",
    fechaExportacion: new Date().toISOString(),
    jornada,
    carreras,
    jugadas,
    resultado,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `jornada-${jornada.fecha}.json`;
  link.click();

  URL.revokeObjectURL(url);

  registrarAuditoria({
    jornadaId: jornada.id,
    accion: "EXPORTAR_JORNADA",
    descripcion: `Se exportó la jornada ${jornada.fecha} completa en formato JSON.`,
    severidad: "INFO",
  });
};

export const importarJornadaCompleta = async (file: File): Promise<Jornada> => {
  const contenido = await file.text();

  let payload: unknown;

  try {
    payload = JSON.parse(contenido);
  } catch {
    throw new Error("El archivo seleccionado no es un JSON válido.");
  }

  if (!validarPayloadJornada(payload)) {
    throw new Error("El archivo no corresponde a una jornada válida de Polla SaaS.");
  }

  const jornadas = storage.get<Jornada[]>(STORAGE_KEYS.JORNADAS, []);
  const carreras = storage.get<CarreraValida[]>(STORAGE_KEYS.CARRERAS, []);
  const jugadas = storage.get<Jugada[]>(STORAGE_KEYS.JUGADAS, []);
  const resultados = storage.get<Resultado[]>(STORAGE_KEYS.RESULTADOS, []);

  const jornadaId = payload.jornada.id;

  const nuevasJornadas = [
    ...jornadas.filter((item) => item.id !== jornadaId),
    payload.jornada,
  ];

  const nuevasCarreras = [
    ...carreras.filter((item) => item.jornadaId !== jornadaId),
    ...payload.carreras,
  ];

  const nuevasJugadas = [
    ...jugadas.filter((item) => item.jornadaId !== jornadaId),
    ...payload.jugadas,
  ];

  const nuevosResultados = payload.resultado
    ? [
        ...resultados.filter((item) => item.jornadaId !== jornadaId),
        payload.resultado,
      ]
    : resultados.filter((item) => item.jornadaId !== jornadaId);

  storage.set(STORAGE_KEYS.JORNADAS, nuevasJornadas);
  storage.set(STORAGE_KEYS.CARRERAS, nuevasCarreras);
  storage.set(STORAGE_KEYS.JUGADAS, nuevasJugadas);
  storage.set(STORAGE_KEYS.RESULTADOS, nuevosResultados);
  storage.set(STORAGE_KEYS.JORNADA_ACTUAL, payload.jornada);

  registrarAuditoria({
    jornadaId,
    accion: "IMPORTAR_JORNADA",
    descripcion: `Se importó la jornada ${payload.jornada.fecha} desde archivo JSON.`,
    severidad: "WARNING",
  });

  return payload.jornada;
};