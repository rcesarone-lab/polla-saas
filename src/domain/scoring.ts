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