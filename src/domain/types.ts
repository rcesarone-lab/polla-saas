export type Jugada = {
  id: string;
  jornadaId: string;
  nombre: string;
  jugadas: {
    carrera1: number;
    carrera2: number;
    carrera3: number;
  };
  fecha: string;
};

export type Resultado = {
  jornadaId: string;
  carrera1: {
    primero: number;
    segundo: number;
    tercero: number;
  };
  carrera2: {
    primero: number;
    segundo: number;
    tercero: number;
  };
  carrera3: {
    primero: number;
    segundo: number;
    tercero: number;
  };
};

export type PosicionResultado = {
  primero: number | null;
  segundo: number | null;
  tercero: number | null;
};

export type Resultado = {
  jornadaId: string;
  carrera1: PosicionResultado;
  carrera2: PosicionResultado;
  carrera3: PosicionResultado;
};