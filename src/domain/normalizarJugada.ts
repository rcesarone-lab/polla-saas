import type { CarreraValida, Retirado } from "./types";

export class JugadaValidationError extends Error {
  carrera: number;

  constructor(message: string, carrera: number) {
    super(message);
    this.carrera = carrera;
  }
}

export const validarCaballoJugada = (
  caballo: number,
  carrera: number,
  carreras: CarreraValida[],
  retirados: Retirado[]
): number => {
  const carreraInfo = carreras.find((c) => c.numeroCarrera === carrera);

  if (!carreraInfo) {
    throw new JugadaValidationError(
      `La carrera ${carrera} no está configurada`,
      carrera
    );
  }

  const max = carreraInfo.cantidadEjemplares;

  if (caballo < 1 || caballo > max) {
    throw new JugadaValidationError(
      `El caballo ${caballo} está fuera de rango para la carrera ${carrera}. Rango permitido: 1-${max}`,
      carrera
    );
  }

  const registroRetirados = retirados.find((r) => r.carrera === carrera);
  const caballosRetirados = registroRetirados?.caballos ?? [];

  if (caballosRetirados.includes(caballo)) {
    throw new JugadaValidationError(
      `El caballo ${caballo} está retirado en la carrera ${carrera}. Debes elegir otro ejemplar.`,
      carrera
    );
  }

  return caballo;
};