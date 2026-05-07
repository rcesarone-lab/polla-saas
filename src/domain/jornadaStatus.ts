import type { CarreraValida, Resultado } from "./types";

export type JornadaStatus = "ABIERTA" | "PARCIAL" | "FINALIZADA";

const resultadoCompleto = (resultadoCarrera: {
  primero: number | null;
  segundo: number | null;
  tercero: number | null;
}) => {
  return (
    resultadoCarrera.primero !== null &&
    resultadoCarrera.segundo !== null &&
    resultadoCarrera.tercero !== null
  );
};

export const calcularEstadoJornada = (
  carreras: CarreraValida[],
  resultado: Resultado | null,
  jornadaCerrada = false
): JornadaStatus => {
  if (jornadaCerrada) {
    return "FINALIZADA";
  }
  if (!resultado || carreras.length === 0) {
    return "ABIERTA";
  }

  const totalCarreras = carreras.length;

  const carrerasCompletas = carreras.filter((carrera) => {
    const resultadoCarrera = resultado.resultados[carrera.numeroCarrera];

    if (!resultadoCarrera) return false;

    return resultadoCompleto(resultadoCarrera);
  }).length;

  if (carrerasCompletas === 0) {
    return "ABIERTA";
  }

  if (carrerasCompletas < totalCarreras) {
    return "PARCIAL";
  }

  return "FINALIZADA";
};

export const getEstadoJornadaLabel = (
  status: JornadaStatus,
  reaperturas = 0
) => {
  if (status === "FINALIZADA") {
    return "Finalizada";
  }

  if (status === "PARCIAL") {
    return "Parcial";
  }

  if (reaperturas > 0) {
    return "Reabierta";
  }

  return "Abierta";
};

export const getEstadoJornadaClass = (
  status: JornadaStatus,
  reaperturas = 0
) => {
  if (status === "FINALIZADA") {
    return "status-final";
  }

  if (status === "PARCIAL") {
    return "status-partial";
  }

  if (reaperturas > 0) {
    return "status-reopen";
  }

  return "status-ok";
};

export const calcularProgresoJornada = (
  carreras: CarreraValida[],
  resultado: Resultado | null
) => {
  if (!resultado || carreras.length === 0) {
    return {
      completadas: 0,
      total: carreras.length,
      porcentaje: 0,
    };
  }

  const completadas = carreras.filter((carrera) => {
    const resultadoCarrera = resultado.resultados[carrera.numeroCarrera];

    if (!resultadoCarrera) return false;

    return resultadoCompleto(resultadoCarrera);
  }).length;

  const porcentaje = Math.round((completadas / carreras.length) * 100);

  return {
    completadas,
    total: carreras.length,
    porcentaje,
  };
};

export const getCarrerasCompletas = (
  carreras: CarreraValida[],
  resultado: Resultado | null
): number[] => {
  if (!resultado) return [];

  return carreras
    .filter((carrera) => {
      const resultadoCarrera = resultado.resultados[carrera.numeroCarrera];

      if (!resultadoCarrera) return false;

      return resultadoCompleto(resultadoCarrera);
    })
    .map((c) => c.numeroCarrera);
};

export const getCarrerasPendientes = (
  carreras: CarreraValida[],
  resultado: Resultado | null
): number[] => {
  const completas = getCarrerasCompletas(carreras, resultado);

  return carreras
    .map((c) => c.numeroCarrera)
    .filter((numero) => !completas.includes(numero));
};