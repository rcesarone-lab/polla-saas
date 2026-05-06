import type {
  CarreraValida,
  PosicionResultado,
  Retirado,
  Resultado,
} from "./types";

const validarDuplicados = (
  resultadoCarrera: PosicionResultado,
  carrera: number
) => {
  const valores = [
    resultadoCarrera.primero,
    resultadoCarrera.segundo,
    resultadoCarrera.tercero,
  ].filter((v): v is number => v !== null);

  const unicos = new Set(valores);

  if (unicos.size !== valores.length) {
    throw new Error(
      `La carrera ${carrera} tiene caballos repetidos en el resultado`
    );
  }
};

const validarCaballoResultado = (
  caballo: number | null,
  carrera: number,
  carreras: CarreraValida[],
  retirados: Retirado[]
) => {
  if (caballo === null) return;

  const carreraInfo = carreras.find((c) => c.numeroCarrera === carrera);

  if (!carreraInfo) {
    throw new Error(`La carrera ${carrera} no está configurada`);
  }

  const max = carreraInfo.cantidadEjemplares;

  if (caballo < 1 || caballo > max) {
    throw new Error(
      `El caballo ${caballo} está fuera de rango en la carrera ${carrera}. Rango permitido: 1-${max}`
    );
  }

  const registroRetirados = retirados.find((r) => r.carrera === carrera);
  const caballosRetirados = registroRetirados?.caballos ?? [];

  if (caballosRetirados.includes(caballo)) {
    throw new Error(
      `El caballo ${caballo} está retirado en la carrera ${carrera}. No puede cargarse como resultado.`
    );
  }
};

export const validarResultado = (
  resultado: Resultado,
  carreras: CarreraValida[],
  retirados: Retirado[]
) => {
  for (const carrera of carreras) {
    const numeroCarrera = carrera.numeroCarrera;
    const resultadoCarrera = resultado.resultados[numeroCarrera];

    if (!resultadoCarrera) continue;

    validarDuplicados(resultadoCarrera, numeroCarrera);

    validarCaballoResultado(
      resultadoCarrera.primero,
      numeroCarrera,
      carreras,
      retirados
    );

    validarCaballoResultado(
      resultadoCarrera.segundo,
      numeroCarrera,
      carreras,
      retirados
    );

    validarCaballoResultado(
      resultadoCarrera.tercero,
      numeroCarrera,
      carreras,
      retirados
    );
  }
};