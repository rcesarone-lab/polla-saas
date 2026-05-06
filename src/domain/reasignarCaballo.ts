import type { CarreraValida, Retirado } from "./types";

export const obtenerSiguienteDisponible = (
  caballo: number,
  carrera: number,
  carreras: CarreraValida[],
  retirados: Retirado[]
): number => {
  const carreraInfo = carreras.find((c) => c.numeroCarrera === carrera);

  if (!carreraInfo) {
    throw new Error(`Carrera ${carrera} no configurada`);
  }

  const max = carreraInfo.cantidadEjemplares;

  const registro = retirados.find((r) => r.carrera === carrera);
  const lista = registro?.caballos ?? [];

  let siguiente = caballo;

  for (let i = 0; i < max; i++) {
    siguiente = siguiente + 1 > max ? 1 : siguiente + 1;

    if (!lista.includes(siguiente)) {
      return siguiente;
    }
  }

  throw new Error("No hay caballos disponibles");
};