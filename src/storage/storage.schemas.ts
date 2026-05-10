import type {
  AuditoriaEvento,
  CarreraValida,
  ConfiguracionPuntos,
  Jornada,
  Jugada,
  Resultado,
  Retirado,
} from "../domain/types";

export interface StorageSchema {
  jornadas: Jornada[];
  jornadaActual: string | null;
  jugadas: Jugada[];
  resultados: Resultado[];
  carreras: CarreraValida[];
  retirados: Retirado[];
  configuracion_puntos: ConfiguracionPuntos | null;
  auditoria_eventos: AuditoriaEvento[];
}