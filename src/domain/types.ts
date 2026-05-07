export type Jornada = {
  id: string;
  nombre: string;
  fecha: string;
  fechaCreacion: string;
  estadoCierre?: "ABIERTA" | "FINALIZADA";
  fechaFinalizacion?: string;
  fechaReapertura?: string;
  reaperturas?: number;
};

export type Jugada = {
  id: string;
  jornadaId: string;
  nombre: string;
  jugadas: Record<number, number>;
  fecha: string;
  cambiosAutomaticos?: string[];
};

export type PosicionResultado = {
  primero: number | null;
  segundo: number | null;
  tercero: number | null;
};

export type Resultado = {
  jornadaId: string;
  resultados: Record<number, PosicionResultado>;
};

export type ConfiguracionPuntos = {
  primerLugar: number;
  segundoLugar: number;
  tercerLugar: number;
};

export type CarreraValida = {
  id: string;
  jornadaId: string;
  numeroCarrera: number;
  cantidadEjemplares: number;
};

export type Retirado = {
  id: string;
  jornadaId: string;
  carrera: number;
  caballos: number[];
};