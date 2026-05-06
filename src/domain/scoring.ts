import type { Jugada, PosicionResultado, Resultado } from "./types";
import { getConfiguracionPuntos } from "../services/configuracion.service";

const puntosPorPosicion = (
  numero: number,
  resultado: PosicionResultado
): number => {
  const config = getConfiguracionPuntos();

  if (!config) {
    return 0;
  }

  if (resultado.primero !== null && numero === resultado.primero) {
    return config.primerLugar;
  }

  if (resultado.segundo !== null && numero === resultado.segundo) {
    return config.segundoLugar;
  }

  if (resultado.tercero !== null && numero === resultado.tercero) {
    return config.tercerLugar;
  }

  return 0;
};

export const calcularDetalleDinamico = (
  jugada: Jugada,
  resultado: Resultado
) => {
  const puntosPorCarrera: Record<number, number> = {};
  let total = 0;

  Object.entries(jugada.jugadas).forEach(([carreraKey, caballo]) => {
    const carrera = Number(carreraKey);
    const resultadoCarrera = resultado.resultados[carrera];

    if (!resultadoCarrera) {
      puntosPorCarrera[carrera] = 0;
      return;
    }

    const puntos = puntosPorPosicion(caballo, resultadoCarrera);

    puntosPorCarrera[carrera] = puntos;
    total += puntos;
  });

  return {
    puntosPorCarrera,
    total,
  };
};

export const calcularPuntaje = (
  jugada: Jugada,
  resultado: Resultado
): number => {
  return calcularDetalleDinamico(jugada, resultado).total;
};