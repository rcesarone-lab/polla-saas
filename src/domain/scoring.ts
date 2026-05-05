import type { Jugada, PosicionResultado, Resultado } from "./types";

const puntosPorPosicion = (
  numero: number,
  resultado: PosicionResultado
): number => {
  if (resultado.primero !== null && numero === resultado.primero) return 5;
  if (resultado.segundo !== null && numero === resultado.segundo) return 3;
  if (resultado.tercero !== null && numero === resultado.tercero) return 1;
  return 0;
};

export const calcularPuntaje = (
  jugada: Jugada,
  resultado: Resultado
): number => {
  let total = 0;

  total += puntosPorPosicion(jugada.jugadas.carrera1, resultado.carrera1);
  total += puntosPorPosicion(jugada.jugadas.carrera2, resultado.carrera2);
  total += puntosPorPosicion(jugada.jugadas.carrera3, resultado.carrera3);

  return total;
};

export const calcularDetalle = (jugada: Jugada, resultado: Resultado) => {
  const puntosPorPosicion = (
    numero: number,
    resultadoCarrera: PosicionResultado
  ): number => {
    if (resultadoCarrera.primero !== null && numero === resultadoCarrera.primero) return 5;
    if (resultadoCarrera.segundo !== null && numero === resultadoCarrera.segundo) return 3;
    if (resultadoCarrera.tercero !== null && numero === resultadoCarrera.tercero) return 1;
    return 0;
  };

  const c1 = puntosPorPosicion(jugada.jugadas.carrera1, resultado.carrera1);
  const c2 = puntosPorPosicion(jugada.jugadas.carrera2, resultado.carrera2);
  const c3 = puntosPorPosicion(jugada.jugadas.carrera3, resultado.carrera3);

  return {
    carrera1: c1,
    carrera2: c2,
    carrera3: c3,
    total: c1 + c2 + c3,
  };
};