import { registrarAuditoria } from "./auditoria.service";

type RankingItem = {
  nombre: string;
  puntos: number;
};

type HistoricoItem = {
  fecha: string;
  nombre: string;
  estado: string;
  totalJugadas: number;
  ganador: string;
  puntosGanador: number | string;
  top3: string;
  reaperturas: number;
  fechaFinalizacion: string;
};

type JugadaExportItem = {
  participante: string;
  jugadas: Record<number, number>;
  puntos: number;
};

type ResultadoExportItem = {
  carrera: number;
  primero: number | null;
  segundo: number | null;
  tercero: number | null;
};

const normalizarCSV = (value: string | number | null | undefined) => {
  const texto = String(value ?? "");
  return `"${texto.replace(/"/g, '""')}"`;
};

const descargarCSV = (filename: string, rows: string[][]) => {
  const contenido = rows
    .map((row) => row.map(normalizarCSV).join(";"))
    .join("\n");

  const blob = new Blob(["\uFEFF" + contenido], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

export const exportarRankingJornadaCSV = ({
  jornadaId,
  fecha,
  ranking,
}: {
  jornadaId: string;
  fecha: string;
  ranking: RankingItem[];
}) => {
  const rows = [
    ["Posición", "Participante", "Puntos"],
    ...ranking.map((item, index) => [
      String(index + 1),
      item.nombre,
      String(item.puntos),
    ]),
  ];

  descargarCSV(`ranking-jornada-${fecha}.csv`, rows);

  registrarAuditoria({
    jornadaId,
    accion: "EXPORTAR_RANKING_CSV",
    descripcion: `Se exportó el ranking de la jornada ${fecha} en formato CSV.`,
    severidad: "INFO",
  });
};

export const exportarHistoricoCSV = (historico: HistoricoItem[]) => {
  const fechaExport = new Date().toISOString().slice(0, 10);

  const rows = [
    [
      "Fecha",
      "Nombre",
      "Estado",
      "Total jugadas",
      "Ganador",
      "Puntos ganador",
      "Top 3",
      "Reaperturas",
      "Finalización",
    ],
    ...historico.map((item) => [
      item.fecha,
      item.nombre,
      item.estado,
      String(item.totalJugadas),
      item.ganador,
      String(item.puntosGanador),
      item.top3,
      String(item.reaperturas),
      item.fechaFinalizacion,
    ]),
  ];

  descargarCSV(`historico-polla-saas-${fechaExport}.csv`, rows);

  registrarAuditoria({
    accion: "EXPORTAR_HISTORICO_CSV",
    descripcion: "Se exportó el histórico completo en formato CSV.",
    severidad: "INFO",
  });
};

export const exportarJugadasJornadaCSV = ({
  jornadaId,
  fecha,
  carreras,
  jugadas,
}: {
  jornadaId: string;
  fecha: string;
  carreras: number[];
  jugadas: JugadaExportItem[];
}) => {
  const carrerasOrdenadas = [...carreras].sort((a, b) => a - b);

  const rows = [
    [
      "Participante",
      ...carrerasOrdenadas.map((carrera) => `Carrera ${carrera}`),
      "Puntos",
    ],
    ...jugadas.map((jugada) => [
      jugada.participante,
      ...carrerasOrdenadas.map((carrera) =>
        String(jugada.jugadas[carrera] ?? "-")
      ),
      String(jugada.puntos),
    ]),
  ];

  descargarCSV(`jugadas-jornada-${fecha}.csv`, rows);

  registrarAuditoria({
    jornadaId,
    accion: "EXPORTAR_JUGADAS_CSV",
    descripcion: `Se exportaron las jugadas de la jornada ${fecha} en formato CSV.`,
    severidad: "INFO",
  });
};

export const exportarResultadosJornadaCSV = ({
  jornadaId,
  fecha,
  resultados,
}: {
  jornadaId: string;
  fecha: string;
  resultados: ResultadoExportItem[];
}) => {
  const resultadosOrdenados = [...resultados].sort(
    (a, b) => a.carrera - b.carrera
  );

  const rows = [
    ["Carrera", "Primero", "Segundo", "Tercero"],
    ...resultadosOrdenados.map((resultado) => [
      String(resultado.carrera),
      String(resultado.primero ?? "-"),
      String(resultado.segundo ?? "-"),
      String(resultado.tercero ?? "-"),
    ]),
  ];

  descargarCSV(`resultados-jornada-${fecha}.csv`, rows);

  registrarAuditoria({
    jornadaId,
    accion: "EXPORTAR_RESULTADOS_CSV",
    descripcion: `Se exportaron los resultados de la jornada ${fecha} en formato CSV.`,
    severidad: "INFO",
  });
};